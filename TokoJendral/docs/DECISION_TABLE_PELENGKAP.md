# 📋 DECISION TABLE TEST CASES (MODUL PELENGKAP BISNIS)
## Beban Operasional, Pelunasan Hutang Dagang (Register Payment), & Audit Batch Stok FIFO

Dokumen ini disusun menggunakan metodologi **Senior QA Test Design Techniques (ISTQB Standard)** untuk memetakan logika bisnis menu pelengkap operasional toko: pencatatan beban operasional non-HPP, pelunasan faktur hutang supplier (*Vendor Bill Settlement*), dan audit kartu persediaan FIFO.

---

## 1. 📐 Matriks Decision Table: Beban Operasional & Laba Bersih (*Net Profit*)

### Modul: `x_pos_expense` & Perhitungan Laba Bersih Toko

| Kode | Kondisi / Aksi | R1 (⭐ Golden Path)<br>Beban Listrik & Toko | R2 (Multi-Expenses)<br>Listrik + Sewa + Gaji | R3 (Zero Expense)<br>Tanpa Beban Operasional | R4 (Negative Amount)<br>Nominal Negatif/Nol |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **C1** | Laba Kotor Penjualan Kasir Tersedia? | **Y (Rp 37.500)** | **Y (Rp 37.500)** | **Y (Rp 37.500)** | **Y (Rp 37.500)** |
| **C2** | Kategori Beban Operasional Terpilih? | **Utilitas (Listrik)** | **Multi-Kategori** | - | **Utilitas** |
| **C3** | Nominal Beban Valid ($> 0$)? | **Y (Rp 15.000)** | **Y (Total Rp 25.000)** | **Nol (Rp 0)** | **N (<= 0)** |
| **C4** | Tombol Simpan Beban Diklik? | **Y** | **Y** | - | **Y** |
| | **--- KEPUTUSAN / AKSI SISTEM ---** | | | | |
| **A1** | Catat Beban pada Buku Pengeluaran Toko | **X** (Rp 15.000) | **X** (Rp 25.000) | - | - |
| **A2** | Kurangi Saldo Buku Kas Tunai / Bank | **X** (-Rp 15.000) | **X** (-Rp 25.000) | - | - |
| **A3** | Hitung Laba Bersih Riil Usaha (*Net Profit*) | **X** (Rp 22.500) | **X** (Rp 12.500) | **X** (Rp 37.500) | - |
| **A4** | Blokir & Tampilkan Dialog Error Input | - | - | - | **X** ("Nominal > 0!") |

---

## 2. 📐 Matriks Decision Table: Pelunasan Faktur Hutang Supplier (*Vendor Bill Settlement*)

### Modul: `account.move` (`in_invoice`) & `account.payment`

| Kode | Kondisi / Aksi | R1 (⭐ Golden Path)<br>Pelunasan Penuh Bank | R2 (Partial Payment)<br>Cicilan 50% | R3 (Overpayment)<br>Bayar Melebihi Hutang | R4 (Different Bank)<br>Pindah Jurnal Bayar |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **C1** | Faktur Vendor Bill Berstatus `not_paid`? | **Y (Rp 1.200.000)** | **Y (Rp 1.200.000)** | **Y (Rp 1.200.000)** | **Y (Rp 1.200.000)** |
| **C2** | Saldo Rekening Pembayar Cukup? | **Y ([BNK1] Cukup)** | **Y ([BNK1] Cukup)** | **Y ([BNK1] Cukup)** | **Y ([CSH1] Cukup)** |
| **C3** | Nominal Pembayaran yang Diinput | **Pas (Rp 1.200.000)** | **Sebagian (Rp 600.000)** | **Lebih (Rp 1.500.000)** | **Pas (Rp 1.200.000)** |
| **C4** | Tombol *[Register Payment / Buat Pembayaran]* Diklik? | **Y** | **Y** | **Y** | **Y** |
| | **--- KEPUTUSAN / AKSI SISTEM ---** | | | | |
| **A1** | Kurangi Saldo Buku Bank / Kas Toko | **X** (-Rp 1.200.000) | **X** (-Rp 600.000) | - | **X** (-Rp 1.200.000) |
| **A2** | Status Faktur Berubah Menjadi `PAID` (Lunas) | **X** | - | - | **X** |
| **A3** | Status Faktur Berubah Menjadi `PARTIALLY PAID` | - | **X** (Sisa 600k) | - | - |
| **A4** | Hapus dari Daftar Pengingat Jatuh Tempo (*Aging*) | **X** (Bebas Hutang) | - (Jatuh Tempo Sisa) | - | **X** (Bebas Hutang) |
| **A5** | Tolak Transaksi & Munculkan Peringatan Selisih | - | - | **X** ("Melebihi Tagihan") | - |

---

## 3. 🧪 Penjabaran Test Case Terstruktur (Senior QA Specification)

### TC-PELENGKAP-01: Pencatatan Beban Listrik & Kalkulasi Laba Bersih Toko (P1 - Critical)
* **Tujuan Pengujian:** Memvalidasi saat beban listrik Rp 15.000 diinput ke modul `x_pos_expense`, sistem langsung memotong laba kotor penjualan (Rp 37.500) menjadi **Laba Bersih Rp 22.500**.
* **Pre-conditions:** Transaksi kasir menghasilkan laba kotor Rp 37.500.
* **Langkah Uji & Data Input:**
  1. Buka menu `💸 Biaya & Laporan` $\rightarrow$ `Beban Operasional`.
  2. Klik `+ Baru`, input Keterangan: `Tagihan Listrik & Operasional Toko`.
  3. Kategori: `Utilitas`, Nominal: `Rp 15.000`, Tanggal: Hari ini. Klik `Simpan`.
* **Ekspektasi Hasil Sistem:**
  * Beban tercatat Rp 15.000.
  * Laporan Laba Rugi Toko mengkalkulasi: $\text{Rp } 37.500 - 15.000 = \mathbf{\text{Rp } 22.500\text{ (Laba Bersih Usaha)}}$.

---

### TC-PELENGKAP-02: Pelunasan Penuh Vendor Bill Net 30 via Register Payment (P1 - Critical)
* **Tujuan Pengujian:** Memvalidasi tagihan supplier PT. Tekstil Maju Jaya (Rp 1.200.000) berhasil dilunasi dari buku bank bisnis `[BNK1]`, status berubah menjadi `PAID`, dan menghapus saldo kewajiban di laporan *Aged Payables*.
* **Pre-conditions:** Faktur Vendor Bill `PO-202611-0001` berstatus `not_paid` jatuh tempo `01/12/2026`.
* **Langkah Uji & Data Input:**
  1. Buka modul `Akuntansi` $\rightarrow$ `Tagihan Vendor (Bills)`.
  2. Buka tagihan `PT. Tekstil Maju Jaya` (Rp 1.200.000).
  3. Klik tombol `Register Payment`.
  4. Pilih Jurnal: `[BNK1] Bank Bisnis`, Nominal: `Rp 1.200.000`. Klik `Create Payment`.
* **Ekspektasi Hasil Sistem:**
  * Badge status faktur berubah dari merah (*Not Paid*) menjadi hijau bercahaya **`PAID`**.
  * Saldo buku bank koran `[BNK1]` berkurang **-Rp 1.200.000**.
  * Saldo hutang dagang supplier menjadi **Rp 0** (Laporan Aging bersih tanpa tagihan jatuh tempo).

---

### TC-PELENGKAP-03: Pembayaran Cicilan / Partial Payment Tagihan Supplier (P2 - High)
* **Tujuan Pengujian:** Menguji saat toko membayar DP atau cicilan 50% (Rp 600.000), sistem menandai status `In Payment / Partially Paid` dan menyisakan saldo sisa tagihan Rp 600.000 pada tanggal jatuh tempo 1 Desember 2026.
* **Ekspektasi Hasil Sistem:**
  * Sisa hutang supplier tercatat tepat Rp 600.000.

---

### TC-PELENGKAP-04: Audit Kartu Batch Stok FIFO Gudang (`x_pos_batch`) (P2 - Medium)
* **Tujuan Pengujian:** Memverifikasi integritas historis pemotongan stok pada buku gudang:
  * Batch 1 terbit 60m saat PO.
  * Batch 1 terpotong 30m saat produksi sprei.
  * Kartu batch secara transparan menunjukkan sisa saldo: **30 Meter @ Rp 20.000/m**.
