/**
 * Transactions component - view transaction history.
 * Cashier/Reseller see only their own; Owner sees all.
 */
const TransactionsComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    content.innerHTML = '<p>Memuat transaksi...</p>';

    try {
      const res = await API.get('/api/transactions?limit=100');
      const transactions = res.data;

      content.innerHTML = `
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>ID</th><th>Kasir</th><th>Pelanggan</th><th>Total</th><th>Metode</th><th>Status</th><th>Waktu</th><th>Aksi</th></tr></thead>
              <tbody>
                ${transactions.length === 0 ? '<tr><td colspan="8" class="empty-state">Belum ada transaksi.</td></tr>' :
                  transactions.map(t => `<tr>
                    <td>#${t.id}</td>
                    <td>${t.cashier_name} <span class="badge badge-info">${t.cashier_role}</span></td>
                    <td>${t.customer_name || '-'}</td>
                    <td>${Format.currency(t.total_amount)}</td>
                    <td><span class="badge badge-info">${t.payment_method}</span></td>
                    <td><span class="badge ${t.payment_status === 'paid' ? 'badge-success' : t.payment_status === 'cancelled' ? 'badge-danger' : 'badge-warning'}">${t.payment_status}</span></td>
                    <td>${Format.datetime(t.transaction_date)}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" onclick="TransactionsComponent.viewDetail(${t.id})">👁️</button>
                      ${t.payment_status === 'pending' && API.getUser().role === 'owner' ? `<button class="btn btn-sm btn-success" onclick="TransactionsComponent.confirm(${t.id})">✅</button>` : ''}
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  },

  async viewDetail(id) {
    try {
      const res = await API.get(`/api/transactions/${id}`);
      const t = res.data;

      const body = `
        <div class="receipt">
          <div class="receipt-header">
            <h3>🏪 Toko POS</h3>
            <p>Struk #${t.id}</p>
            <p>${Format.datetime(t.transaction_date)}</p>
            <p>Kasir: ${t.cashier_name}</p>
            ${t.customer_name ? `<p>Pelanggan: ${t.customer_name}</p>` : ''}
          </div>
          <table style="width:100%;font-size:12px">
            ${t.items.map(item => `<tr>
              <td>${item.item_name} - ${item.unit_name}<br><small>${Format.number(item.quantity_sold,2)} x ${Format.currency(item.unit_price)}</small></td>
              <td style="text-align:right">${Format.currency(item.subtotal_price)}</td>
            </tr>`).join('')}
          </table>
          <hr style="border-style:dashed;margin:8px 0">
          <table style="width:100%;font-size:13px">
            <tr><td><strong>Total</strong></td><td style="text-align:right"><strong>${Format.currency(t.total_amount)}</strong></td></tr>
            <tr><td>Metode</td><td style="text-align:right">${t.payment_method}</td></tr>
            <tr><td>Dibayar</td><td style="text-align:right">${Format.currency(t.amount_paid)}</td></tr>
            ${t.change_amount > 0 ? `<tr><td>Kembalian</td><td style="text-align:right">${Format.currency(t.change_amount)}</td></tr>` : ''}
            <tr><td>Status</td><td style="text-align:right"><span class="badge ${t.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}">${t.payment_status}</span></td></tr>
          </table>
          <div class="receipt-footer"><p>Terima kasih!</p></div>
        </div>`;

      App.showModal(`Detail Transaksi #${t.id}`, body);
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  async confirm(id) {
    if (!await App.confirm('Konfirmasi pembayaran transaksi ini?')) return;
    try {
      await API.put(`/api/transactions/${id}/confirm`);
      App.toast('Pembayaran dikonfirmasi!');
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
