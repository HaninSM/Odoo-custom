/**
 * Purchases component - manage inbound stock (restock) from suppliers.
 * Owner creates purchases which automatically generate FIFO inventory batches.
 * Integrated with Master Items (e.g. XXX with base unit Meter).
 */
const PurchasesComponent = {
  masterItems: [],

  async render() {
    const content = document.getElementById('contentArea');
    document.getElementById('headerActions').innerHTML = `
      <button class="btn btn-primary" onclick="PurchasesComponent.showForm()">➕ Pembelian Baru</button>`;

    content.innerHTML = '<p>Memuat data pembelian...</p>';

    try {
      const res = await API.get('/api/purchases');
      const purchases = res.data;

      content.innerHTML = `
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>ID</th><th>Supplier</th><th>Tanggal</th><th>Total Biaya</th><th>Dibuat oleh</th></tr></thead>
              <tbody>
                ${purchases.length === 0 ? '<tr><td colspan="5" class="empty-state">Belum ada pembelian tercatat.</td></tr>' :
                  purchases.map(p => `<tr>
                    <td><strong>#${p.id}</strong></td>
                    <td>${p.supplier_name}</td>
                    <td>${Format.date(p.purchase_date)}</td>
                    <td><strong style="color:var(--primary)">${Format.currency(p.total_cost)}</strong></td>
                    <td>${p.created_by}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  },

  async showForm() {
    let suppliers = [];
    try {
      const [suppRes, itemsRes] = await Promise.all([
        API.get('/api/suppliers'),
        API.get('/api/items')
      ]);
      suppliers = suppRes.data;
      this.masterItems = itemsRes.data || [];
    } catch (e) { /* ignore */ }

    if (suppliers.length === 0) {
      App.toast('Tambahkan supplier terlebih dahulu!', 'error');
      return;
    }

    const body = `
      <form id="purchaseForm">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group">
            <label>Supplier</label>
            <select id="pSupplierId" required>
              ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Tanggal Pembelian</label>
            <input type="date" id="pDate" value="${Format.localDate()}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Catatan</label>
          <textarea id="pNotes" placeholder="Catatan pembelian (opsional)" style="min-height:50px;"></textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin:16px 0 8px;">
          <h4 style="margin:0;">Item Barang yang Dibeli</h4>
          <button type="button" class="btn btn-secondary btn-sm" onclick="PurchasesComponent.addItemRow()">➕ Tambah Baris Item</button>
        </div>

        <datalist id="registeredItemsDatalist">
          ${this.masterItems.map(it => `<option value="${it.name}">${it.name} (Satuan Dasar: ${it.base_unit})</option>`).join('')}
        </datalist>

        <div id="purchaseItems"></div>

        <div style="margin-top:16px; padding:12px; background:var(--gray-50); border-radius:var(--radius); border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600;">Total Biaya Pembelian:</span>
          <span id="pTotalCostDisplay" style="font-size:18px; font-weight:700; color:var(--primary);">${Format.currency(0)}</span>
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="PurchasesComponent.submitPurchase()">Simpan Pembelian</button>`;

    App.showModal('Pembelian Baru / Restock', body, footer, 'modal-lg');
    this.itemIndex = 0;
    this.addItemRow();
  },

  itemIndex: 0,
  addItemRow() {
    const container = document.getElementById('purchaseItems');
    if (!container) return;

    const i = this.itemIndex++;
    const row = document.createElement('div');
    row.id = `pItemRow_${i}`;
    row.className = 'card';
    row.style.padding = '14px';
    row.style.marginBottom = '12px';
    row.style.background = 'var(--white)';
    row.style.border = '1px solid var(--gray-300)';

    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:var(--primary);">Item #${i + 1}</span>
        <button type="button" class="btn btn-sm btn-danger" onclick="PurchasesComponent.removeItemRow(${i})" style="padding:2px 8px;">✕ Hapus</button>
      </div>
      <div style="display:grid; grid-template-columns: 2fr 1fr 1.5fr 1.5fr; gap:10px;">
        <div class="form-group" style="margin-bottom:0">
          <label style="font-size:12px;">Nama Barang</label>
          <input type="text" id="piName_${i}" list="registeredItemsDatalist" required placeholder="Mis: XXX" oninput="PurchasesComponent.onItemNameTyped(${i})">
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label style="font-size:12px;">Jumlah Satuan Beli</label>
          <input type="number" id="piQty_${i}" step="0.01" min="0.01" required placeholder="Mis: 1 (Kodi)" oninput="PurchasesComponent.recalcTotal()">
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label style="font-size:12px;">Harga Beli per Satuan</label>
          <input type="number" id="piCost_${i}" step="100" min="1" required placeholder="Mis: 1200000" oninput="PurchasesComponent.recalcTotal()">
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label style="font-size:12px;">Konversi ke <span id="piUnitLbl_${i}">Meter</span></label>
          <input type="number" id="piConv_${i}" step="0.01" min="0.01" required placeholder="Mis: 60 (meter/kodi)" oninput="PurchasesComponent.recalcTotal()">
        </div>
      </div>
      <div id="piSubtotal_${i}" style="font-size:12px; margin-top:6px; color:var(--gray-600); text-align:right;"></div>
    `;

    container.appendChild(row);
    this.recalcTotal();
  },

  removeItemRow(i) {
    const row = document.getElementById(`pItemRow_${i}`);
    if (row) row.remove();
    this.recalcTotal();
  },

  onItemNameTyped(i) {
    const val = document.getElementById(`piName_${i}`)?.value.trim().toLowerCase();
    const match = this.masterItems.find(it => it.name.toLowerCase() === val);
    const unitLbl = document.getElementById(`piUnitLbl_${i}`);
    if (unitLbl) {
      unitLbl.textContent = match ? match.base_unit : 'Meter';
    }
  },

  recalcTotal() {
    let grandTotal = 0;
    const container = document.getElementById('purchaseItems');
    if (!container) return;

    const rows = container.querySelectorAll('[id^="pItemRow_"]');
    rows.forEach(row => {
      const idx = row.id.split('_')[1];
      const qty = parseFloat(document.getElementById(`piQty_${idx}`)?.value) || 0;
      const cost = parseFloat(document.getElementById(`piCost_${idx}`)?.value) || 0;
      const conv = parseFloat(document.getElementById(`piConv_${idx}`)?.value) || 0;
      const subtotal = qty * cost;
      grandTotal += subtotal;

      const subtotalDiv = document.getElementById(`piSubtotal_${idx}`);
      if (subtotalDiv && (qty > 0 || cost > 0)) {
        const totalBase = qty * conv;
        const hppPerBase = totalBase > 0 ? (subtotal / totalBase) : 0;
        const unitLbl = document.getElementById(`piUnitLbl_${idx}`)?.textContent || 'Meter';
        subtotalDiv.innerHTML = `Subtotal: <strong>${Format.currency(subtotal)}</strong> | Total: <strong>${Format.number(totalBase, 1)} ${unitLbl}</strong> | HPP Dasar: <strong>${Format.currency(hppPerBase)} / ${unitLbl}</strong>`;
      }
    });

    const display = document.getElementById('pTotalCostDisplay');
    if (display) display.textContent = Format.currency(grandTotal);
  },

  async submitPurchase() {
    const items = [];
    const container = document.getElementById('purchaseItems');
    const rows = container ? container.querySelectorAll('[id^="pItemRow_"]') : [];

    if (rows.length === 0) {
      App.toast('Tambahkan minimal 1 item pembelian!', 'error');
      return;
    }

    for (const row of rows) {
      const idx = row.id.split('_')[1];
      const name = document.getElementById(`piName_${idx}`)?.value.trim();
      const qty = parseFloat(document.getElementById(`piQty_${idx}`)?.value);
      const cost = parseFloat(document.getElementById(`piCost_${idx}`)?.value);
      const conv = parseFloat(document.getElementById(`piConv_${idx}`)?.value);

      if (!name || isNaN(qty) || qty <= 0 || isNaN(cost) || cost <= 0 || isNaN(conv) || conv <= 0) {
        App.toast('Mohon lengkapi semua baris item dengan nilai yang valid!', 'error');
        return;
      }

      items.push({
        itemName: name,
        quantity: qty,
        costPerUnit: cost,
        baseUnitConversion: conv
      });
    }

    try {
      const res = await API.post('/api/purchases', {
        supplierId: parseInt(document.getElementById('pSupplierId').value),
        purchaseDate: document.getElementById('pDate').value,
        notes: document.getElementById('pNotes').value,
        items
      });

      if (res && res.data && res.data.autoUpdatedPrices && res.data.autoUpdatedPrices.length > 0) {
        const count = res.data.autoUpdatedPrices.length;
        const details = res.data.autoUpdatedPrices.map(p => `${p.unitName}: ${Format.currency(p.newPrice)}`).join(', ');
        App.toast(`Pembelian berhasil! ${count} harga jual satuan (% margin) otomatis diperbarui: ${details}`);
      } else {
        App.toast('Pembelian berhasil dicatat dan stok masuk ke gudang!');
      }
      App.closeModal();
      this.itemIndex = 0;
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
