# -*- coding: utf-8 -*-
from odoo import models, fields, _

class PosExpense(models.Model):
    _name = 'x_pos_expense'
    _description = 'Beban Biaya Operasional Toko'
    _order = 'x_date DESC, id DESC'
    _rec_name = 'x_name'

    x_name = fields.Char(string='Keterangan Pengeluaran', required=True, index=True)
    x_date = fields.Date(string='Tanggal Beban', required=True, default=fields.Date.context_today, index=True)

    x_category = fields.Selection([
        ('operational', 'Operasional Toko'),
        ('packaging', 'Kemasan & Plastik Packing'),
        ('utility', 'Listrik, Air & Internet'),
        ('salary', 'Gaji & Upah Karyawan'),
        ('rent', 'Sewa Toko / Gudang'),
        ('other', 'Biaya Lain-lain')
    ], string='Kategori Beban', default='operational', required=True, index=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        default=lambda self: self.env.company.currency_id,
        required=True
    )

    x_amount = fields.Float(string='Nominal Biaya (Rp)', required=True, digits=(15, 2))
    x_notes = fields.Text(string='Catatan Tambahan / Bukti Kas Keluar')
