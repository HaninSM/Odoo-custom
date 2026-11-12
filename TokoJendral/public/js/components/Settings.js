/**
 * Settings component - manage system-wide settings.
 */
const SettingsComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    content.innerHTML = '<p>Memuat pengaturan...</p>';

    try {
      const res = await API.get('/api/settings');
      const settings = res.data;

      content.innerHTML = `
        <div class="card">
          <div class="card-header"><h3>⚙️ Pengaturan Sistem</h3></div>
          <form id="settingsForm">
            <div class="form-group">
              <label>Nama Toko</label>
              <input type="text" id="setStoreName" value="${settings.store_name || 'Toko POS'}">
            </div>
            <div class="form-group">
              <label>Email Toko (untuk alert)</label>
              <input type="email" id="setStoreEmail" value="${settings.store_email || ''}">
            </div>
            <div class="form-group">
              <label>Ambang Batas Low-Stock (%)</label>
              <input type="number" id="setThreshold" min="1" max="100" value="${settings.low_stock_threshold_percentage || 20}">
              <small style="color:var(--gray-500)">Sistem akan memperingatkan jika stok batch di bawah persentase ini.</small>
            </div>
            <div class="form-group">
              <label>Mata Uang</label>
              <input type="text" id="setCurrency" value="${settings.currency || 'IDR'}">
            </div>
            <button type="button" class="btn btn-primary" onclick="SettingsComponent.save()">Simpan Pengaturan</button>
          </form>
        </div>`;
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  },

  async save() {
    const updates = [
      { key: 'store_name', value: document.getElementById('setStoreName').value },
      { key: 'store_email', value: document.getElementById('setStoreEmail').value },
      { key: 'low_stock_threshold_percentage', value: document.getElementById('setThreshold').value },
      { key: 'currency', value: document.getElementById('setCurrency').value }
    ];

    try {
      for (const { key, value } of updates) {
        await API.put('/api/settings', { key, value });
      }
      App.toast('Pengaturan berhasil disimpan!');
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
