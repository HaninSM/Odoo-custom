# -*- coding: utf-8 -*-
import json
import logging
from odoo import http
from odoo.http import request, Response

_logger = logging.getLogger(__name__)


def _json_response(data, status=200):
    """Helper untuk menghasilkan HTTP JSON response berserta CORS headers."""
    headers = [
        ('Content-Type', 'application/json'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key, X-Requested-With'),
    ]
    return Response(
        json.dumps(data, default=str),
        status=status,
        headers=headers
    )


class InvoPosMasterBarangController(http.Controller):
    """
    REST API Controller untuk Master Barang & Satuan Jual Invo. POS.
    Mendukung integrasi dua arah (Dual Architecture):
    1. Native module model ('x_pos_item' & 'x_pos_unit')
    2. Studio cloud model ('x_master_barang' & 'x_master_barang_line_022fd')
    """

    def _get_active_model_names(self):
        env = request.env
        if 'x_pos_item' in env:
            return 'x_pos_item', 'x_pos_unit', 'x_pos_batch'
        elif 'x_master_barang' in env:
            return 'x_master_barang', 'x_master_barang_line_022fd', 'x_pos_batch'
        return None, None, None

    # --------------------------------------------------------------------------
    # CORS PREFLIGHT OPTIONS HANDLER
    # --------------------------------------------------------------------------
    @http.route([
        '/api/invo_pos/items',
        '/api/invo_pos/items/<int:item_id>'
    ], type='http', auth='none', methods=['OPTIONS'], csrf=False)
    def api_options_handler(self, **kwargs):
        """Menangani CORS preflight dari client browser / frontend SPA."""
        return _json_response({'status': 'ok'}, status=200)

    # --------------------------------------------------------------------------
    # 1. GET /api/invo_pos/items : DAFTAR MASTER BARANG & VARIAN
    # --------------------------------------------------------------------------
    @http.route('/api/invo_pos/items', type='http', auth='public', methods=['GET'], csrf=False)
    def get_items(self, **kwargs):
        """
        Mengambil daftar master barang beserta varian satuan jual dan stok siap jual.
        Query Parameters opsional:
        - search: kata kunci pencarian nama barang
        - limit: batasan jumlah record (default: 50)
        - offset: offset pagination (default: 0)
        """
        try:
            item_model_name, unit_model_name, batch_model_name = self._get_active_model_names()
            if not item_model_name:
                return _json_response({
                    'status': 'error',
                    'message': 'Model master barang belum terpasang di database Odoo ini.'
                }, status=500)

            env = request.env(su=True)
            domain = []

            search_query = kwargs.get('search')
            if search_query:
                domain.append(('x_name', 'ilike', search_query))

            limit = int(kwargs.get('limit', 50))
            offset = int(kwargs.get('offset', 0))

            items = env[item_model_name].search(domain, limit=limit, offset=offset, order='id asc')
            total_count = env[item_model_name].search_count(domain)

            results = []
            for item in items:
                # Normalisasi pembacaan field untuk native vs studio
                base_unit = getattr(item, 'x_base_unit', False) or getattr(item, 'x_studio_satuan_dasar_meter_pcs_kg', '')
                total_stock = getattr(item, 'x_total_stock', False) or getattr(item, 'x_studio_total_stok_gudang', 0.0)
                category = getattr(item, 'x_category', '')
                description = getattr(item, 'x_description', '')

                # Ambil daftar varian anak
                variants = []
                if unit_model_name == 'x_pos_unit':
                    unit_records = item.x_unit_ids
                    for u in unit_records:
                        variants.append({
                            'id': u.id,
                            'name': u.x_name,
                            'display_name': u.x_display_name,
                            'conversion_factor': u.x_conversion_factor,
                            'pricing_method': u.x_pricing_method,
                            'margin_percentage': u.x_margin_percentage,
                            'selling_price': u.x_selling_price,
                            'stock_mode': u.x_stock_mode,
                            'allocated_stock': u.x_allocated_stock,
                            'available_stock': u.x_available_sale_stock,
                            'is_active': u.x_is_active,
                        })
                else:
                    # Studio model: x_master_barang_line_022fd
                    unit_records = env[unit_model_name].search([
                        ('x_master_barang_id', '=', item.id)
                    ])
                    for u in unit_records:
                        variants.append({
                            'id': u.id,
                            'name': u.x_name or u.display_name,
                            'display_name': u.display_name,
                            'conversion_factor': getattr(u, 'x_studio_kebutuhan_bahan', 1.0),
                            'pricing_method': getattr(u, 'x_studio_skema_harga', 'manual'),
                            'margin_percentage': getattr(u, 'x_studio_margin_persen', 0.0),
                            'selling_price': getattr(u, 'x_studio_harga_jual', 0.0),
                            'stock_mode': getattr(u, 'x_studio_mode_stok', 'floating'),
                            'allocated_stock': getattr(u, 'x_studio_kuota_alokasi', 0.0),
                            'available_stock': getattr(u, 'x_studio_stok_siap_jual', 0.0),
                            'is_purchased': getattr(u, 'x_studio_is_purchased', False),
                        })

                results.append({
                    'id': item.id,
                    'name': item.x_name,
                    'base_unit': base_unit,
                    'category': category,
                    'description': description,
                    'total_stock': total_stock,
                    'variant_count': len(variants),
                    'variants': variants
                })

            return _json_response({
                'status': 'success',
                'count': len(results),
                'total_count': total_count,
                'limit': limit,
                'offset': offset,
                'data': results
            }, status=200)

        except Exception as e:
            _logger.exception("Error in GET /api/invo_pos/items: %s", str(e))
            return _json_response({
                'status': 'error',
                'message': str(e)
            }, status=500)

    # --------------------------------------------------------------------------
    # 2. GET /api/invo_pos/items/<id> : DETAIL MASTER BARANG & KARTU FIFO BATCH
    # --------------------------------------------------------------------------
    @http.route('/api/invo_pos/items/<int:item_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_item_detail(self, item_id, **kwargs):
        """
        Mengambil detail 1 master barang lengkap dengan varian dan kartu batch FIFO aktif.
        """
        try:
            item_model_name, unit_model_name, batch_model_name = self._get_active_model_names()
            if not item_model_name:
                return _json_response({
                    'status': 'error',
                    'message': 'Model belum terpasang.'
                }, status=500)

            env = request.env(su=True)
            item = env[item_model_name].browse(item_id)
            if not item.exists():
                return _json_response({
                    'status': 'error',
                    'message': f'Master barang dengan ID {item_id} tidak ditemukan.'
                }, status=404)

            base_unit = getattr(item, 'x_base_unit', False) or getattr(item, 'x_studio_satuan_dasar_meter_pcs_kg', '')
            total_stock = getattr(item, 'x_total_stock', False) or getattr(item, 'x_studio_total_stok_gudang', 0.0)
            category = getattr(item, 'x_category', '')
            description = getattr(item, 'x_description', '')

            # Varian
            variants = []
            if unit_model_name == 'x_pos_unit':
                for u in item.x_unit_ids:
                    variants.append({
                        'id': u.id,
                        'name': u.x_name,
                        'display_name': u.x_display_name,
                        'conversion_factor': u.x_conversion_factor,
                        'pricing_method': u.x_pricing_method,
                        'margin_percentage': u.x_margin_percentage,
                        'selling_price': u.x_selling_price,
                        'stock_mode': u.x_stock_mode,
                        'allocated_stock': u.x_allocated_stock,
                        'available_stock': u.x_available_sale_stock,
                    })
            else:
                unit_records = env[unit_model_name].search([('x_master_barang_id', '=', item.id)])
                for u in unit_records:
                    variants.append({
                        'id': u.id,
                        'name': u.x_name or u.display_name,
                        'display_name': u.display_name,
                        'conversion_factor': getattr(u, 'x_studio_kebutuhan_bahan', 1.0),
                        'pricing_method': getattr(u, 'x_studio_skema_harga', 'manual'),
                        'margin_percentage': getattr(u, 'x_studio_margin_persen', 0.0),
                        'selling_price': getattr(u, 'x_studio_harga_jual', 0.0),
                        'stock_mode': getattr(u, 'x_studio_mode_stok', 'floating'),
                        'allocated_stock': getattr(u, 'x_studio_kuota_alokasi', 0.0),
                        'available_stock': getattr(u, 'x_studio_stok_siap_jual', 0.0),
                        'is_purchased': getattr(u, 'x_studio_is_purchased', False),
                    })

            # Kartu Batch FIFO
            batches = []
            if batch_model_name and batch_model_name in env:
                batch_domain = [('x_item_id', '=', item.id)] if 'x_item_id' in env[batch_model_name]._fields else []
                batch_records = env[batch_model_name].search(batch_domain, order='id asc')
                for b in batch_records:
                    batches.append({
                        'id': b.id,
                        'name': getattr(b, 'x_name', f"Batch-{b.id}"),
                        'initial_quantity': getattr(b, 'x_initial_quantity', 0.0),
                        'remaining_quantity': getattr(b, 'x_remaining_quantity', 0.0),
                        'cost_per_unit': getattr(b, 'x_base_cost_price', 0.0) or getattr(b, 'x_cost_per_unit', 0.0),
                        'received_date': str(getattr(b, 'x_received_date', '') or ''),
                        'state': getattr(b, 'x_state', 'active')
                    })

            return _json_response({
                'status': 'success',
                'data': {
                    'id': item.id,
                    'name': item.x_name,
                    'base_unit': base_unit,
                    'category': category,
                    'description': description,
                    'total_stock': total_stock,
                    'variants': variants,
                    'fifo_batches': batches
                }
            }, status=200)

        except Exception as e:
            _logger.exception("Error in GET /api/invo_pos/items/%s: %s", item_id, str(e))
            return _json_response({
                'status': 'error',
                'message': str(e)
            }, status=500)

    # --------------------------------------------------------------------------
    # 3. POST /api/invo_pos/items : BUAT MASTER BARANG & VARIAN BARU
    # --------------------------------------------------------------------------
    @http.route('/api/invo_pos/items', type='http', auth='public', methods=['POST'], csrf=False)
    def create_item(self, **kwargs):
        """
        Membuat Master Barang baru beserta varian satuan jual secara terprogram via JSON Payload.
        """
        try:
            item_model_name, unit_model_name, _ = self._get_active_model_names()
            if not item_model_name:
                return _json_response({
                    'status': 'error',
                    'message': 'Model master barang belum terpasang.'
                }, status=500)

            raw_data = request.httprequest.data
            if not raw_data:
                return _json_response({
                    'status': 'error',
                    'message': 'Request body tidak boleh kosong (harus berupa JSON).'
                }, status=400)

            payload = json.loads(raw_data.decode('utf-8'))
            name = payload.get('name')
            base_unit = payload.get('base_unit', 'Meter')
            category = payload.get('category', '')
            description = payload.get('description', '')
            variants_data = payload.get('variants', [])

            if not name:
                return _json_response({
                    'status': 'error',
                    'message': "Field 'name' (Nama Barang) wajib diisi."
                }, status=400)

            env = request.env(su=True)

            # Buat record master barang
            item_vals = {'x_name': name}
            if item_model_name == 'x_pos_item':
                item_vals.update({
                    'x_base_unit': base_unit,
                    'x_category': category,
                    'x_description': description,
                })
            else:
                # Studio model
                item_vals.update({
                    'x_studio_satuan_dasar_meter_pcs_kg': base_unit,
                })

            item = env[item_model_name].create(item_vals)

            # Buat varian jika dilampirkan
            created_variants = []
            for v in variants_data:
                v_name = v.get('name')
                if not v_name:
                    continue
                v_factor = float(v.get('conversion_factor', 1.0))
                v_method = v.get('pricing_method', 'manual')
                v_margin = float(v.get('margin_percentage', 0.0))
                v_price = float(v.get('selling_price', 0.0))
                v_mode = v.get('stock_mode', 'floating')

                if unit_model_name == 'x_pos_unit':
                    unit_vals = {
                        'x_item_id': item.id,
                        'x_name': v_name,
                        'x_conversion_factor': v_factor,
                        'x_pricing_method': v_method,
                        'x_margin_percentage': v_margin,
                        'x_selling_price': v_price,
                        'x_stock_mode': v_mode,
                    }
                else:
                    unit_vals = {
                        'x_master_barang_id': item.id,
                        'x_name': v_name,
                        'x_studio_kebutuhan_bahan': v_factor,
                        'x_studio_skema_harga': v_method,
                        'x_studio_margin_persen': v_margin,
                        'x_studio_harga_jual': v_price,
                        'x_studio_mode_stok': v_mode,
                    }
                new_unit = env[unit_model_name].create(unit_vals)
                created_variants.append({
                    'id': new_unit.id,
                    'name': v_name,
                    'selling_price': v_price
                })

            return _json_response({
                'status': 'success',
                'message': f"Master barang '{name}' berhasil dibuat.",
                'data': {
                    'id': item.id,
                    'name': name,
                    'base_unit': base_unit,
                    'variants': created_variants
                }
            }, status=201)

        except Exception as e:
            _logger.exception("Error in POST /api/invo_pos/items: %s", str(e))
            return _json_response({
                'status': 'error',
                'message': str(e)
            }, status=500)
