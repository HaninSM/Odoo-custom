# Odoo Custom Enterprise — Invo POS & Video Walkthrough Series

Repositori terintegrasi untuk kustomisasi **Odoo 20.0 Enterprise** pada ekosistem ritel tekstil & konveksi **Toko Sprei Jendral**. Repositori ini mencakup modul kustom Odoo, dokumentasi supply chain hulu-ke-muara berstandar ISTQB, serta generator video walkthrough realistis menggunakan Remotion.

---

## 📁 Struktur Repositori

```text
Odoo/
├── invo_pos/                  # Modul Kustom Odoo 20.0 Enterprise
│   ├── models/                # Logika ORM (FIFO lot, dual stock, split payment)
│   ├── views/                 # XML form & tree views Odoo Enterprise
│   ├── data/                  # Master data & sequences
│   ├── security/              # Access rights (ir.model.access.csv)
│   ├── __manifest__.py        # Manifest modul
│   └── __init__.py
├── invo_video/                # Generator Video Walkthrough Realistis (Remotion)
│   ├── src/
│   │   ├── components/        # Reusable UI (NavBar Odoo, Cursor, Callouts, Badges)
│   │   ├── episodes/          # Video seri per divisi & seri akuntansi (10 episode)
│   │   ├── scenes/            # Scene interaktif (Gudang, Konveksi, Kasir, Keuangan)
│   │   ├── Composition.tsx    # Registrasi seluruh komposisi video
│   │   └── Root.tsx
│   └── out/                   # Deliverable file video MP4 siap tayang
├── TokoJendral/               # Arsitektur & Dokumentasi Uji Sistem
│   ├── docs/                  # Decision Tables ISTQB (Hulu, Tengah, Hilir, Muara, Pelengkap)
│   └── README.md
├── invo_pos.zip               # Arsip instalasi modul Odoo siap deploy
├── invo_pos_items_viewer.html # Web viewer interaktif master data POS
└── .gitignore
```

---

## 🚀 Komponen Utama

### 1. Modul `invo_pos` (Odoo 20.0 Enterprise Addon)
- **Multi-UoM & FIFO Tracking:** Mendukung pembelian grosir (1 Kodi = 60 Meter) dengan pelacakan batch kain katun FIFO murni.
- **Dual Stock Mode:** Pengurangan stok fleksibel saat konveksi memotong kain atau saat kasir menjual sprei jadi.
- **Split Multi-Payment:** Dukungan pembayaran QRIS Dinamis/EDC (Akun Kliring `11120010`), Tunai, dan Bank Transfer.
- **Buku Besar Terintegrasi:** Menghubungkan kasir langsung ke jurnal Akuntansi Odoo, pencatatan HPP komposit, dan rekonsiliasi bank.

### 2. Generator Video `invo_video` (Remotion)
Animasi walkthrough Odoo 20.0 realistis dengan cursor dinamis, ripple klik, efek ketik, dropdown navigasi, dan callout step-by-step:
- **Master Walkthrough:** 75 detik supply chain hulu ke hilir.
- **Seri 5 Divisi:** Gudang, Konveksi, Kasir, Keuangan, dan Pelunasan Faktur.
- **Seri 10 Episode Akuntansi & POS:**
  1. *Ep 1:* Accounting Dashboard & Sesi Kasir POS
  2. *Ep 2:* Faktur Pembelian Grosir (Vendor Bills Net 30)
  3. *Ep 3:* Pelunasan Hutang via Bank (Register Payment)
  4. *Ep 4:* Jurnal Entri Double-Entry POS Otomatis
  5. *Ep 5:* Kliring QRIS 11120010 & Rekonsiliasi Bank
  6. *Ep 6:* Pencatatan Beban Operasional Toko (Listrik)
  7. *Ep 7:* Laporan Laba Rugi Real-Time (Profit & Loss)
  8. *Ep 8:* Neraca Keuangan & Valuasi Persediaan (Balance Sheet)
  9. *Ep 9:* Kontrol Umur Hutang Dagang (Aged Payables)
  10. *Ep 10:* Retur Penjualan Kasir & Pembalikan Jurnal (Credit Notes)

### 3. Dokumentasi Decision Table (ISTQB Test Design)
Matriks keputusan logis pengujian di `TokoJendral/docs/`:
- `DECISION_TABLE_HULU.md` (Pengadaan & Vendor Bill)
- `DECISION_TABLE_TENGAH.md` (Produksi & HPP Komposit)
- `DECISION_TABLE_HILIR.md` (Kasir POS & Multi-Payment)
- `DECISION_TABLE_MUARA.md` (Laba Kotor & Rekonsiliasi)
- `DECISION_TABLE_PELENGKAP.md` (Beban Toko & Pelunasan Bank)

---

## 🛠️ Cara Menjalankan Video Remotion

```bash
cd invo_video
npm install
npm start                # Buka Remotion Studio di http://localhost:3000

# Render episode spesifik:
npx remotion render AccEp1-Dashboard out/acc_ep1_dashboard.mp4
```

---

## 📄 Lisensi
MIT License. Dikembangkan untuk Toko Sprei Jendral pada platform Odoo 20.0 Enterprise.
