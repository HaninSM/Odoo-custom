/**
 * Developer Component - Dedicated data maintenance & cleanup tools for role "developer".
 */
const DeveloperComponent = {
  stats: null,

  async render() {
    const content = document.getElementById('contentArea');
    document.getElementById('headerActions').innerHTML = `
      <button class="btn btn-secondary" onclick="DeveloperComponent.loadStats()">🔄 Refresh Data</button>`;

    content.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <!-- Banner Info Role Developer -->
        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom: 8px;">
            <span style="font-size: 28px;">🛠️</span>
            <div>
              <h2 style="font-size: 20px; font-weight: 700; margin:0; color:#38bdf8;">Developer Data Management Panel</h2>
              <p style="margin:2px 0 0 0; color:#94a3b8; font-size:13px;">Panel khusus Role Developer untuk pemeliharaan, reset data pengujian, atau pembersihan data transaksional lampau.</p>
            </div>
          </div>
        </div>

        <!-- Database Overview Stats -->
        <div class="card" style="margin-bottom: 24px;">
          <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--gray-700);">📊 Status Data Saat Ini di Database</h3>
          <div id="devStatsContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;">
            <div style="text-align:center; padding:12px; background:var(--gray-50); border-radius:8px;">Memuat status data...</div>
          </div>
        </div>

        <!-- Main Cleanup Form -->
        <div class="card">
          <h3 style="font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--gray-200); padding-bottom: 10px;">
            🗑️ Formulir Penghapusan & Reset Data
          </h3>

          <form id="devCleanupForm" onsubmit="event.preventDefault(); DeveloperComponent.confirmCleanup();">
            <!-- 1. Pilihan Mode -->
            <div style="margin-bottom: 20px;">
              <label style="font-weight: 700; margin-bottom: 8px; display:block;">Pilih Cakupan Penghapusan:</label>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 14px; border:1px solid var(--gray-200); border-radius:8px; background:var(--gray-50);">
                  <input type="radio" name="devMode" value="filtered" checked onchange="DeveloperComponent.toggleMode()" style="margin-top:3px;">
                  <div>
                    <strong>Pilihan Form / Modul Spesifik & Periode Tanggal</strong>
                    <div style="font-size:12px; color:var(--gray-600);">Hapus data pada form/modul tertentu saja dalam rentang tanggal tertentu (misal: hanya transaksi penjualan bulan lalu).</div>
                  </div>
                </label>

                <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 14px; border:1px solid #fecaca; border-radius:8px; background:#fff1f2;">
                  <input type="radio" name="devMode" value="all" onchange="DeveloperComponent.toggleMode()" style="margin-top:3px;">
                  <div>
                    <strong style="color:#b91c1c;">Hapus SEMUA Data (Wipe All Operational & Master Data)</strong>
                    <div style="font-size:12px; color:#7f1d1d;">Mengosongkan seluruh data transaksi penjualan, pembelian, persediaan FIFO, katalog produk, master item, supplier, dan biaya. Akun pengguna & pengaturan sistem tetap aman.</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 2. Pilihan Form / Modul (Hanya untuk Mode Filtered) -->
            <div id="devFilteredSection" style="margin-bottom: 20px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: white;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                <label style="font-weight: 700; margin:0;">Pilih Form / Modul yang Ingin Dihapus:</label>
                <div style="display:flex; gap:6px;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="DeveloperComponent.selectAllForms(true)">Pilih Semua</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="DeveloperComponent.selectAllForms(false)">Kosongkan</button>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; margin-bottom: 16px;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px 12px; background:var(--gray-50); border-radius:6px;">
                  <input type="checkbox" name="devFormItem" value="transactions" checked>
                  <span>🛒 Transaksi Penjualan (POS)</span>
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px 12px; background:var(--gray-50); border-radius:6px;">
                  <input type="checkbox" name="devFormItem" value="purchases" checked>
                  <span>🚚 Pembelian & Batch Inventori</span>
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px 12px; background:var(--gray-50); border-radius:6px;">
                  <input type="checkbox" name="devFormItem" value="expenses" checked>
                  <span>💰 Biaya Operasional (Expenses)</span>
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px 12px; background:var(--gray-50); border-radius:6px;">
                  <input type="checkbox" name="devFormItem" value="products">
                  <span>🎯 Produk & Satuan Jual</span>
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px 12px; background:var(--gray-50); border-radius:6px;">
                  <input type="checkbox" name="devFormItem" value="items">
                  <span>📦 Master Item / Barang</span>
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px 12px; background:var(--gray-50); border-radius:6px;">
                  <input type="checkbox" name="devFormItem" value="suppliers">
                  <span>🤝 Data Supplier</span>
                </label>
              </div>

              <!-- 3. Periode Tanggal -->
              <label style="font-weight: 700; margin-bottom: 6px; display:block;">Periode Tanggal Data:</label>
              <div style="font-size:12px; color:var(--gray-600); margin-bottom:10px;">
                Kosongkan tanggal jika ingin menghapus seluruh data pada modul terpilih tanpa batasan waktu.
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom: 10px;">
                <div class="form-group" style="margin:0;">
                  <label style="font-size:12px; color:var(--gray-600);">Dari Tanggal (Mulai):</label>
                  <input type="date" id="devStartDate">
                </div>
                <div class="form-group" style="margin:0;">
                  <label style="font-size:12px; color:var(--gray-600);">Sampai Tanggal (Selesai):</label>
                  <input type="date" id="devEndDate">
                </div>
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="DeveloperComponent.setDatePreset('today')">Hari Ini</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="DeveloperComponent.setDatePreset('this_month')">Bulan Ini</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="DeveloperComponent.setDatePreset('clear')">Reset Tanggal</button>
              </div>
            </div>

            <!-- Safety Confirmation Box -->
            <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:14px; margin-bottom: 20px;">
              <div style="font-weight:700; color:#b45309; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>⚠️</span> Konfirmasi Keamanan Penghapusan
              </div>
              <p style="font-size:12.5px; color:#78350f; margin-bottom:10px;">
                Tindakan penghapusan data bersifat permanen dan tidak dapat dibatalkan (<em>irreversible</em>). Untuk melanjutkan, ketik kata <strong>DELETE</strong> pada kolom berikut:
              </p>
              <input type="text" id="devConfirmWord" placeholder='Ketik "DELETE"' style="max-width: 250px; font-weight:700; text-transform:uppercase;">
            </div>

            <!-- Submit Button -->
            <div style="display:flex; justify-content:flex-end;">
              <button type="submit" class="btn btn-danger" style="padding: 10px 24px; font-weight:700;">
                🚨 Eksekusi Penghapusan Data
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    await this.loadStats();
  },

  async loadStats() {
    const container = document.getElementById('devStatsContainer');
    if (!container) return;

    try {
      const res = await API.get('/api/developer/stats');
      const stats = res.data;
      this.stats = stats;

      container.innerHTML = `
        <div style="padding:12px; background:var(--gray-50); border-radius:8px; text-align:center;">
          <div style="font-size:11px; color:var(--gray-500); text-transform:uppercase; font-weight:600;">Transaksi</div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${stats.transactions.count}</div>
          <div style="font-size:10px; color:var(--gray-500);">${stats.transactions.count ? `${Format.date(stats.transactions.minDate)} s/d ${Format.date(stats.transactions.maxDate)}` : 'Kosong'}</div>
        </div>
        <div style="padding:12px; background:var(--gray-50); border-radius:8px; text-align:center;">
          <div style="font-size:11px; color:var(--gray-500); text-transform:uppercase; font-weight:600;">Pembelian</div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${stats.purchases.count}</div>
          <div style="font-size:10px; color:var(--gray-500);">${stats.purchases.count ? `${Format.date(stats.purchases.minDate)} s/d ${Format.date(stats.purchases.maxDate)}` : 'Kosong'}</div>
        </div>
        <div style="padding:12px; background:var(--gray-50); border-radius:8px; text-align:center;">
          <div style="font-size:11px; color:var(--gray-500); text-transform:uppercase; font-weight:600;">Pengeluaran</div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${stats.expenses.count}</div>
          <div style="font-size:10px; color:var(--gray-500);">${stats.expenses.count ? `${Format.date(stats.expenses.minDate)} s/d ${Format.date(stats.expenses.maxDate)}` : 'Kosong'}</div>
        </div>
        <div style="padding:12px; background:var(--gray-50); border-radius:8px; text-align:center;">
          <div style="font-size:11px; color:var(--gray-500); text-transform:uppercase; font-weight:600;">Varian Produk</div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${stats.productUnits.count}</div>
          <div style="font-size:10px; color:var(--gray-500);">${stats.productUnits.count} Satuan Jual</div>
        </div>
        <div style="padding:12px; background:var(--gray-50); border-radius:8px; text-align:center;">
          <div style="font-size:11px; color:var(--gray-500); text-transform:uppercase; font-weight:600;">Master Barang</div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${stats.items.count}</div>
          <div style="font-size:10px; color:var(--gray-500);">${stats.items.count} Item Induk</div>
        </div>
        <div style="padding:12px; background:var(--gray-50); border-radius:8px; text-align:center;">
          <div style="font-size:11px; color:var(--gray-500); text-transform:uppercase; font-weight:600;">Supplier</div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${stats.suppliers.count}</div>
          <div style="font-size:10px; color:var(--gray-500);">${stats.suppliers.count} Pemasok</div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div style="color:var(--danger); grid-column:1/-1;">Gagal memuat status data: ${err.message}</div>`;
    }
  },

  toggleMode() {
    const isFiltered = document.querySelector('input[name="devMode"]:checked')?.value === 'filtered';
    const section = document.getElementById('devFilteredSection');
    if (section) {
      section.style.display = isFiltered ? 'block' : 'none';
    }
  },

  selectAllForms(checked) {
    document.querySelectorAll('input[name="devFormItem"]').forEach(cb => {
      cb.checked = checked;
    });
  },

  setDatePreset(preset) {
    const start = document.getElementById('devStartDate');
    const end = document.getElementById('devEndDate');
    const now = new Date();

    if (preset === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      if (start) start.value = todayStr;
      if (end) end.value = todayStr;
    } else if (preset === 'this_month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
      if (start) start.value = `${y}-${m}-01`;
      if (end) end.value = `${y}-${m}-${lastDay}`;
    } else if (preset === 'clear') {
      if (start) start.value = '';
      if (end) end.value = '';
    }
  },

  async confirmCleanup() {
    const confirmWord = document.getElementById('devConfirmWord')?.value.trim().toUpperCase();
    if (confirmWord !== 'DELETE') {
      App.toast('Ketik kata "DELETE" dengan tepat untuk konfirmasi keamanan!', 'error');
      return;
    }

    const mode = document.querySelector('input[name="devMode"]:checked')?.value || 'filtered';
    const forms = [];
    if (mode === 'filtered') {
      document.querySelectorAll('input[name="devFormItem"]:checked').forEach(cb => {
        forms.push(cb.value);
      });
      if (forms.length === 0) {
        App.toast('Pilih minimal 1 form/modul untuk dihapus!', 'error');
        return;
      }
    }

    const startDate = document.getElementById('devStartDate')?.value || null;
    const endDate = document.getElementById('devEndDate')?.value || null;

    if (startDate && endDate && startDate > endDate) {
      App.toast('Tanggal Mulai tidak boleh lebih besar dari Tanggal Selesai!', 'error');
      return;
    }

    const promptMsg = mode === 'all'
      ? 'APAKAH ANDA BENAR-BENAR YAKIN? Semua data transaksi dan inventori akan DIHAPUS BERSIH!'
      : `Apakah Anda yakin ingin menghapus data terpilih (${forms.join(', ')}) ${startDate ? `dari ${startDate} s/d ${endDate || 'sekarang'}` : 'seluruh periode'}?`;

    if (!window.confirm(promptMsg)) return;

    try {
      const res = await API.post('/api/developer/cleanup', {
        mode,
        forms,
        startDate,
        endDate
      });

      const d = res.data.deleted || {};
      const summaryList = Object.entries(d)
        .filter(([_, count]) => count > 0)
        .map(([key, count]) => `• ${key}: ${count} baris`)
        .join('\n');

      const msg = `${res.data.message}\n\nRincian Data Dihapus:\n${summaryList || '• 0 baris dihapus.'}`;
      alert(msg);
      App.toast('Operasi penghapusan data berhasil diselesaikan.');

      // Reset confirmation word
      const confirmInput = document.getElementById('devConfirmWord');
      if (confirmInput) confirmInput.value = '';

      // Reload stats
      await this.loadStats();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
