# -*- coding: utf-8 -*-
from odoo import models, fields, api

class PosItem(models.Model):
    _name = 'x_pos_item'
    _description = 'Master Barang & Satuan Dasar'
    _rec_name = 'x_name'

    x_name = fields.Char(string='Nama Barang', required=True, index=True)
    x_base_unit = fields.Char(string='Satuan Dasar Perhitungan Stok', required=True, default='Meter',
                              help='Satuan terkecil penyimpanan stok di gudang (e.g. Meter, PCS, Kg, Yard)')
    x_category = fields.Char(string='Kategori', index=True)
    x_description = fields.Text(string='Deskripsi')
    x_is_active = fields.Boolean(string='Aktif', default=True)

    x_unit_ids = fields.One2many(
        'x_pos_unit',
        'x_item_id',
        string='Daftar Satuan Jual'
    )

    x_batch_ids = fields.One2many(
        'x_pos_batch',
        'x_item_id',
        string='Batch Persediaan FIFO'
    )

    x_total_stock = fields.Float(
        string='Total Stok Fisik Gudang (Satuan Dasar)',
        compute='_compute_total_stock',
        store=True,
        digits=(15, 4),
        help='Akumulasi sisa stok dari seluruh batch FIFO aktif'
    )

    @api.depends('x_batch_ids.x_remaining_quantity', 'x_batch_ids.x_state')
    def _compute_total_stock(self):
        for record in self:
            active_batches = record.x_batch_ids.filtered(lambda b: b.x_remaining_quantity > 0)
            record.x_total_stock = sum(b.x_remaining_quantity for b in active_batches)

    def _recompute_fifo_and_margin_sync(self):
        """
        Inbound Margin Auto-Sync Engine (v1.3 TokoJendral):
        1. Menghitung HPP tertimbang (weighted average base cost) dari batch aktif
        2. Memperbarui harga jual satuan yang menggunakan metode % margin
        """
        for item in self:
            active_batches = item.x_batch_ids.filtered(lambda b: b.x_remaining_quantity > 0)
            total_remaining = sum(b.x_remaining_quantity for b in active_batches)
            item.x_total_stock = total_remaining

            if total_remaining > 0:
                total_val = sum(b.x_remaining_quantity * b.x_base_cost_price for b in active_batches)
                weighted_base_cost = total_val / total_remaining
            else:
                weighted_base_cost = 0.0

            # Sinkronisasi ke Satuan Jual berbasis % Margin
            margin_units = item.x_unit_ids.filtered(lambda u: u.x_pricing_method == 'percentage_margin')
            for unit in margin_units:
                margin_rate = 1.0 + ((unit.x_margin_percentage or 0.0) / 100.0)
                unit.x_selling_price = weighted_base_cost * (unit.x_conversion_factor or 1.0) * margin_rate
