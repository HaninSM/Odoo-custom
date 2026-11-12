# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

class PosProduction(models.Model):
    _name = 'x_pos_production'
    _description = 'Perintah Jahit & Produksi Sprei (Make-to-Stock)'
    _order = 'x_production_date DESC, id DESC'
    _rec_name = 'x_name'

    x_name = fields.Char(string='No. Perintah Jahit', required=True, default=lambda self: _('New'), copy=False)
    x_production_date = fields.Date(
        string='Tanggal Jahit / Produksi',
        required=True,
        default=fields.Date.context_today
    )

    x_item_id = fields.Many2one(
        'x_pos_item',
        string='Bahan Baku Kain (FIFO)',
        required=True,
        help='Bahan mentah yang akan dipotong meterannya dari batch FIFO aktif'
    )
    x_variant_id = fields.Many2one(
        'x_pos_unit',
        string='Hasil Varian Sprei Jadi',
        required=True,
        domain="[('x_item_id', '=', x_item_id)]",
        help='Varian sprei yang diproduksi dan akan dialokasikan ke rak toko'
    )

    x_qty_produced = fields.Float(
        string='Jumlah Sprei Jadi (Pcs)',
        required=True,
        default=1.0,
        digits=(15, 2)
    )
    x_kebutuhan_per_pcs = fields.Float(
        string='Kebutuhan Kain / Pcs (Meter)',
        compute='_compute_kebutuhan',
        store=True,
        readonly=False,
        digits=(15, 4)
    )
    x_base_qty_used = fields.Float(
        string='Total Kain Terpakai (Meter)',
        compute='_compute_cost_and_usage',
        store=True,
        digits=(15, 4)
    )

    x_labor_cost_per_unit = fields.Float(
        string='Ongkos Jahit Borongan / Pcs (Rp)',
        default=10000.0,
        digits=(15, 2)
    )
    x_accessory_cost_per_unit = fields.Float(
        string='Biaya Aksesoris / Pcs (Rp)',
        default=5000.0,
        help='Biaya karet elastis, plastik resleting, hangtag, dll.',
        digits=(15, 2)
    )

    x_raw_material_cost = fields.Float(
        string='Total Biaya Kain Mentah FIFO (Rp)',
        compute='_compute_cost_and_usage',
        store=True,
        digits=(15, 2)
    )
    x_total_cost = fields.Float(
        string='Total Biaya Produksi (Rp)',
        compute='_compute_cost_and_usage',
        store=True,
        digits=(15, 2)
    )
    x_unit_cost = fields.Float(
        string='HPP Komposit Akhir / Pcs (Rp)',
        compute='_compute_cost_and_usage',
        store=True,
        digits=(15, 2)
    )

    x_state = fields.Selection([
        ('draft', 'Draft (Rencana Jahit)'),
        ('done', 'Selesai (Pindah ke Rak Toko)')
    ], string='Status', default='draft', required=True, index=True)

    x_notes = fields.Text(string='Catatan Produksi')

    @api.depends('x_variant_id')
    def _compute_kebutuhan(self):
        for rec in self:
            if rec.x_variant_id:
                rec.x_kebutuhan_per_pcs = rec.x_variant_id.x_conversion_factor or 1.0

    @api.depends('x_qty_produced', 'x_kebutuhan_per_pcs', 'x_labor_cost_per_unit', 'x_accessory_cost_per_unit', 'x_item_id')
    def _compute_cost_and_usage(self):
        for rec in self:
            qty = rec.x_qty_produced or 0.0
            factor = rec.x_kebutuhan_per_pcs or 1.0
            total_cloth = qty * factor
            rec.x_base_qty_used = total_cloth

            # Cari HPP batch FIFO tertua yang aktif
            base_cost = 0.0
            if rec.x_item_id:
                oldest_batch = self.env['x_pos_batch'].search([
                    ('x_item_id', '=', rec.x_item_id.id),
                    ('x_remaining_quantity', '>', 0)
                ], order='x_received_date ASC, id ASC', limit=1)
                if oldest_batch:
                    base_cost = oldest_batch.x_base_cost_price or 0.0

            raw_cost = total_cloth * base_cost
            rec.x_raw_material_cost = raw_cost

            total_labor = qty * (rec.x_labor_cost_per_unit or 0.0)
            total_acc = qty * (rec.x_accessory_cost_per_unit or 0.0)

            total = raw_cost + total_labor + total_acc
            rec.x_total_cost = total
            rec.x_unit_cost = (total / qty) if qty > 0 else 0.0

    def action_confirm_production(self):
        """
        Selesaikan jahit:
        1. Potong kuantitas meteran kain dari batch FIFO tertua
        2. Alokasikan stok fisik sprei jadi ke rak toko (Physical Allocation)
        3. Kunci HPP Komposit & harga jual margin
        """
        for rec in self:
            if rec.x_qty_produced <= 0:
                raise ValidationError(_('Jumlah produksi sprei harus lebih dari 0!'))

            if rec.x_name == _('New') or not rec.x_name:
                seq = self.env['ir.sequence'].next_by_code('x_pos_production')
                rec.x_name = seq or f"PRD-{fields.Date.today().strftime('%Y%m')}-{rec.id:04d}"

            cloth_needed = rec.x_base_qty_used

            # 1. Potong Batch FIFO
            active_batches = self.env['x_pos_batch'].search([
                ('x_item_id', '=', rec.x_item_id.id),
                ('x_remaining_quantity', '>', 0)
            ], order='x_received_date ASC, id ASC')

            total_avail = sum(b.x_remaining_quantity for b in active_batches)
            if cloth_needed > total_avail:
                raise UserError(_('Stok kain mentah tidak mencukupi! Butuh %s m, tersedia %s m.') % (cloth_needed, total_avail))

            rem_to_cut = cloth_needed
            for b in active_batches:
                if rem_to_cut <= 0:
                    break
                cut = min(b.x_remaining_quantity, rem_to_cut)
                new_rem = b.x_remaining_quantity - cut
                b.write({
                    'x_remaining_quantity': new_rem,
                    'x_state': 'depleted' if new_rem <= 0 else 'active'
                })
                rem_to_cut -= cut

            # 2. Update Sisa Stok Gudang Bahan Mentah
            batches_left = self.env['x_pos_batch'].search([
                ('x_item_id', '=', rec.x_item_id.id),
                ('x_remaining_quantity', '>', 0)
            ])
            rec.x_item_id.write({'x_total_stock': sum(b.x_remaining_quantity for b in batches_left)})

            # 3. Pindahkan Sprei Jadi ke Rak Toko (Physical Allocation)
            var = rec.x_variant_id
            new_alloc = (var.x_allocated_stock or 0.0) + rec.x_qty_produced
            vals = {
                'x_stock_mode': 'allocated',
                'x_allocated_stock': new_alloc,
            }
            if var.x_pricing_method == 'percentage_margin':
                margin = var.x_margin_percentage or 0.0
                vals['x_selling_price'] = rec.x_unit_cost * (1.0 + (margin / 100.0))

            var.write(vals)
            rec.write({'x_state': 'done'})
