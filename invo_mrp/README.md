# Invo MRP — Textile Manufacturing & BoM Module for Odoo 20.0 Enterprise

Modul Odoo 20.0 Enterprise untuk mengelola proses produksi konveksi sprei dari pemotongan kain katun gelondongan (roll FIFO), perakitan karet sudut 4 sisi, penerbitan **Surat Perintah Kerja (SPK) Jahit Borongan**, hingga alokasi otomatis hasil produksi sprei jadi ke rak etalase kasir **Invo POS**.

---

## 🎯 Fitur Utama

1. **Standarisasi Bill of Materials (BoM) Tekstil:**
   - Multi-komponen: Kain Katun Roll Utama + Karet Sudut 2.5cm + Resleting YKK + Mika Kemasan.
   - Karakteristik tekstil: Corak/Motif kain, Lebar kain mentah (2.4m), dan persentase toleransi susut obras.
   - Kalkulasi otomatis estimasi HPP Komposit Standar per unit sprei.

2. **Surat Perintah Kerja (SPK) Jahit Konveksi:**
   - Penomoran otomatis berurutan (`SPK/2026/0001`).
   - Penugasan kerja langsung ke mitra penjahit borongan dengan target tanggal penyelesaian.
   - Pelacakan pemotongan meteran kain langsung dari nomor Lot/Batch FIFO aktif.
   - Dokumen cetak PDF resmi QWeb berstandar industri dengan instruksi teknis jahitan dan tanda tangan penjahit.

3. **Auto-Push ke Rak Etalase Kasir POS:**
   - Begitu SPK selesai (`button_mark_done`), sistem otomatis:
     1. Menambah kuota fisik stok varian kasir (`x_pos_unit.x_stock_unit += qty`).
     2. Memotong saldo meteran kain pada batch FIFO dan master bahan mentah.
     3. Mengunci HPP Komposit aktual pada kartu persediaan.
     4. Mencatat riwayat alokasi pada chatter Odoo.

4. **Manajemen Limbah Scrap Kain Perca:**
   - Klasifikasi potongan kain perca (Perca kecil untuk keset/lap, perca sedang untuk sarung bantal).
   - Timbangan bobot kilogram perca dan kalkulasi nilai pemulihan penjualan limbah tekstil.

---

## 🏗️ Struktur Modul

```text
invo_mrp/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   ├── mrp_bom.py          # Ekstensi mrp.bom & mrp.bom.line tekstil
│   ├── mrp_production.py   # Ekstensi mrp.production (SPK Jahit & Auto-Push POS)
│   └── mrp_scrap.py        # Ekstensi stock.scrap untuk limbah kain perca
├── views/
│   ├── mrp_bom_views.xml   # Form & tree view BoM tekstil
│   ├── mrp_production_views.xml # Form & tree view SPK Konveksi
│   └── menu_views.xml      # Integrasi menu di bawah Invo POS
├── security/
│   └── ir.model.access.csv # Hak akses user & manager
├── data/
│   ├── mrp_sequence_data.xml   # Sequence SPK Jahit
│   └── demo_textile_bom_data.xml # Master data aksesoris jahit
└── reports/
    └── spk_jahit_report.xml # QWeb PDF Report Cetak SPK Jahit Konveksi
```

---

## ⚙️ Persyaratan Dependensi

Modul ini memerlukan dependensi modul Odoo berikut pada `__manifest__.py`:
- `mrp`
- `stock`
- `purchase`
- `account`
- `invo_pos`
