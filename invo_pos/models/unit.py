# -*- coding: utf-8 -*-
import math
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

class PosProductUnit(models.Model):
    _name = 'x_pos_unit'
    _description = 'Satuan Jual & Varian Harga'
    _rec_name = 'x_display_name'

    x_item_id = fields.Many2one('x_pos_item', string='Barang Induk', required=True, ondelete='cascade', index=True)
    x_item_name = fields.Char(related='x_item_id.x_name', string='Nama Induk', store=True)
    x_base_unit = fields.Char(related='x_item_id.x_base_unit', string='Satuan Dasar', readonly=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        default=lambda self: self.env.company.currency_id,
        required=True
    )

    x_name = fields.Char(string='Nama Satuan Jual', required=True, help='Contoh: Sprei M, Dus, Lusin, PCS, Roll')
    x_display_name = fields.Char(string='Nama Tampilan', compute='_compute_display_name', store=True)

    x_conversion_factor = fields.Float(
        string='Kebutuhan Bahan Satuan Dasar',
        required=True,
        default=1.0,
        digits=(15, 4),
        help='Jumlah satuan dasar per 1 satuan jual (Contoh: 1 Sprei M butuh 2.0 Meter)'
    )

    x_pricing_method = fields.Selection([
        ('manual', 'Manual (Rp)'),
        ('percentage_margin', '% Margin Profit')
    ], string='Metode Penetapan Harga', default='manual', required=True)

    x_margin_percentage = fields.Float(string='Margin Profit (%)', digits=(5, 2), default=0.0)
    x_selling_price = fields.Float(string='Harga Jual (Rp)', required=True, default=0.0, digits=(15, 2))

    # Dual-Mode Stock Management (v1.6 TokoJendral)
    x_stock_mode = fields.Selection([
        ('floating', 'Floating Pool (Stok Bebas On-Demand)'),
        ('allocated', 'Physical Allocation (Alokasi Kuota Fisik)')
    ], string='Mode Pengelolaan Stok', default='floating', required=True)

    x_allocated_stock = fields.Float(
        string='Stok Alokasi Fisik (Rak Toko)',
        digits=(15, 4),
        default=0.0,
        help='Jumlah fisik yang telah dikemas/dibungkus rapi di rak'
    )

    x_available_sale_stock = fields.Float(
        string='Stok Siap Jual di POS',
        compute='_compute_available_sale_stock',
        digits=(15, 2),
        help='Stok riil yang dapat ditransaksikan kasir saat ini'
    )

    x_is_bundle = fields.Boolean(string='Paket Bundling / Hampers', default=False)
    x_reseller_visible = fields.Boolean(string='Tampil di Katalog Reseller', default=True)
    x_is_active = fields.Boolean(string='Aktif', default=True)

    @api.depends('x_item_id.x_name', 'x_name')
    def _compute_display_name(self):
        for rec in self:
            if rec.x_item_id and rec.x_name:
                rec.x_display_name = f"{rec.x_item_id.x_name} - {rec.x_name}"
            else:
                rec.x_display_name = rec.x_name or _('Satuan Baru')

    @api.depends('x_stock_mode', 'x_allocated_stock', 'x_item_id.x_total_stock', 'x_conversion_factor')
    def _compute_available_sale_stock(self):
        for rec in self:
            if rec.x_stock_mode == 'allocated':
                rec.x_available_sale_stock = rec.x_allocated_stock
            else:
                total_base = rec.x_item_id.x_total_stock or 0.0
                factor = rec.x_conversion_factor or 1.0
                if factor > 0:
                    rec.x_available_sale_stock = math.floor(total_base / factor)
                else:
                    rec.x_available_sale_stock = 0.0

    def action_reset_to_floating(self):
        """Kembalikan alokasi fisik ke kolam stok bebas gudang"""
        self.write({
            'x_stock_mode': 'floating',
            'x_allocated_stock': 0.0
        })

    def action_switch_to_allocated(self):
        """Beralih ke mode penguncian fisik kuota kemasan"""
        self.write({
            'x_stock_mode': 'allocated'
        })
