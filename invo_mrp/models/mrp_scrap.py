# -*- coding: utf-8 -*-
from odoo import models, fields, api, _

class StockScrap(models.Model):
    _inherit = 'stock.scrap'

    x_is_textile_scrap = fields.Boolean(
        string='Scrap Perca Kain Konveksi',
        default=False,
        help='Tandai jika scrap berasal dari sisa potongan kain konveksi sprei'
    )
    x_scrap_type = fields.Selection([
        ('perca_kecil', 'Perca Potongan Kecil (Untuk Isian / Keset)'),
        ('perca_sedang', 'Perca Sedang (Dapat Diolah Jadi Sarung Bantal)'),
        ('afkir_cacat', 'Kain Cacat Tenun / Noda Pabrik'),
    ], string='Kategori Perca Kain', default='perca_kecil')

    x_weight_kg = fields.Float(
        string='Berat Timbangan Perca (Kg)',
        digits=(15, 3),
        default=0.0
    )
    x_resale_price_per_kg = fields.Float(
        string='Estimasi Harga Jual / Kg (Rp)',
        default=5000.0,
        digits=(15, 2),
        help='Harga jual limbah kain perca ke pengepul limbah tekstil'
    )
    x_total_recovery_value = fields.Float(
        string='Total Nilai Pemulihan Scrap (Rp)',
        compute='_compute_recovery_value',
        store=True,
        digits=(15, 2)
    )

    @api.depends('x_weight_kg', 'x_resale_price_per_kg')
    def _compute_recovery_value(self):
        for scrap in self:
            scrap.x_total_recovery_value = (scrap.x_weight_kg or 0.0) * (scrap.x_resale_price_per_kg or 0.0)
