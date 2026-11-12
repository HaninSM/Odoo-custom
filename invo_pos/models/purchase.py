# -*- coding: utf-8 -*-
import datetime
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

class PosPurchase(models.Model):
    _name = 'x_pos_purchase'
    _description = 'Nota Pembelian & Restock Barang'
    _order = 'x_purchase_date DESC, id DESC'
    _rec_name = 'x_name'

    x_name = fields.Char(string='No. Nota Pembelian', required=True, default=lambda self: _('New'), copy=False)
    x_supplier_id = fields.Many2one('x_pos_supplier', string='Supplier / Pemasok', required=True, index=True)
    x_purchase_date = fields.Date(
        string='Tanggal Pembelian / Penerimaan',
        required=True,
        default=fields.Date.context_today,
        help='Mendukung pencatatan tanggal lampau (Backdate) untuk migrasi data riil'
    )

    # Termin Tempo & Manajemen Hutang Supplier (v2.2.0)
    x_payment_term_id = fields.Many2one(
        'account.payment.term',
        string='Syarat Pembayaran (Termin)',
        default=lambda self: self.env.ref('account.account_payment_term_immediate', raise_if_not_found=False) or 1
    )
    x_due_date = fields.Date(
        string='Tanggal Jatuh Tempo',
        compute='_compute_due_date',
        store=True,
        readonly=False,
        help='Batas waktu pelunasan hutang pembelian ke supplier'
    )
    x_payment_state = fields.Selection([
        ('not_paid', 'Belum Dibayar (Hutang)'),
        ('partially_paid', 'Dibayar Sebagian'),
        ('paid', 'Lunas')
    ], string='Status Pembayaran Hutang', default='not_paid', required=True, index=True)

    x_invoice_id = fields.Many2one(
        'account.move',
        string='Faktur Tagihan Hutang (Vendor Bill)',
        readonly=True,
        copy=False
    )

    x_state = fields.Selection([
        ('draft', 'Draft (Pemesanan)'),
        ('done', 'Selesai (Stok Masuk & Sinkronisasi HPP)')
    ], string='Status', default='draft', required=True, index=True)

    x_notes = fields.Text(string='Catatan Pembelian')

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        default=lambda self: self.env.company.currency_id,
        required=True
    )

    x_line_ids = fields.One2many(
        'x_pos_purchase_line',
        'x_purchase_id',
        string='Rincian Barang yang Dibeli'
    )

    x_batch_ids = fields.One2many(
        'x_pos_batch',
        'x_purchase_id',
        string='Batch FIFO yang Dihasilkan',
        readonly=True
    )

    x_total_cost = fields.Float(
        string='Total Biaya Pembelian (Rp)',
        compute='_compute_total_cost',
        store=True,
        digits=(15, 2)
    )

    @api.depends('x_line_ids.x_subtotal_cost')
    def _compute_total_cost(self):
        for rec in self:
            rec.x_total_cost = sum(line.x_subtotal_cost for line in rec.x_line_ids)

    @api.depends('x_payment_term_id', 'x_purchase_date')
    def _compute_due_date(self):
        for rec in self:
            if rec.x_purchase_date:
                nb_days = 0
                if rec.x_payment_term_id and rec.x_payment_term_id.line_ids:
                    nb_days = rec.x_payment_term_id.line_ids[0].nb_days or 0
                rec.x_due_date = rec.x_purchase_date + datetime.timedelta(days=nb_days)
                if not rec.x_payment_state:
                    rec.x_payment_state = 'paid' if nb_days == 0 else 'not_paid'

    def action_confirm(self):
        """
        Validasi penerimaan restock pembelian:
        1. Membuat batch stok FIFO (x_pos_batch)
        2. Memperbarui total stok barang induk
        3. Menjalankan Inbound Margin Auto-Sync
        4. Membuat Faktur Tagihan Hutang Supplier (Vendor Bill AP) di modul account
        """
        for rec in self:
            if not rec.x_line_ids:
                raise UserError(_('Rincian barang pembelian tidak boleh kosong!'))

            if rec.x_name == _('New') or not rec.x_name:
                seq = self.env['ir.sequence'].next_by_code('x_pos_purchase')
                rec.x_name = seq or f"PO-{fields.Date.today().strftime('%Y%m')}-{rec.id:04d}"

            affected_items = self.env['x_pos_item']

            for line in rec.x_line_ids:
                if line.x_total_base_qty <= 0:
                    raise ValidationError(_('Kuantitas barang %s harus lebih dari 0!') % (line.x_item_id.x_name or ''))

                # 1. Buat Batch FIFO
                self.env['x_pos_batch'].create({
                    'x_purchase_id': rec.id,
                    'x_item_id': line.x_item_id.id,
                    'x_initial_quantity': line.x_total_base_qty,
                    'x_remaining_quantity': line.x_total_base_qty,
                    'x_base_cost_price': line.x_base_cost_price,
                    'x_received_date': rec.x_purchase_date,
                })

                affected_items |= line.x_item_id

            # 2 & 3. Sinkronisasi Total Stok & Harga Jual Berbasis Margin
            for item in affected_items:
                item._recompute_fifo_and_margin_sync()

            # 4. Integrasi Akuntansi: Buat Vendor Bill (Hutang Supplier)
            if not rec.x_invoice_id and rec.x_total_cost > 0:
                partner = self.env['res.partner'].search([('name', '=', rec.x_supplier_id.x_name)], limit=1)
                if not partner:
                    partner = self.env['res.partner'].create({
                        'name': rec.x_supplier_id.x_name,
                        'supplier_rank': 1
                    })

                bill_lines = []
                for line in rec.x_line_ids:
                    qty = line.x_quantity_purchased or 1.0
                    subtotal = line.x_subtotal_cost or 0.0
                    desc = f"Restock {line.x_item_id.x_name or 'Barang'} ({qty} {line.x_unit_purchased or ''})"
                    bill_lines.append((0, 0, {
                        'name': desc,
                        'quantity': qty,
                        'price_unit': subtotal / qty if qty > 0 else subtotal,
                    }))

                bill = self.env['account.move'].create({
                    'move_type': 'in_invoice',
                    'partner_id': partner.id,
                    'invoice_date': rec.x_purchase_date,
                    'invoice_date_due': rec.x_due_date or rec.x_purchase_date,
                    'invoice_payment_term_id': rec.x_payment_term_id.id if rec.x_payment_term_id else False,
                    'ref': rec.x_name,
                    'invoice_line_ids': bill_lines,
                })
                rec.x_invoice_id = bill.id

            rec.write({'x_state': 'done'})


class PosPurchaseLine(models.Model):
    _name = 'x_pos_purchase_line'
    _description = 'Baris Rincian Pembelian'

    x_purchase_id = fields.Many2one('x_pos_purchase', string='Nota Pembelian', required=True, ondelete='cascade')
    x_item_id = fields.Many2one('x_pos_item', string='Barang Induk', required=True)
    x_base_unit = fields.Char(related='x_item_id.x_base_unit', string='Satuan Dasar', readonly=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        related='x_purchase_id.currency_id',
        readonly=True
    )

    x_unit_purchased = fields.Char(
        string='Satuan Saat Beli',
        default='Kodi',
        help='Misal: Kodi, Roll, Dus, Bal, Karton'
    )
    x_quantity_purchased = fields.Float(string='Qty Beli', default=1.0, required=True, digits=(15, 2))
    x_conversion_factor = fields.Float(
        string='Faktor Konversi',
        default=60.0,
        required=True,
        digits=(15, 4),
        help='Berapa satuan dasar yang didapat per 1 satuan beli (Contoh: 1 Kodi = 60 Meter)'
    )

    x_total_base_qty = fields.Float(
        string='Total Satuan Dasar Didapat',
        compute='_compute_total_base_qty',
        store=True,
        digits=(15, 4)
    )

    x_subtotal_cost = fields.Float(string='Total Biaya Beli (Rp)', required=True, digits=(15, 2))

    x_base_cost_price = fields.Float(
        string='HPP Modal / Satuan Dasar (Rp)',
        compute='_compute_base_cost_price',
        store=True,
        digits=(15, 2)
    )

    @api.depends('x_quantity_purchased', 'x_conversion_factor')
    def _compute_total_base_qty(self):
        for line in self:
            line.x_total_base_qty = (line.x_quantity_purchased or 0.0) * (line.x_conversion_factor or 1.0)

    @api.depends('x_subtotal_cost', 'x_total_base_qty')
    def _compute_base_cost_price(self):
        for line in self:
            if line.x_total_base_qty > 0:
                line.x_base_cost_price = line.x_subtotal_cost / line.x_total_base_qty
            else:
                line.x_base_cost_price = 0.0
