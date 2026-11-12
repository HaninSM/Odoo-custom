/**
 * Reports component - financial and sales reports for the owner.
 * Includes: Sales Summary, Detailed Sales, Profit & Loss, FIFO Stock, Sales by User.
 */
const ReportsComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    const today = Format.localDate();
    const monthStart = Format.localMonthStart();

    content.innerHTML = `
      <div class="toolbar">
        <div class="filter-group">
          <label>Dari:</label>
          <input type="date" id="reportStartDate" value="${monthStart}">
        </div>
        <div class="filter-group">
          <label>Sampai:</label>
          <input type="date" id="reportEndDate" value="${today}">
        </div>
        <button class="btn btn-primary" onclick="ReportsComponent.loadReports()">Terapkan</button>
      </div>

      <div class="tabs">
        <button class="tab active" onclick="ReportsComponent.switchTab('profit', this)">Laba Rugi</button>
        <button class="tab" onclick="ReportsComponent.switchTab('sales', this)">Penjualan</button>
        <button class="tab" onclick="ReportsComponent.switchTab('byUser', this)">Per Kasir</button>
        <button class="tab" onclick="ReportsComponent.switchTab('fifo', this)">Stok FIFO</button>
      </div>

      <div id="reportContent"><p>Memuat laporan...</p></div>
    `;

    this.loadReports();
  },

  currentTab: 'profit',

  switchTab(tab, btn) {
    this.currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.loadReports();
  },

  async loadReports() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const container = document.getElementById('reportContent');
    container.innerHTML = '<p>Memuat...</p>';

    try {
      switch (this.currentTab) {
        case 'profit': await this.renderProfit(startDate, endDate, container); break;
        case 'sales': await this.renderSales(startDate, endDate, container); break;
        case 'byUser': await this.renderByUser(startDate, endDate, container); break;
        case 'fifo': await this.renderFifo(container); break;
      }
    } catch (err) {
      container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  },

  async renderProfit(startDate, endDate, container) {
    const res = await API.get(`/api/reports/profit?startDate=${startDate}&endDate=${endDate}`);
    const d = res.data;

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon blue">💰</div><div class="stat-info"><h4>${Format.currency(d.totalRevenue)}</h4><p>Total Omzet</p></div></div>
        <div class="stat-card"><div class="stat-icon yellow">📦</div><div class="stat-info"><h4>${Format.currency(d.totalCogs)}</h4><p>Total HPP</p></div></div>
        <div class="stat-card"><div class="stat-icon green">📈</div><div class="stat-info"><h4>${Format.currency(d.grossProfit)}</h4><p>Laba Kotor (${d.grossMarginPercent}%)</p></div></div>
        <div class="stat-card"><div class="stat-icon red">💸</div><div class="stat-info"><h4>${Format.currency(d.totalExpenses)}</h4><p>Total Pengeluaran</p></div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>📊 Laba Bersih</h3></div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-icon ${d.netProfit >= 0 ? 'green' : 'red'}">${d.netProfit >= 0 ? '📈' : '📉'}</div>
            <div class="stat-info"><h4>${Format.currency(d.netProfit)}</h4><p>Net Profit (${d.netMarginPercent}%)</p></div>
          </div>
        </div>
        <p style="color:var(--gray-500);font-size:13px">Periode: ${Format.date(d.period.startDate)} - ${Format.date(d.period.endDate)}</p>
      </div>
    `;
  },

  async renderSales(startDate, endDate, container) {
    const res = await API.get(`/api/reports/sales?startDate=${startDate}&endDate=${endDate}`);
    const d = res.data;

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon blue">💰</div><div class="stat-info"><h4>${Format.currency(d.totalOmzet)}</h4><p>Total Omzet</p></div></div>
        <div class="stat-card"><div class="stat-icon green">📃</div><div class="stat-info"><h4>${d.totalTransactions}</h4><p>Total Transaksi</p></div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Daftar Transaksi</h3></div>
        <div class="table-container">
          <table>
            <thead><tr><th>ID</th><th>Kasir</th><th>Role</th><th>Total</th><th>Metode</th><th>Waktu</th></tr></thead>
            <tbody>
              ${d.transactions.map(t => `<tr>
                <td>#${t.id}</td>
                <td>${t.cashier_name}</td>
                <td><span class="badge badge-info">${t.cashier_role}</span></td>
                <td>${Format.currency(t.total_amount)}</td>
                <td>${t.payment_method}</td>
                <td>${Format.datetime(t.transaction_date)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async renderByUser(startDate, endDate, container) {
    const res = await API.get(`/api/reports/sales/by-user?startDate=${startDate}&endDate=${endDate}`);
    const users = res.data;

    container.innerHTML = `
      <div class="card">
        <div class="card-header"><h3>👥 Penjualan per Kasir/Reseller</h3></div>
        <div class="table-container">
          <table>
            <thead><tr><th>Nama</th><th>Role</th><th>Jumlah Transaksi</th><th>Total Penjualan</th></tr></thead>
            <tbody>
              ${users.length === 0 ? '<tr><td colspan="4" class="empty-state">Tidak ada data.</td></tr>' :
                users.map(u => `<tr>
                  <td><strong>${u.name}</strong></td>
                  <td><span class="badge badge-info">${u.role}</span></td>
                  <td>${u.total_transactions}</td>
                  <td>${Format.currency(u.total_sales)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async renderFifo(container) {
    const res = await API.get('/api/reports/fifo');
    const batches = res.data;

    // Group by item_name
    const grouped = {};
    batches.forEach(b => {
      if (!grouped[b.item_name]) grouped[b.item_name] = [];
      grouped[b.item_name].push(b);
    });

    container.innerHTML = Object.entries(grouped).map(([item, batchList]) => `
      <div class="card">
        <div class="card-header"><h3>📦 ${item}</h3></div>
        <div class="table-container">
          <table>
            <thead><tr><th>Batch</th><th>Supplier</th><th>Tgl Masuk</th><th>Awal</th><th>Sisa</th><th>HPP/unit</th><th>Sisa %</th></tr></thead>
            <tbody>
              ${batchList.map(b => {
                const pct = parseFloat(b.initial_quantity) > 0 ? (parseFloat(b.remaining_quantity) / parseFloat(b.initial_quantity) * 100) : 0;
                const badge = pct < 20 ? 'badge-danger' : pct < 50 ? 'badge-warning' : 'badge-success';
                return `<tr>
                  <td>#${b.id}</td>
                  <td>${b.supplier_name || '-'}</td>
                  <td>${Format.date(b.received_date)}</td>
                  <td>${Format.number(b.initial_quantity)}</td>
                  <td>${Format.number(b.remaining_quantity)}</td>
                  <td>${Format.currency(b.base_cost_price)}</td>
                  <td><span class="badge ${badge}">${Format.percent(pct)}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');

    if (Object.keys(grouped).length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="icon">📦</div><p>Belum ada data batch.</p></div>';
    }
  }
};
