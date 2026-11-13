# -*- coding: utf-8 -*-
{
    'name': 'Invo POS - Textile Manufacturing & BoM (MRP)',
    'version': '20.0.1.0.0',
    'category': 'Manufacturing/Manufacturing',
    'summary': 'Standarisasi BoM Tekstil, SPK Jahit Borongan, dan Integrasi Rak Kasir POS',
    'description': """
Modul Ekstensi Manufaktur Konveksi Tekstil untuk Odoo 20.0 Enterprise:
=======================================================================
- Standarisasi Bill of Materials (BoM) multi-komponen (Kain Katun FIFO, Karet Elastis, Resleting).
- Perhitungan HPP Komposit otomatis (Biaya Bahan Baku + Upah Borongan Jahit + Aksesoris).
- Surat Perintah Kerja (SPK) Jahit Konveksi dengan penugasan ke penjahit borongan.
- Auto-Push kuota stok barang jadi (Sprei XL/L/M) langsung ke etalase kasir Invo POS.
- Manajemen kain perca / scrap sisa potongan bahan kain.
- QWeb PDF Report cetak resmi SPK Konveksi.
    """,
    'author': 'Toko Sprei Jendral & Invo POS Team',
    'website': 'https://github.com/HaninSM/Odoo-custom',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'mrp',
        'stock',
        'purchase',
        'account',
        'invo_pos',
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/mrp_sequence_data.xml',
        'data/demo_textile_bom_data.xml',
        'views/mrp_bom_views.xml',
        'views/mrp_production_views.xml',
        'views/menu_views.xml',
        'reports/spk_jahit_report.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
}
