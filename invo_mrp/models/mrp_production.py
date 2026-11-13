# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

class MrpProduction(models.Model):
    _inherit = 'mrp.production'

    x_spk_number = fields.Char(
        string='No. SPK Jahit Konveksi',
        readonly=True,
        copy=False,
        default=lambda self: _('Draft SPK')
    )
    x_tailor_id = fields.Many2one(
        'res.partner',
        string='Mitra Penjahit Borongan',
        help='Penjahit yang bertugas mengerjakan pesanan potong & jahit sprei ini'
    )
    x_target_completion_date = fields.Date(
        string='Target Selesai Jahit',
        default=fields.Date.context_today
    )

    x_pos_item_id = fields.Many2one(
        'x_pos_item',
        string='Bahan Kain Mentah (Invo POS)',
        help='Bahan mentah kain katun yang dipotong meterannya dari sistem POS'
    )
    x_pos_unit_id = fields.Many2one(
        'x_pos_unit',
        string='Varian Rak Kasir (Sprei Jadi)',
        domain="[('x_item_id', '=', x_pos_item_id)]",
        help='Varian kasir yang akan menerima penambahan stok setelah SPK selesai'
    )
    x_fifo_batch_id = fields.Many2one(
        'x_pos_batch',
        string='Batch / Lot FIFO Kain',
        domain="[('x_item_id', '=', x_pos_item_id), ('x_status', '=', 'active')]",
        help='Batch kain katun aktif yang dipotong untuk pesanan ini'
    )

    x_labor_cost_per_pcs = fields.Float(
        string='Upah Jahit Borongan / Pcs (Rp)',
        default=10000.0,
        digits=(15, 2)
    )
    x_accessory_cost_per_pcs = fields.Float(
        string='Biaya Aksesoris / Pcs (Rp)',
        default=5000.0,
        digits=(15, 2)
    )

    x_total_labor_cost = fields.Float(
        string='Total Ongkos Jahit (Rp)',
        compute='_compute_spk_costs',
        store=True,
        digits=(15, 2)
    )
    x_total_accessory_cost = fields.Float(
        string='Total Biaya Aksesoris (Rp)',
        compute='_compute_spk_costs',
        store=True,
        digits=(15, 2)
    )
    x_actual_composite_hpp = fields.Float(
        string='HPP Komposit Aktual / Pcs (Rp)',
        compute='_compute_spk_costs',
        store=True,
        digits=(15, 2)
    )

    x_auto_push_pos = fields.Boolean(
        string='Auto-Push ke Rak Kasir POS',
        default=True,
        help='Saat SPK ditandai selesai (Done), otomatis tambahkan kuota stok ke etalase kasir POS'
    )
    x_is_pushed_to_pos = fields.Boolean(
        string='Stok Telah Dialokasikan ke Kasir',
        readonly=True,
        copy=False
    )

    @api.onchange('bom_id')
    def _onchange_bom_id_textile(self):
        if self.bom_id:
            if hasattr(self.bom_id, 'x_target_pos_item_id') and self.bom_id.x_target_pos_item_id:
                self.x_pos_item_id = self.bom_id.x_target_pos_item_id
            if hasattr(self.bom_id, 'x_target_pos_unit_id') and self.bom_id.x_target_pos_unit_id:
                self.x_pos_unit_id = self.bom_id.x_target_pos_unit_id
            if hasattr(self.bom_id, 'x_std_labor_cost'):
                self.x_labor_cost_per_pcs = self.bom_id.x_std_labor_cost
            if hasattr(self.bom_id, 'x_std_acc_cost'):
                self.x_accessory_cost_per_pcs = self.bom_id.x_std_acc_cost

    @api.depends('product_qty', 'x_labor_cost_per_pcs', 'x_accessory_cost_per_pcs', 'x_pos_item_id', 'x_pos_unit_id', 'x_fifo_batch_id')
    def _compute_spk_costs(self):
        for prod in self:
            qty = prod.product_qty or 0.0
            prod.x_total_labor_cost = (prod.x_labor_cost_per_pcs or 0.0) * qty
            prod.x_total_accessory_cost = (prod.x_accessory_cost_per_pcs or 0.0) * qty

            # Ambil estimasi biaya kain per pcs dari batch atau master item
            kain_price_per_meter = 20000.0  # default Rp 1.2jt / 60m
            if prod.x_fifo_batch_id and prod.x_fifo_batch_id.x_cost_per_base_unit:
                kain_price_per_meter = prod.x_fifo_batch_id.x_cost_per_base_unit
            elif prod.x_pos_item_id and prod.x_pos_item_id.x_base_cost_price:
                kain_price_per_meter = prod.x_pos_item_id.x_base_cost_price

            meter_per_unit = 3.0
            if prod.x_pos_unit_id and prod.x_pos_unit_id.x_conversion_factor:
                meter_per_unit = prod.x_pos_unit_id.x_conversion_factor

            biaya_kain_per_pcs = kain_price_per_meter * meter_per_unit
            prod.x_actual_composite_hpp = biaya_kain_per_pcs + (prod.x_labor_cost_per_pcs or 0.0) + (prod.x_accessory_cost_per_pcs or 0.0)

    def action_confirm(self):
        res = super(MrpProduction, self).action_confirm()
        for prod in self:
            if prod.x_spk_number == _('Draft SPK') or not prod.x_spk_number:
                prod.x_spk_number = self.env['ir.sequence'].next_by_code('invo.mrp.spk') or _('SPK/%s') % fields.Date.today()
        return res

    def button_mark_done(self):
        """
        Override saat produksi jahit selesai:
        1. Jalankan penyelesaian MO standar Odoo
        2. Alokasikan stok barang jadi ke etalase kasir POS (x_pos_unit)
        3. Catat di chatter Odoo
        """
        res = super(MrpProduction, self).button_mark_done()

        for prod in self:
            if prod.x_auto_push_pos and not prod.x_is_pushed_to_pos and prod.x_pos_unit_id:
                qty_sprei = prod.qty_producing or prod.product_qty or 1.0

                # 1. Update stok unit rak toko di kasir
                prod.x_pos_unit_id.sudo().write({
                    'x_stock_unit': prod.x_pos_unit_id.x_stock_unit + qty_sprei,
                    'x_calculated_cogs': prod.x_actual_composite_hpp
                })

                # 2. Potong kain dari master item POS jika dikaitkan
                if prod.x_pos_item_id:
                    meter_used = (prod.x_pos_unit_id.x_conversion_factor or 3.0) * qty_sprei
                    if prod.x_fifo_batch_id:
                        # Potong dari batch FIFO spesifik
                        sisa_batch = max(0.0, prod.x_fifo_batch_id.x_remaining_base_qty - meter_used)
                        prod.x_fifo_batch_id.sudo().write({'x_remaining_base_qty': sisa_batch})
                        if sisa_batch <= 0:
                            prod.x_fifo_batch_id.sudo().write({'x_status': 'depleted'})
                    
                    prod.x_pos_item_id.sudo().write({
                        'x_stock_base': max(0.0, prod.x_pos_item_id.x_stock_base - meter_used)
                    })

                prod.x_is_pushed_to_pos = True
                
                # Kirim pesan chatter
                prod.message_post(body=_(
                    "<b>Auto-Push ke Kasir Berhasil:</b> Ditambahkan <b>%s pcs</b> %s ke etalase kasir POS. "
                    "HPP Komposit aktual: <b>Rp %s</b>."
                ) % (qty_sprei, prod.x_pos_unit_id.x_name, '{:,.2f}'.format(prod.x_actual_composite_hpp)))

        return res
