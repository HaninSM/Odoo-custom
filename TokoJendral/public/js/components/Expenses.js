/**
 * Expenses component - manage operational expenses.
 * These reduce Net Profit in financial reports.
 */
const ExpensesComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    document.getElementById('headerActions').innerHTML = `
      <button class="btn btn-primary" onclick="ExpensesComponent.showForm()">➕ Tambah Pengeluaran</button>`;

    content.innerHTML = '<p>Memuat pengeluaran...</p>';

    try {
      const res = await API.get('/api/expenses');
      const expenses = res.data;
      const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

      content.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-icon red">💸</div><div class="stat-info"><h4>${Format.currency(total)}</h4><p>Total Pengeluaran</p></div></div>
        </div>
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>Tanggal</th><th>Kategori</th><th>Jumlah</th><th>Catatan</th><th>Oleh</th><th>Aksi</th></tr></thead>
              <tbody>
                ${expenses.length === 0 ? '<tr><td colspan="6" class="empty-state">Belum ada pengeluaran.</td></tr>' :
                  expenses.map(e => `<tr>
                    <td>${Format.date(e.expense_date)}</td>
                    <td><span class="badge badge-warning">${e.category}</span></td>
                    <td>${Format.currency(e.amount)}</td>
                    <td>${e.notes || '-'}</td>
                    <td>${e.created_by}</td>
                    <td><button class="btn btn-sm btn-danger" onclick="ExpensesComponent.remove(${e.id})">🗑️</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  },

  showForm() {
    const body = `
      <form id="expenseForm">
        <div class="form-group"><label>Tanggal</label><input type="date" id="efDate" value="${Format.localDate()}" required></div>
        <div class="form-group"><label>Kategori</label>
          <select id="efCategory" required>
            <option value="Listrik">Listrik</option>
            <option value="Air">Air</option>
            <option value="Sewa">Sewa</option>
            <option value="Gaji">Gaji</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Operasional">Operasional</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div class="form-group"><label>Jumlah (Rp)</label><input type="number" id="efAmount" step="1" min="1" required></div>
        <div class="form-group"><label>Catatan</label><textarea id="efNotes" placeholder="Keterangan pengeluaran"></textarea></div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="ExpensesComponent.submit()">Simpan</button>`;

    App.showModal('Tambah Pengeluaran', body, footer);
  },

  async submit() {
    try {
      await API.post('/api/expenses', {
        expenseDate: document.getElementById('efDate').value,
        category: document.getElementById('efCategory').value,
        amount: parseFloat(document.getElementById('efAmount').value),
        notes: document.getElementById('efNotes').value
      });
      App.toast('Pengeluaran berhasil dicatat!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  async remove(id) {
    if (!await App.confirm('Hapus pengeluaran ini?')) return;
    try {
      await API.delete(`/api/expenses/${id}`);
      App.toast('Pengeluaran berhasil dihapus!');
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
