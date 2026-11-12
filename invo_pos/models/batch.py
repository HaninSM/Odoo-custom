# -*- coding: utf-8 -*-
from odoo import models, fields, api, _

class PosInventoryBatch(models.Model):
    _name = 'x_pos_batch'
    _description = 'Batch Persediaan FIFO'
    _rec_name = 'x_display_name'
    _order = 'x_received_date ASC, id ASC'

    x_purchase_id = fields.Many2one('x_pos_purchase', string='Nota Pembelian', ondelete='set null')
    x_item_id = fields.Many2one('x_pos_item', string='Barang Induk', required=True, ondelete='restrict', index=True)
    x_item_name = fields.Char(related='x_item_id.x_name', string='Nama Barang', store=True)
    x_base_unit = fields.Char(related='x_item_id.x_base_unit', string='Satuan Dasar', store=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        default=lambda self: self.env.company.currency_id,
        required=True
    )

    x_initial_quantity = fields.Float(string='Stok Awal Masuk', digits=(15, 4), required=True)
    x_remaining_quantity = fields.Float(string='Sisa Stok Tersedia', digits=(15, 4), required=True)
    x_base_cost_price = fields.Float(string='HPP Dasar (Modal/Satuan Dasar)', digits=(15, 2), required=True)
    x_received_date = fields.Date(string='Tanggal Masuk Barang (FIFO)', required=True, index=True, default=fields.Date.context_today)

    x_state = fields.Selection([
        ('active', 'Stok Tersedia'),
        ('depleted', 'Stok Habis')
    ], string='Status Batch', compute='_compute_state', store=True, index=True)

    x_display_name = fields.Char(string='Info Batch', compute='_compute_display_name', store=True)

    @api.depends('x_item_id.x_name', 'x_received_date', 'x_remaining_quantity', 'x_base_unit')
    def _compute_display_name(self):
        for rec in self:
            item = rec.x_item_id.x_name or 'Item'
            date = rec.x_received_date or ''
            rem = rec.x_remaining_quantity or 0.0
            unit = rec.x_base_unit or ''
            rec.x_display_name = f"[{date}] {item} (Sisa: {rem} {unit})"

    @api.depends('x_remaining_quantity')
    def _compute_state(self):
        for rec in self:
            if rec.x_remaining_quantity > 0:
                rec.x_state = 'active'
            else:
                rec.x_state = 'depleted'
