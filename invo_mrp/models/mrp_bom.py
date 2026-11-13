# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

class MrpBom(models.Model):
    _inherit = 'mrp.bom'

    x_is_textile_bom = fields.Boolean(
        string='BoM Konveksi Tekstil Toko Jendral',
        default=True,
        help='Aktifkan untuk mengaitkan BoM dengan master kain, varian kasir, dan SPK jahit'
    )
    x_textile_pattern = fields.Char(
        string='Motif / Corak Kain',
        help='Contoh: Motif Bintang Minimalis, Floral Vintage, Polos Pastel'
    )
    x_fabric_width_meter = fields.Float(
        string='Lebar Kain Mentah (Meter)',
        default=2.40,
        digits=(15, 2),
        help='Lebar standar kain sprei pabrikan (umumnya 2.40m)'
    )
    x_shrinkage_pct = fields.Float(
        string='Toleransi Susut Kain (%)',
        default=2.5,
        digits=(5, 2),
        help='Persentase toleransi susut potongan kain setelah proses obras & cuci'
    )

    x_target_pos_item_id = fields.Many2one(
        'x_pos_item',
        string='Master Barang Kasir (Invo POS)',
        help='Master produk kain induk pada sistem Invo POS'
    )
    x_target_pos_unit_id = fields.Many2one(
        'x_pos_unit',
        string='Varian Sprei Jadi (Rak Kasir)',
        domain="[('x_item_id', '=', x_target_pos_item_id)]",
        help='Varian sprei yang stoknya akan otomatis di-push ke kasir saat jahit selesai'
    )

    x_std_labor_cost = fields.Float(
        string='Biaya Upah Jahit Standar (Rp)',
        default=10000.0,
        digits=(15, 2),
        help='Tarif borongan jahit per sprei jadi'
    )
    x_std_acc_cost = fields.Float(
        string='Biaya Aksesoris Standar (Rp)',
        default=5000.0,
        digits=(15, 2),
        help='Biaya karet elastis sudut 4 sisi, benang, dan mika kemasan'
    )

    x_total_material_cost = fields.Float(
        string='Estimasi Total Bahan Mentah (Rp)',
        compute='_compute_estimated_costs',
        store=True,
        digits=(15, 2)
    )
    x_estimated_composite_hpp = fields.Float(
        string='Estimasi HPP Komposit / Pcs (Rp)',
        compute='_compute_estimated_costs',
        store=True,
        digits=(15, 2),
        help='Bahan Baku Kain + Upah Jahit + Aksesoris'
    )

    @api.depends('bom_line_ids.product_qty', 'bom_line_ids.product_id.standard_price', 'x_std_labor_cost', 'x_std_acc_cost')
    def _compute_estimated_costs(self):
        for bom in self:
            mat_cost = 0.0
            for line in bom.bom_line_ids:
                price = line.product_id.standard_price or 0.0
                qty = line.product_qty or 0.0
                mat_cost += price * qty
            
            bom.x_total_material_cost = mat_cost
            bom.x_estimated_composite_hpp = mat_cost + (bom.x_std_labor_cost or 0.0) + (bom.x_std_acc_cost or 0.0)

    @api.constrains('x_shrinkage_pct')
    def _check_shrinkage(self):
        for bom in self:
            if bom.x_shrinkage_pct < 0 or bom.x_shrinkage_pct > 25:
                raise ValidationError(_("Toleransi susut kain harus berada di antara 0% hingga 25%."))


class MrpBomLine(models.Model):
    _inherit = 'mrp.bom.line'

    x_component_role = fields.Selection([
        ('kain_utama', 'Kain Katun Utama (FIFO Roll)'),
        ('karet_sudut', 'Karet Elastis 4 Sudut'),
        ('resleting', 'Resleting YKK / Sarung Bantal'),
        ('benang', 'Benang Jahit & Obras'),
        ('kemasan', 'Mika & Hangtag Toko Jendral'),
        ('lainnya', 'Lain-lain')
    ], string='Peran Komponen Tekstil', default='kain_utama')

    x_allow_waste = fields.Boolean(
        string='Berpotensi Scrap Perca',
        default=False,
        help='Komponen yang menghasilkan sisa kain potongan (scrap perca)'
    )
