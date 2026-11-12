/**
 * Inventory component - shows FIFO stock levels per item and batch.
 */
const InventoryComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    content.innerHTML = '<p>Memuat stok...</p>';

    try {
      const res = await API.get('/api/products/stock');
      const stock = res.data;

      content.innerHTML = stock.length === 0
        ? '<div class="empty-state"><div class="icon">📦</div><p>Belum ada stok barang.</p></div>'
        : stock.map(item => `
          <div class="card">
            <div class="card-header">
              <h3>📦 ${item.itemName}</h3>
              <span>Total: <strong>${Format.number(item.totalBaseUnits)} unit dasar</strong></span>
            </div>

            <h4 style="margin-bottom:8px;font-size:13px;color:var(--gray-500)">BATCH FIFO</h4>
            <div class="table-container">
              <table>
                <thead><tr><th>Batch</th><th>Tgl Masuk</th><th>Awal</th><th>Sisa</th><th>HPP/unit</th><th>Sisa %</th></tr></thead>
                <tbody>
                  ${item.batches.map(b => {
                    const pct = parseFloat(b.stockPercentage);
                    const badge = pct < 20 ? 'badge-danger' : pct < 50 ? 'badge-warning' : 'badge-success';
                    return `<tr>
                      <td>#${b.id}</td>
                      <td>${Format.date(b.receivedDate)}</td>
                      <td>${Format.number(b.initialQuantity)}</td>
                      <td>${Format.number(b.remainingQuantity)}</td>
                      <td>${Format.currency(b.baseCostPrice)}</td>
                      <td><span class="badge ${badge}">${Format.percent(pct)}</span></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>

            ${item.productUnits.length > 0 ? `
              <h4 style="margin:16px 0 8px;font-size:13px;color:var(--gray-500)">SATUAN JUAL</h4>
              <div class="table-container">
                <table>
                  <thead><tr><th>Satuan</th><th>Faktor Konversi</th><th>Harga Jual</th><th>Stok Tersedia</th></tr></thead>
                  <tbody>
                    ${item.productUnits.map(pu => `<tr>
                      <td>${pu.unitName}</td>
                      <td>${Format.number(pu.conversionFactor)} unit dasar</td>
                      <td>${Format.currency(pu.sellingPrice)}</td>
                      <td>${Format.number(pu.available, 1)}</td>
                    </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        `).join('');
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  }
};
