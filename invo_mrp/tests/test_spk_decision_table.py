# -*- coding: utf-8 -*-
from odoo.tests.common import TransactionCase
from odoo.exceptions import UserError, ValidationError

class TestSpkDecisionTable(TransactionCase):
    """
    ISTQB Decision Table Test Suite untuk Alur Konveksi Make-to-Stock (Tahap 2 Tengah)
    Memvalidasi Rule R1 (Golden Path), Rule R2 (Exhaustion), Rule R3 (Zero Labor), dan Rule R4 (Defisit).
    """

    def setUp(self):
        super(TestSpkDecisionTable, self).setUp()
        self.ItemObj = self.env['x_pos_item']
        self.UnitObj = self.env['x_pos_unit']
        self.BatchObj = self.env['x_pos_batch']
        self.ProductionObj = self.env['mrp.production']

        # Setup Master Kain Katun
        self.kain_katun = self.ItemObj.create({
            'x_name': 'Kain Katun Sprei "XXX"',
            'x_base_uom': 'Meter (m)',
            'x_stock_base': 60.0,
            'x_base_cost_price': 20000.0,
        })

        # Setup Varian Sprei XL (180x200)
        self.sprei_xl = self.UnitObj.create({
            'x_name': 'Sprei XL (180 × 200)',
            'x_item_id': self.kain_katun.id,
            'x_conversion_factor': 3.0,
            'x_stock_unit': 0.0,
            'x_margin_pct': 50.0,
            'x_selling_price': 112500.0,
            'x_calculated_cogs': 75000.0,
        })

        # Setup Batch 1 FIFO (60 Meter @ Rp 20.000)
        self.batch_1 = self.BatchObj.create({
            'x_name': 'BATCH-2026-11-001',
            'x_item_id': self.kain_katun.id,
            'x_initial_base_qty': 60.0,
            'x_remaining_base_qty': 60.0,
            'x_cost_per_base_unit': 20000.0,
            'x_status': 'active',
        })

    def test_tc_tengah_01_golden_path_10_pcs(self):
        """
        Rule 1 (R1 - Golden Path):
        Target 10 pcs Sprei XL -> Butuh 30m Kain -> Potong dari Batch 1.
        Ekspektasi: Sisa Batch = 30m, HPP Komposit = Rp 75.000, Rak Kasir = +10 pcs.
        """
        spk = self.ProductionObj.create({
            'product_qty': 10.0,
            'x_pos_item_id': self.kain_katun.id,
            'x_pos_unit_id': self.sprei_xl.id,
            'x_fifo_batch_id': self.batch_1.id,
            'x_labor_cost_per_pcs': 10000.0,
            'x_accessory_cost_per_pcs': 5000.0,
            'x_auto_push_pos': True,
        })

        # Verifikasi kalkulasi pra-eksekusi
        self.assertEqual(spk.x_actual_composite_hpp, 75000.0, "HPP Komposit harus Rp 75.000/pcs")
        self.assertEqual(spk.x_total_labor_cost, 100000.0, "Total upah borongan 10 pcs harus Rp 100.000")

        # Eksekusi Selesai Jahit
        spk.button_mark_done()

        # Verifikasi Pasca-Eksekusi (Post-Conditions)
        self.assertEqual(self.batch_1.x_remaining_base_qty, 30.0, "Sisa kain batch harus 30 meter")
        self.assertEqual(self.batch_1.x_status, 'active', "Batch 1 harus tetap aktif karena masih ada sisa 30m")
        self.assertEqual(self.sprei_xl.x_stock_unit, 10.0, "Etalase rak kasir harus bertambah 10 pcs siap jual")
        self.assertTrue(spk.x_is_pushed_to_pos, "Status auto-push kasir harus True")

    def test_tc_tengah_02_bva_batch_exhaustion_exact_60m(self):
        """
        Rule 2 (R2 - Boundary Value Analysis / Exhaustion):
        Target 20 pcs Sprei XL -> Butuh TEPAT 60m Kain -> Menghabiskan Batch 1.
        Ekspektasi: Sisa Batch = 0m, Status Batch = depleted.
        """
        spk = self.ProductionObj.create({
            'product_qty': 20.0,
            'x_pos_item_id': self.kain_katun.id,
            'x_pos_unit_id': self.sprei_xl.id,
            'x_fifo_batch_id': self.batch_1.id,
            'x_labor_cost_per_pcs': 10000.0,
            'x_accessory_cost_per_pcs': 5000.0,
            'x_auto_push_pos': True,
        })

        spk.button_mark_done()

        self.assertEqual(self.batch_1.x_remaining_base_qty, 0.0, "Sisa kain batch harus 0 meter (habis)")
        self.assertEqual(self.batch_1.x_status, 'depleted', "Status batch harus berubah menjadi depleted")
        self.assertEqual(self.sprei_xl.x_stock_unit, 20.0, "Rak kasir bertambah 20 pcs")

    def test_tc_tengah_03_zero_labor_cost(self):
        """
        Rule 3 (R3 - Zero Labor / In-house Production):
        Upah jahit = Rp 0, Aksesoris = Rp 0.
        Ekspektasi: HPP Komposit = HPP murni kain (3m x Rp 20.000 = Rp 60.000/pcs).
        """
        spk = self.ProductionObj.create({
            'product_qty': 5.0,
            'x_pos_item_id': self.kain_katun.id,
            'x_pos_unit_id': self.sprei_xl.id,
            'x_fifo_batch_id': self.batch_1.id,
            'x_labor_cost_per_pcs': 0.0,
            'x_accessory_cost_per_pcs': 0.0,
            'x_auto_push_pos': True,
        })

        self.assertEqual(spk.x_actual_composite_hpp, 60000.0, "HPP murni kain harus Rp 60.000/pcs")
