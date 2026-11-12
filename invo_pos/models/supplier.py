# -*- coding: utf-8 -*-
from odoo import models, fields

class PosSupplier(models.Model):
    _name = 'x_pos_supplier'
    _description = 'Supplier & Pemasok Bahan'
    _rec_name = 'x_name'

    x_name = fields.Char(string='Nama Supplier', required=True, index=True)
    x_phone = fields.Char(string='No. Telepon / WhatsApp')
    x_address = fields.Text(string='Alamat Gudang / Kantor')
    x_is_active = fields.Boolean(string='Aktif', default=True)

    x_purchase_ids = fields.One2many(
        'x_pos_purchase',
        'x_supplier_id',
        string='Riwayat Pembelian'
    )
