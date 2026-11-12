# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

class PosOrder(models.Model):
    _name = 'x_pos_order'
    _description = 'Nota Transaksi Kasir POS'
    _order = 'x_transaction_date DESC, id DESC'
    _rec_name = 'x_name'

    x_name = fields.Char(
        string='Nomor Struk Transaksi',
        required=True,
        default=lambda self: _('New'),
        copy=False,
        index=True
    )
    x_customer_name = fields.Char(
        string='Nama Pelanggan',
        default='Pelanggan Umum',
        required=True
    )
    x_transaction_date = fields.Datetime(
        string='Tanggal & Jam Transaksi (Backdate)',
        required=True,
        default=fields.Datetime.now,
        index=True,
        help='Mendukung input tanggal lampau untuk migrasi data penjualan'
    )
    x_payment_method = fields.Selection([
        ('CASH', 'Tunai (CASH)'),
        ('TRANSFER', 'Transfer Bank'),
        ('QRIS', 'QRIS')
    ], string='Metode Pembayaran', default='CASH', required=True)

    x_payment_status = fields.Selection([
        ('pending', 'Draft / Belum Bayar'),
        ('paid', 'Lunas (Struk Sah)'),
        ('cancelled', 'Dibatalkan')
    ], string='Status Pembayaran', default='pending', required=True, index=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        default=lambda self: self.env.company.currency_id,
        required=True
    )

    x_line_ids = fields.One2many(
        'x_pos_order_line',
        'x_order_id',
        string='Daftar Item Belanja'
    )

    x_total_amount = fields.Float(
        string='Total Penjualan (Rp)',
        compute='_compute_total_amount',
        store=True,
        digits=(15, 2)
    )

    x_amount_paid = fields.Float(
        string='Uang Diterima / Tendered (Rp)',
        default=0.0,
        digits=(15, 2)
    )

    x_change_amount = fields.Float(
        string='Uang Kembalian (Rp)',
        compute='_compute_change_amount',
        store=True,
        digits=(15, 2)
    )

    x_total_cost = fields.Float(
        string='Total HPP Modal (COGS)',
        compute='_compute_cogs_and_profit',
        store=True,
        digits=(15, 2)
    )

    x_gross_profit = fields.Float(
        string='Laba Kotor Transaksi (Rp)',
        compute='_compute_cogs_and_profit',
        store=True,
        digits=(15, 2)
    )

    x_notes = fields.Text(string='Catatan Struk')

    @api.depends('x_line_ids.x_subtotal_price')
    def _compute_total_amount(self):
        for rec in self:
            rec.x_total_amount = sum(line.x_subtotal_price for line in rec.x_line_ids)

    @api.depends('x_amount_paid', 'x_total_amount')
    def _compute_change_amount(self):
        for rec in self:
            rec.x_change_amount = (rec.x_amount_paid or 0.0) - (rec.x_total_amount or 0.0)

    @api.depends('x_total_amount', 'x_line_ids.x_subtotal_cost')
    def _compute_cogs_and_profit(self):
        for rec in self:
            tot_cost = sum(line.x_subtotal_cost for line in rec.x_line_ids)
            rec.x_total_cost = tot_cost
            rec.x_gross_profit = (rec.x_total_amount or 0.0) - tot_cost

    def action_confirm_payment(self):
        """
        Validasi penyelesaian transaksi POS:
        1. Potong batch persediaan FIFO aktif
        2. Kunci snapshot HPP modal dan profit transaksi
        3. Tandai status menjadi Lunas (paid)
        """
        for order in self:
            if not order.x_line_ids:
                raise UserError(_('Keranjang belanja pelanggan masih kosong!'))

            if order.x_payment_method == 'CASH' and order.x_amount_paid < order.x_total_amount:
                raise ValidationError(_('Nominal uang tunai diterima kurang dari total belanja!'))

            if order.x_name == _('New') or not order.x_name:
                seq = self.env['ir.sequence'].next_by_code('x_pos_order')
                order.x_name = seq or f"TRX-{fields.Date.today().strftime('%Y%m')}-{order.id:04d}"

            # Eksekusi Pemotongan Stok FIFO
            for line in order.x_line_ids:
                if line.x_quantity_sold <= 0:
                    raise ValidationError(_('Kuantitas jual harus lebih dari 0!'))

                item = line.x_unit_id.x_item_id
                base_qty_needed = line.x_base_quantity_deducted

                active_batches = self.env['x_pos_batch'].search([
                    ('x_item_id', '=', item.id),
                    ('x_state', '=', 'active')
                ], order='x_received_date ASC, id ASC')

                total_available = sum(b.x_remaining_quantity for b in active_batches)
                if total_available < base_qty_needed:
                    raise ValidationError(_(
                        'Stok fisik untuk %s tidak mencukupi! Butuh: %s %s, Sisa: %s %s'
                    ) % (
                        item.x_name,
                        base_qty_needed, item.x_base_unit or '',
                        total_available, item.x_base_unit or ''
                    ))

                # Potong Batch Terlama
                remaining_to_deduct = base_qty_needed
                line_total_cost = 0.0
                first_batch = False

                for batch in active_batches:
                    if remaining_to_deduct <= 0:
                        break

                    if not first_batch:
                        first_batch = batch

                    deduct = min(batch.x_remaining_quantity, remaining_to_deduct)
                    batch.x_remaining_quantity -= deduct
                    line_total_cost += deduct * batch.x_base_cost_price
                    remaining_to_deduct -= deduct

                line.write({
                    'x_batch_id': first_batch.id if first_batch else False,
                    'x_subtotal_cost': line_total_cost,
                    'x_cost_price': (line_total_cost / line.x_quantity_sold) if line.x_quantity_sold else 0.0,
                    'x_profit': line.x_subtotal_price - line_total_cost
                })

                # Refresh total stok item
                item._compute_total_stock()

            order.write({'x_payment_status': 'paid'})

    def action_cancel(self):
        """Batalkan transaksi dan kembalikan stok jika sebelumnya telah terpotong"""
        for order in self:
            if order.x_payment_status == 'paid':
                for line in order.x_line_ids:
                    if line.x_batch_id and line.x_base_quantity_deducted > 0:
                        line.x_batch_id.x_remaining_quantity += line.x_base_quantity_deducted
                        line.x_unit_id.x_item_id._compute_total_stock()
            order.write({'x_payment_status': 'cancelled'})


class PosOrderLine(models.Model):
    _name = 'x_pos_order_line'
    _description = 'Baris Item Belanja Kasir POS'

    x_order_id = fields.Many2one('x_pos_order', string='Nota Penjualan', required=True, ondelete='cascade')
    x_unit_id = fields.Many2one('x_pos_unit', string='Produk & Satuan Jual', required=True, index=True)
    x_item_id = fields.Many2one('x_pos_item', string='Barang Induk', related='x_unit_id.x_item_id', store=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Mata Uang',
        related='x_order_id.currency_id',
        readonly=True
    )

    x_quantity_sold = fields.Float(
        string='Qty Jual',
        required=True,
        default=1.0,
        digits=(15, 2)
    )

    x_unit_price = fields.Float(
        string='Harga Satuan (Rp)',
        compute='_compute_unit_price',
        store=True,
        readonly=False,
        digits=(15, 2),
        help='Harga jual varian yang diambil otomatis'
    )

    x_subtotal_price = fields.Float(
        string='Subtotal Penjualan (Rp)',
        compute='_compute_subtotal_price',
        store=True,
        digits=(15, 2)
    )

    x_base_quantity_deducted = fields.Float(
        string='Satuan Dasar Terpotong',
        compute='_compute_base_qty_deducted',
        store=True,
        digits=(15, 4),
        help='Bahan baku satuan dasar gudang yang terpotong (Qty x Kebutuhan Bahan)'
    )

    x_cost_price = fields.Float(
        string='HPP Modal Snapshot (Rp)',
        digits=(15, 2),
        readonly=True,
        help='Snapshot harga modal per unit barang saat transaksi sah'
    )

    x_subtotal_cost = fields.Float(
        string='Subtotal Modal (Rp)',
        digits=(15, 2),
        readonly=True
    )

    x_profit = fields.Float(
        string='Laba Kotor Baris (Rp)',
        digits=(15, 2),
        readonly=True
    )

    x_batch_id = fields.Many2one(
        'x_pos_batch',
        string='Batch FIFO Terpotong',
        readonly=True
    )

    @api.depends('x_unit_id', 'x_unit_id.x_selling_price')
    def _compute_unit_price(self):
        for line in self:
            line.x_unit_price = line.x_unit_id.x_selling_price if line.x_unit_id else 0.0

    @api.depends('x_quantity_sold', 'x_unit_price')
    def _compute_subtotal_price(self):
        for line in self:
            line.x_subtotal_price = (line.x_quantity_sold or 0.0) * (line.x_unit_price or 0.0)

    @api.depends('x_quantity_sold', 'x_unit_id', 'x_unit_id.x_conversion_factor')
    def _compute_base_qty_deducted(self):
        for line in self:
            factor = line.x_unit_id.x_conversion_factor if line.x_unit_id else 1.0
            line.x_base_quantity_deducted = (line.x_quantity_sold or 0.0) * factor
