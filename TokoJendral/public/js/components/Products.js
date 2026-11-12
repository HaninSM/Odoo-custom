/**
 * Products component - manage master items and multi-unit retail variants.
 * Handles the "Single Setup" multi-unit builder (e.g. Item XXX with Sprei M, L, XL).
 */
const ProductsComponent = {
  groupedData: [],
  currentBaseHpp: 0,
  currentBaseStock: 0,
  currentBaseUnit: 'Meter',

  async render() {
    const content = document.getElementById('contentArea');
    document.getElementById('headerActions').innerHTML = `
      <button class="btn btn-primary" onclick="ProductsComponent.showMultiUnitSetup()">➕ Setup Produk & Multi-Satuan</button>
      <button class="btn btn-outline" style="border:1px solid #059669; color:#065f46; background:#ecfdf5; font-weight:600;" onclick="ProductsComponent.showBundleModal()">🧺 Tambah Paket Hampers</button>
      <button class="btn btn-secondary" onclick="ProductsComponent.showSingleForm()">➕ Tambah Satuan Tunggal</button>
    `;

    content.innerHTML = '<p>Memuat katalog produk & satuan...</p>';

    try {
      const res = await API.get('/api/products/grouped');
      this.groupedData = res.data;
      this.renderGroupedView();
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  },

  renderGroupedView(filter = '') {
    const content = document.getElementById('contentArea');
    const items = this.groupedData.filter(item => {
      if (!filter) return true;
      const q = filter.toLowerCase();
      const matchItem = item.name.toLowerCase().includes(q);
      const matchUnits = item.units.some(u => u.unitName.toLowerCase().includes(q));
      return matchItem || matchUnits;
    });

    if (items.length === 0) {
      content.innerHTML = `
        <div class="toolbar">
          <div class="search-box">
            <input type="text" id="prodSearch" placeholder="Cari nama barang atau satuan (mis: XXX, Sprei)..." oninput="ProductsComponent.filterList()">
          </div>
        </div>
        <div class="card" style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:12px">🎯</div>
          <h3>Belum ada produk atau satuan jual yang terdaftar</h3>
          <p style="color:var(--gray-500);margin-bottom:20px">Gunakan tombol di atas untuk mendefinisikan barang dan pecahan satuan jualnya, atau buat paket hampers bundling.</p>
          <div style="display:flex; justify-content:center; gap:10px;">
            <button class="btn btn-primary" onclick="ProductsComponent.showMultiUnitSetup()">➕ Setup Produk & Multi-Satuan Pertama</button>
            <button class="btn btn-outline" style="border:1px solid #059669; color:#065f46; background:#ecfdf5; font-weight:600;" onclick="ProductsComponent.showBundleModal()">🧺 Tambah Paket Hampers</button>
          </div>
        </div>`;
      return;
    }

    content.innerHTML = `
      <div class="toolbar">
        <div class="search-box">
          <input type="text" id="prodSearch" value="${filter}" placeholder="Cari nama barang atau satuan (mis: Kacamata, Paket Hampers)..." oninput="ProductsComponent.filterList()">
        </div>
      </div>
      <div id="itemsContainer">
        ${items.map(item => {
          const isBundle = item.category === 'bundle' || item.units.some(u => u.isBundle);
          const isAllocated = item.units.some(u => u.stockMode === 'allocated');
          return `
          <div class="card" style="border-left: 4px solid ${isBundle ? '#10b981' : 'var(--primary)'}; margin-bottom: 24px;">
            <div class="card-header" style="flex-wrap:wrap; gap:12px; align-items:center;">
              <div>
                <h3 style="display:inline-block; margin-right:8px; font-size:18px;">${isBundle ? '🧺' : '📦'} ${item.name}</h3>
                <span class="badge badge-info">Satuan Dasar: ${item.baseUnit}</span>
                <span class="badge badge-success" style="margin-left:4px;">Stok Gudang: ${Format.number(item.totalBaseStock, 1)} ${item.baseUnit}</span>
                <span class="badge badge-warning" style="margin-left:4px;">HPP Dasar: ${Format.currency(item.avgBaseHpp)} / ${item.baseUnit}</span>
                ${isBundle ? `
                  <span class="badge" style="background:#e0e7ff; color:#3730a3; border:1px solid #818cf8; margin-left:4px;">Paket Hampers (BOM)</span>
                ` : isAllocated ? `
                  <span class="badge" style="background:#fef3c7; color:#92400e; border:1px solid #f59e0b; margin-left:4px;">Physical Allocation (Repackaged)</span>
                ` : `
                  <span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #38bdf8; margin-left:4px;">Floating Pool</span>
                `}
              </div>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${!isBundle ? `
                  <button class="btn btn-sm btn-outline" style="border:1px solid #d97706; color:#b45309; background:#fffbeb; font-weight:600;" onclick="ProductsComponent.showRepackageModal(${item.id})">
                    📦 Repackage / Alokasi Stok
                  </button>
                  <button class="btn btn-sm btn-primary" onclick="ProductsComponent.showMultiUnitSetup('${item.name.replace(/'/g, "\\'")}', '${item.baseUnit}', ${item.id})">
                    ⚙️ Kelola / Tambah Satuan
                  </button>
                ` : `
                  <button class="btn btn-sm btn-outline" style="border:1px solid #059669; color:#065f46; background:#ecfdf5; font-weight:600;" onclick="ProductsComponent.showRecipeModal(${item.units[0]?.id}, '${item.name.replace(/'/g, "\\'")}')">
                    🔍 Resep Komponen
                  </button>
                `}
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Satuan Jual</th>
                    <th>Kebutuhan Bahan</th>
                    <th>HPP per Satuan</th>
                    <th>Metode Harga</th>
                    <th>Harga Jual</th>
                    <th>Estimasi Profit</th>
                    <th>Stok Siap Jual</th>
                    <th>Reseller</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${item.units.length === 0 ? `
                    <tr><td colspan="9" class="empty-state" style="padding:16px;">Belum ada satuan jual untuk barang ini. Klik "Kelola / Tambah Satuan" untuk menambahkan.</td></tr>
                  ` : item.units.map(u => {
                    const profitNominal = u.sellingPrice - u.unitHpp;
                    const profitPercent = u.unitHpp > 0 ? ((profitNominal / u.unitHpp) * 100).toFixed(1) : 0;
                    return `
                      <tr>
                        <td><strong>${u.unitName}</strong></td>
                        <td>${Format.number(u.conversionFactor)} ${item.baseUnit}</td>
                        <td style="color:var(--gray-600)">${Format.currency(u.unitHpp)}</td>
                        <td>
                          <span class="badge ${u.pricingMethod === 'percentage_margin' ? 'badge-warning' : 'badge-info'}">
                            ${u.pricingMethod === 'percentage_margin' ? `Margin +${u.marginPercentage}%` : 'Manual'}
                          </span>
                        </td>
                        <td><strong style="color:var(--primary); font-size:15px;">${Format.currency(u.sellingPrice)}</strong></td>
                        <td>
                          <span style="color:${profitNominal >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight:600;">
                            ${Format.currency(profitNominal)} (+${profitPercent}%)
                          </span>
                        </td>
                        <td>
                          ${u.isBundle ? `
                            <span class="badge badge-info" style="font-weight:600;">🧺 ${Format.number(u.available, 0)} ${u.unitName}</span>
                          ` : u.stockMode === 'allocated' ? `
                            <span class="badge badge-warning" title="Alokasi Fisik (Repackage)" style="font-weight:600;">📦 Alokasi: ${Format.number(u.available, 0)} ${u.unitName}</span>
                          ` : `
                            <span class="badge badge-success" title="Floating Pool (Konversi Otomatis)">🌊 ${Format.number(u.available, 0)} ${u.unitName}</span>
                          `}
                        </td>
                        <td>${u.resellerVisible ? '✅' : '❌'}</td>
                        <td>
                          <button class="btn btn-sm btn-warning" onclick="ProductsComponent.editPrice(${u.id})">💰</button>
                          <button class="btn btn-sm btn-danger" onclick="ProductsComponent.remove(${u.id})">🗑️</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        }).join('')}
      </div>
    `;
  },

  filterList() {
    const q = document.getElementById('prodSearch').value;
    this.renderGroupedView(q);
  },

  /**
   * Challenge: One-time setup modal for Item (e.g. XXX) with multiple units (Sprei M, L, XL)
   */
  async showMultiUnitSetup(prefillName = '', prefillBaseUnit = 'Meter', prefillItemId = null) {
    let itemsList = [];
    try {
      const res = await API.get('/api/items');
      itemsList = res.data;
      this.masterItemsList = itemsList;
    } catch (e) { /* ignore */ }

    const isEdit = !!prefillName;
    this.currentBaseUnit = prefillBaseUnit || 'Meter';

    const body = `
      <form id="multiUnitForm">
        <div style="background:var(--gray-50); border:1px solid var(--gray-200); border-radius:var(--radius); padding:16px; margin-bottom:20px;">
          <h4 style="margin-bottom:12px; color:var(--primary);">1️⃣ Identitas Barang Master</h4>
          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:12px;">
            <div class="form-group" style="margin-bottom:0">
              <label>Nama Barang Master</label>
              ${isEdit ? `
                <input type="text" id="muItemName" value="${prefillName}" readonly style="background:var(--gray-100); font-weight:600;">
                <input type="hidden" id="muItemId" value="${prefillItemId || ''}">
              ` : `
                <input type="text" id="muItemName" list="masterItemsList" placeholder="Ketik atau pilih nama barang (misal: XXX)" required oninput="ProductsComponent.onItemNameChange()">
                <datalist id="masterItemsList">
                  ${itemsList.map(it => `<option value="${it.name}">${it.name} (${it.base_unit})</option>`).join('')}
                </datalist>
                <input type="hidden" id="muItemId" value="">
              `}
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label>Satuan Dasar Perhitungan Stok</label>
              <input type="text" id="muBaseUnit" value="${this.currentBaseUnit}" required placeholder="Meter" oninput="ProductsComponent.onBaseUnitChange()">
            </div>
          </div>

          <div id="muLiveHppBox" style="margin-top:12px; padding:10px 14px; border-radius:6px; background:#eff6ff; border:1px solid #bfdbfe; font-size:13px; color:#1e40af;">
            🔍 Memeriksa stok & HPP gudang...
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 style="color:var(--primary); margin:0;">2️⃣ Daftar Satuan Jual / Ukuran Potongan</h4>
            <button type="button" class="btn btn-sm btn-secondary" onclick="ProductsComponent.addUnitRow()">➕ Tambah Satuan Jual</button>
          </div>
          <p style="font-size:12px; color:var(--gray-500); margin-bottom:12px;">
            Tentukan ukuran pecahan eceran anda (misal: satuan jual 1 Sprei M butuh 2.0 Satuan Dasar Perhitungan Stok (sebagai contoh : meter) dan  Sprei L butuh 2.5 Satuan Dasar Perhitungan Stok (sebagai contoh : meter). Sistem akan menghitung HPP otomatis berdasarkan harga modal per meter di gudang.
          </p>

          <div id="muUnitsTableContainer" style="overflow-x:auto;">
            <table style="width:100%; min-width:700px; font-size:13px;">
              <thead>
                <tr>
                  <th style="width:180px;">Nama Satuan Jual</th>
                  <th style="width:130px;">Kebutuhan (<span class="lblBaseUnit">${this.currentBaseUnit}</span>)</th>
                  <th style="width:140px;">Metode Harga</th>
                  <th style="width:110px;">Nilai / Margin</th>
                  <th style="width:150px;">Harga Jual Akhir</th>
                  <th style="width:60px;">Reseller</th>
                  <th style="width:40px;"></th>
                </tr>
              </thead>
              <tbody id="muUnitsTableBody">
                <!-- Unit rows inserted here -->
              </tbody>
            </table>
          </div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-success" onclick="ProductsComponent.submitMultiUnitSetup()">💾 Simpan Setup Sekaligus</button>
    `;

    App.showModal('Setup Produk & Multi-Satuan', body, footer, 'modal-lg');

    this.unitRowIndex = 0;
    const tbody = document.getElementById('muUnitsTableBody');
    if (tbody) tbody.innerHTML = '';

    // Load initial item base HPP
    if (prefillName) {
      await this.checkItemBaseHpp(prefillName);
      // Pre-load existing units for this item if available
      const itemData = this.groupedData.find(i => i.name.toLowerCase() === prefillName.toLowerCase());
      if (itemData && itemData.units.length > 0) {
        itemData.units.forEach(u => {
          this.addUnitRow({
            unitName: u.unitName,
            conversionFactor: u.conversionFactor,
            pricingMethod: u.pricingMethod,
            marginPercentage: u.marginPercentage,
            sellingPrice: u.sellingPrice,
            resellerVisible: u.resellerVisible
          });
        });
      } else {
        this.addUnitRow(); // start with 1 fresh empty row
      }
    } else {
      await this.checkItemBaseHpp('');
      this.addUnitRow(); // start with 1 fresh empty row
    }
  },

  unitRowIndex: 0,
  addUnitRow(initial = {}) {
    const tbody = document.getElementById('muUnitsTableBody');
    if (!tbody) return;

    const idx = this.unitRowIndex++;
    const tr = document.createElement('tr');
    tr.id = `unitRow_${idx}`;

    const unitName = initial.unitName || '';
    const conv = initial.conversionFactor !== undefined ? initial.conversionFactor : 1;
    const method = initial.pricingMethod || 'manual';
    const margin = initial.marginPercentage !== undefined && initial.marginPercentage !== null ? initial.marginPercentage : 30;
    const price = initial.sellingPrice || '';
    const reseller = initial.resellerVisible !== undefined ? initial.resellerVisible : true;

    tr.innerHTML = `
      <td>
        <input type="text" id="uName_${idx}" value="${unitName}" placeholder="Misal: Sprei M" required style="padding:6px 10px;">
      </td>
      <td>
        <input type="number" id="uConv_${idx}" value="${conv}" step="0.01" min="0.01" required style="padding:6px 10px;" oninput="ProductsComponent.recalcRow(${idx})">
      </td>
      <td>
        <select id="uMethod_${idx}" onchange="ProductsComponent.onMethodChange(${idx})" style="padding:6px 10px;">
          <option value="manual" ${method === 'manual' ? 'selected' : ''}>Manual (Rp)</option>
          <option value="percentage_margin" ${method === 'percentage_margin' ? 'selected' : ''}>% Margin Profit</option>
        </select>
      </td>
      <td>
        <div id="uMarginWrap_${idx}" style="${method === 'percentage_margin' ? '' : 'display:none;'}">
          <input type="number" id="uMargin_${idx}" value="${margin}" step="0.5" placeholder="30" style="padding:6px 10px;" oninput="ProductsComponent.recalcRow(${idx})">
        </div>
        <div id="uManualWrap_${idx}" style="${method === 'manual' ? '' : 'display:none;'}">
          <span style="font-size:11px; color:var(--gray-500);">-</span>
        </div>
      </td>
      <td>
        <input type="number" id="uPrice_${idx}" value="${price}" step="100" min="0" placeholder="Harga Jual" required style="padding:6px 10px; font-weight:600;" oninput="ProductsComponent.recalcRow(${idx})">
        <div id="uPreview_${idx}" style="font-size:11px; margin-top:3px; color:var(--gray-500);"></div>
      </td>
      <td style="text-align:center;">
        <input type="checkbox" id="uReseller_${idx}" ${reseller ? 'checked' : ''} style="width:auto; cursor:pointer;">
      </td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-sm btn-danger" onclick="ProductsComponent.removeUnitRow(${idx})" title="Hapus Satuan">&times;</button>
      </td>
    `;

    tbody.appendChild(tr);
    this.recalcRow(idx);
  },

  removeUnitRow(idx) {
    const tr = document.getElementById(`unitRow_${idx}`);
    if (tr) tr.remove();
  },

  onMethodChange(idx) {
    const method = document.getElementById(`uMethod_${idx}`).value;
    const marginWrap = document.getElementById(`uMarginWrap_${idx}`);
    const manualWrap = document.getElementById(`uManualWrap_${idx}`);

    if (method === 'percentage_margin') {
      marginWrap.style.display = 'block';
      manualWrap.style.display = 'none';
    } else {
      marginWrap.style.display = 'none';
      manualWrap.style.display = 'block';
    }
    this.recalcRow(idx);
  },

  async onItemNameChange() {
    const name = document.getElementById('muItemName')?.value.trim();
    if (!name) {
      await this.checkItemBaseHpp('');
      return;
    }

    const matchItem = this.masterItemsList?.find(it => it.name.toLowerCase() === name.toLowerCase());
    if (matchItem) {
      const baseUnitInput = document.getElementById('muBaseUnit');
      if (baseUnitInput) {
        baseUnitInput.value = matchItem.base_unit;
        this.onBaseUnitChange();
      }
      const idEl = document.getElementById('muItemId');
      if (idEl) idEl.value = matchItem.id;
      await this.checkItemBaseHpp(matchItem.name);

      // Reset unit rows to match this item's registered units or 1 clean row
      const tbody = document.getElementById('muUnitsTableBody');
      if (tbody) tbody.innerHTML = '';
      this.unitRowIndex = 0;

      const itemData = this.groupedData.find(i => i.id === matchItem.id || i.name.toLowerCase() === matchItem.name.toLowerCase());
      if (itemData && itemData.units.length > 0) {
        itemData.units.forEach(u => {
          this.addUnitRow({
            unitName: u.unitName,
            conversionFactor: u.conversionFactor,
            pricingMethod: u.pricingMethod,
            marginPercentage: u.marginPercentage,
            sellingPrice: u.sellingPrice,
            resellerVisible: u.resellerVisible
          });
        });
      } else {
        this.addUnitRow();
      }
    } else {
      const idEl = document.getElementById('muItemId');
      if (idEl) idEl.value = '';
      await this.checkItemBaseHpp(name);
      for (let i = 0; i < this.unitRowIndex; i++) {
        if (document.getElementById(`unitRow_${i}`)) {
          this.recalcRow(i);
        }
      }
    }
  },

  onBaseUnitChange() {
    const unit = document.getElementById('muBaseUnit')?.value.trim() || 'Meter';
    this.currentBaseUnit = unit;
    document.querySelectorAll('.lblBaseUnit').forEach(el => el.textContent = unit);
    const itemName = document.getElementById('muItemName')?.value.trim();
    if (itemName) {
      this.checkItemBaseHpp(itemName);
    }
  },

  async checkItemBaseHpp(itemName) {
    const box = document.getElementById('muLiveHppBox');
    if (!box) return;

    if (!itemName) {
      this.currentBaseHpp = 0;
      this.currentBaseStock = 0;
      box.innerHTML = `ℹ️ Masukkan nama barang untuk mendeteksi HPP & stok gudang.`;
      box.style.background = '#f3f4f6';
      box.style.borderColor = '#d1d5db';
      box.style.color = '#4b5563';
      return;
    }

    try {
      const res = await API.get(`/api/products/item-base-cost?itemName=${encodeURIComponent(itemName)}`);
      const { avgBaseCost, totalRemainingStock } = res.data;
      this.currentBaseHpp = avgBaseCost;
      this.currentBaseStock = totalRemainingStock;
      const baseUnit = document.getElementById('muBaseUnit')?.value || 'Meter';

      if (totalRemainingStock > 0) {
        box.innerHTML = `
          📦 <strong>Terdeteksi di Gudang:</strong> ${Format.number(totalRemainingStock)} ${baseUnit} | 
          <strong>Rata-rata HPP Dasar:</strong> <span style="font-weight:700; color:#1e40af;">${Format.currency(avgBaseCost)} / ${baseUnit}</span>
        `;
        box.style.background = '#eff6ff';
        box.style.borderColor = '#bfdbfe';
        box.style.color = '#1e40af';
      } else {
        box.innerHTML = `
          ⚠️ <strong>Belum ada stok masuk untuk barang "${itemName}".</strong> HPP Dasar = Rp 0. Anda tetap dapat mendaftarkan satuan jual dan harga jualnya.
        `;
        box.style.background = '#fef3c7';
        box.style.borderColor = '#fde68a';
        box.style.color = '#92400e';
      }
    } catch (e) {
      box.innerHTML = `⚠️ Gagal memeriksa HPP dasar: ${e.message}`;
    }
  },

  recalcRow(idx) {
    const convInput = document.getElementById(`uConv_${idx}`);
    const methodSelect = document.getElementById(`uMethod_${idx}`);
    const marginInput = document.getElementById(`uMargin_${idx}`);
    const priceInput = document.getElementById(`uPrice_${idx}`);
    const previewDiv = document.getElementById(`uPreview_${idx}`);

    if (!convInput || !methodSelect || !priceInput || !previewDiv) return;

    const conv = parseFloat(convInput.value) || 0;
    const method = methodSelect.value;
    const baseHpp = this.currentBaseHpp;
    const unitHpp = Math.round(baseHpp * conv);

    if (method === 'percentage_margin') {
      const margin = parseFloat(marginInput?.value) || 0;
      const autoPrice = unitHpp > 0 ? Math.round(unitHpp * (1 + margin / 100)) : 0;

      // Auto update selling price input if method is margin and baseHpp is known
      if (unitHpp > 0) {
        priceInput.value = autoPrice;
      }

      const finalPrice = parseFloat(priceInput.value) || 0;
      const profit = finalPrice - unitHpp;
      previewDiv.innerHTML = `
        <span style="color:var(--gray-600)">HPP: ${Format.currency(unitHpp)}</span> | 
        <span style="color:var(--success); font-weight:600">Laba: ${Format.currency(profit)}</span>
      `;
    } else {
      // Manual
      const finalPrice = parseFloat(priceInput.value) || 0;
      const profit = unitHpp > 0 ? finalPrice - unitHpp : 0;
      const pct = unitHpp > 0 ? ((profit / unitHpp) * 100).toFixed(1) : 0;

      if (unitHpp > 0) {
        previewDiv.innerHTML = `
          <span style="color:var(--gray-600)">HPP: ${Format.currency(unitHpp)}</span> | 
          <span style="color:${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight:600">Profit: ${Format.currency(profit)} (${pct}%)</span>
        `;
      } else {
        previewDiv.innerHTML = `<span style="color:var(--gray-500)">Harga manual</span>`;
      }
    }
  },

  async submitMultiUnitSetup() {
    const itemName = document.getElementById('muItemName')?.value.trim();
    const baseUnit = document.getElementById('muBaseUnit')?.value.trim() || 'Meter';
    const itemIdVal = document.getElementById('muItemId')?.value;
    const itemId = itemIdVal ? parseInt(itemIdVal) : null;

    if (!itemName) {
      App.toast('Nama barang master wajib diisi!', 'error');
      return;
    }

    const units = [];
    const tbody = document.getElementById('muUnitsTableBody');
    const rows = tbody.querySelectorAll('tr');

    if (rows.length === 0) {
      App.toast('Tambahkan minimal 1 satuan jual!', 'error');
      return;
    }

    for (const row of rows) {
      const idx = row.id.split('_')[1];
      const unitName = document.getElementById(`uName_${idx}`)?.value.trim();
      const conv = parseFloat(document.getElementById(`uConv_${idx}`)?.value);
      const method = document.getElementById(`uMethod_${idx}`)?.value;
      const margin = parseFloat(document.getElementById(`uMargin_${idx}`)?.value);
      const price = parseFloat(document.getElementById(`uPrice_${idx}`)?.value);
      const reseller = document.getElementById(`uReseller_${idx}`)?.checked;

      if (!unitName || isNaN(conv) || conv <= 0) {
        App.toast('Mohon lengkapi nama satuan dan kebutuhan bahan dengan benar!', 'error');
        return;
      }

      units.push({
        unitName,
        conversionFactor: conv,
        pricingMethod: method,
        marginPercentage: method === 'percentage_margin' ? margin : null,
        sellingPrice: price || 0,
        resellerVisible: reseller
      });
    }

    try {
      const res = await API.post('/api/products/batch-setup', {
        itemId,
        itemName,
        baseUnit,
        units
      });

      App.toast(res.message || 'Berhasil menyimpan setup multi-satuan!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  // Legacy single unit form
  async showSingleForm() {
    const body = `
      <form id="singleProductForm">
        <div class="form-group"><label>Nama Barang Master</label><input type="text" id="sfItemName" required placeholder="Mis: Kain Katun"></div>
        <div class="form-group"><label>Nama Satuan Jual</label><input type="text" id="sfUnitName" required placeholder="Mis: Sprei M, 1/2 Roll, Kodi"></div>
        <div class="form-group"><label>Kebutuhan Bahan / Konversi ke Satuan Dasar</label><input type="number" id="sfConvFactor" step="0.0001" min="0.0001" required placeholder="Mis: 2.5 (meter)"></div>
        <div class="form-group"><label>Metode Harga</label>
          <select id="sfPricingMethod" onchange="ProductsComponent.toggleSingleMargin()">
            <option value="manual">Manual</option>
            <option value="percentage_margin">Persentase Margin</option>
          </select>
        </div>
        <div class="form-group" id="sfMarginField" style="display:none"><label>Margin (%)</label><input type="number" id="sfMargin" step="0.01" placeholder="Mis: 30"></div>
        <div class="form-group"><label>Harga Jual</label><input type="number" id="sfSellingPrice" step="1" min="1" required placeholder="Harga jual per satuan"></div>
        <div class="form-group"><label><input type="checkbox" id="sfResellerVisible" checked> Tampilkan untuk Reseller</label></div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="ProductsComponent.submitSingleProduct()">Simpan</button>`;

    App.showModal('Tambah Satuan Tunggal', body, footer);
  },

  toggleSingleMargin() {
    const method = document.getElementById('sfPricingMethod').value;
    document.getElementById('sfMarginField').style.display = method === 'percentage_margin' ? 'block' : 'none';
  },

  async submitSingleProduct() {
    try {
      await API.post('/api/products', {
        itemName: document.getElementById('sfItemName').value,
        unitName: document.getElementById('sfUnitName').value,
        conversionFactor: parseFloat(document.getElementById('sfConvFactor').value),
        pricingMethod: document.getElementById('sfPricingMethod').value,
        marginPercentage: parseFloat(document.getElementById('sfMargin')?.value) || null,
        sellingPrice: parseFloat(document.getElementById('sfSellingPrice').value),
        resellerVisible: document.getElementById('sfResellerVisible').checked
      });
      App.toast('Satuan produk berhasil ditambahkan!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  async editPrice(id) {
    let hppInfo = '';
    try {
      const res = await API.get(`/api/products/${id}/hpp`);
      hppInfo = `<div class="alert alert-info">HPP saat ini: ${Format.currency(res.data.hpp)} (Avg base cost: ${Format.currency(res.data.avgBaseCost)} x conv factor: ${res.data.conversionFactor})</div>`;
    } catch (e) {
      hppInfo = '<div class="alert alert-warning">Tidak dapat menghitung HPP (belum ada stok).</div>';
    }

    const body = `
      ${hppInfo}
      <div class="form-group"><label>Metode Harga</label>
        <select id="epMethod" onchange="ProductsComponent.toggleEditMargin()">
          <option value="manual">Manual</option>
          <option value="percentage_margin">Persentase Margin</option>
        </select>
      </div>
      <div class="form-group" id="epMarginField" style="display:none"><label>Margin (%)</label><input type="number" id="epMargin" step="0.01" placeholder="30"></div>
      <div class="form-group"><label>Harga Jual Baru</label><input type="number" id="epPrice" step="1" min="1" required></div>`;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="ProductsComponent.submitPrice(${id})">Update Harga</button>`;

    App.showModal('Update Harga', body, footer);
  },

  toggleEditMargin() {
    const method = document.getElementById('epMethod').value;
    document.getElementById('epMarginField').style.display = method === 'percentage_margin' ? 'block' : 'none';
  },

  async submitPrice(id) {
    try {
      await API.put(`/api/products/${id}/price`, {
        pricingMethod: document.getElementById('epMethod').value,
        marginPercentage: parseFloat(document.getElementById('epMargin')?.value) || null,
        sellingPrice: parseFloat(document.getElementById('epPrice').value)
      });
      App.toast('Harga berhasil diupdate!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  async remove(id) {
    if (!await App.confirm('Hapus satuan produk ini?')) return;
    try {
      await API.delete(`/api/products/${id}`);
      App.toast('Satuan produk berhasil dinonaktifkan!');
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  /**
   * TIPE 1: REPACKAGE / PHYSICAL ALLOCATION MODAL
   */
  showRepackageModal(itemId) {
    const item = this.groupedData.find(i => i.id === itemId);
    if (!item) return App.toast('Data barang tidak ditemukan.', 'error');

    const totalStock = parseFloat(item.totalBaseStock) || 0;
    const baseUnit = item.baseUnit;

    const body = `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          <strong>💡 Konsep Alokasi Fisik (Repackage):</strong><br>
          Bagi stok gudang Anda ke dalam kemasan fisik siap jual (misal: Box, Lusin, PCS).
          Sistem akan menjaga agar total kuota kemasan tidak melebihi total stok fisik gudang Anda.
        </p>
      </div>

      <!-- Realtime Calculation Status Bar -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px;">
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #1e40af; font-weight: 600;">TOTAL STOK GUDANG</div>
          <div style="font-size: 18px; font-weight: 700; color: #1e3a8a;" id="rpTotalStock">${Format.number(totalStock, 1)} ${baseUnit}</div>
        </div>
        <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #854d0e; font-weight: 600;">TOTAL TERALOKASI</div>
          <div style="font-size: 18px; font-weight: 700; color: #713f12;" id="rpTotalAllocated">0 ${baseUnit}</div>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; text-align: center;" id="rpRemBox">
          <div style="font-size: 11px; color: #166534; font-weight: 600;">SISA BELUM DIALOKASI</div>
          <div style="font-size: 18px; font-weight: 700; color: #14532d;" id="rpRemaining">${Format.number(totalStock, 1)} ${baseUnit}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #475569; font-weight: 600;">STATUS VALIDASI</div>
          <div style="margin-top: 4px;" id="rpStatusBadge"><span class="badge badge-success">Valid</span></div>
        </div>
      </div>

      <div id="rpOverAlert" class="alert alert-danger" style="display:none; margin-bottom: 14px; font-weight: 600;">
        ⚠️ Total kuota alokasi melebihi kapasitas stok gudang! Harap kurangi kuota sebelum menyimpan.
      </div>

      <div class="table-container" style="margin-bottom: 16px;">
        <table>
          <thead>
            <tr>
              <th>Satuan Jual</th>
              <th>Konversi</th>
              <th>Harga Jual</th>
              <th>Stok Gudang Otomatis</th>
              <th style="min-width: 140px;">Kuota Alokasi Fisik</th>
              <th>Bahan Terpakai</th>
            </tr>
          </thead>
          <tbody>
            ${item.units.map(u => {
              const currentVal = u.stockMode === 'allocated' ? u.allocatedStock : 0;
              return `
                <tr>
                  <td><strong>${u.unitName}</strong></td>
                  <td>1 ${u.unitName} = ${Format.number(u.conversionFactor)} ${baseUnit}</td>
                  <td>${Format.currency(u.sellingPrice)}</td>
                  <td style="color:var(--gray-500);">${Format.number(Math.floor(totalStock / u.conversionFactor), 0)} ${u.unitName}</td>
                  <td>
                    <input type="number"
                      class="rp-quota-input"
                      data-unit-id="${u.id}"
                      data-unit-name="${u.unitName}"
                      data-factor="${u.conversionFactor}"
                      value="${currentVal}"
                      min="0"
                      step="1"
                      style="width: 100%; padding: 6px 10px; font-size: 14px; font-weight: 600; text-align: right;"
                      oninput="ProductsComponent.recalcRepackage(${totalStock}, '${baseUnit}')">
                  </td>
                  <td style="font-weight: 600; color: #475569;">
                    <span id="rpSubtotal_${u.id}">0</span> ${baseUnit}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
        <button type="button" class="btn btn-sm btn-outline" style="border: 1px solid var(--primary); color: var(--primary);" onclick="ProductsComponent.autoAllocateRemaining(${totalStock}, '${baseUnit}')">
          ⚡ Alokasikan Sisa ke Satuan Terkecil / Eceran
        </button>
      </div>
    `;

    const footer = `
      <button class="btn btn-outline" style="border: 1px solid #ef4444; color: #b91c1c; margin-right: auto;" onclick="ProductsComponent.resetFloating(${item.id}, '${item.name.replace(/'/g, "\\'")}')">
        🌊 Reset ke Floating Pool
      </button>
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" id="btnSaveRepackage" onclick="ProductsComponent.submitRepackage(${item.id}, '${item.name.replace(/'/g, "\\'")}')">
        💾 Simpan Alokasi Stok
      </button>
    `;

    App.showModal(`📦 Repackage / Alokasi Stok - ${item.name}`, body, footer, 'modal-lg');
    this.recalcRepackage(totalStock, baseUnit);
  },

  recalcRepackage(totalStock, baseUnit) {
    const inputs = document.querySelectorAll('.rp-quota-input');
    let totalAllocated = 0;

    inputs.forEach(inp => {
      const quota = parseFloat(inp.value) || 0;
      const factor = parseFloat(inp.dataset.factor) || 1;
      const subtotal = quota * factor;
      totalAllocated += subtotal;

      const subSpan = document.getElementById(`rpSubtotal_${inp.dataset.unitId}`);
      if (subSpan) subSpan.textContent = Format.number(subtotal, 1);
    });

    const remaining = totalStock - totalAllocated;
    const isOver = remaining < -0.0001;

    const allocEl = document.getElementById('rpTotalAllocated');
    const remEl = document.getElementById('rpRemaining');
    const badgeEl = document.getElementById('rpStatusBadge');
    const alertEl = document.getElementById('rpOverAlert');
    const saveBtn = document.getElementById('btnSaveRepackage');

    if (allocEl) allocEl.textContent = `${Format.number(totalAllocated, 1)} ${baseUnit}`;
    if (remEl) {
      remEl.textContent = `${Format.number(remaining, 1)} ${baseUnit}`;
      remEl.style.color = isOver ? '#b91c1c' : '#14532d';
    }

    if (isOver) {
      if (badgeEl) badgeEl.innerHTML = '<span class="badge badge-danger">Melebihi Stok</span>';
      if (alertEl) alertEl.style.display = 'block';
      if (saveBtn) saveBtn.disabled = true;
    } else {
      if (badgeEl) badgeEl.innerHTML = '<span class="badge badge-success">Valid</span>';
      if (alertEl) alertEl.style.display = 'none';
      if (saveBtn) saveBtn.disabled = false;
    }
  },

  autoAllocateRemaining(totalStock, baseUnit) {
    const inputs = Array.from(document.querySelectorAll('.rp-quota-input'));
    if (inputs.length === 0) return;

    // Sort to find smallest conversion factor
    inputs.sort((a, b) => parseFloat(a.dataset.factor) - parseFloat(b.dataset.factor));
    const smallestInput = inputs[0];
    const smallestFactor = parseFloat(smallestInput.dataset.factor) || 1;

    let otherAllocated = 0;
    for (let i = 1; i < inputs.length; i++) {
      const q = parseFloat(inputs[i].value) || 0;
      const f = parseFloat(inputs[i].dataset.factor) || 1;
      otherAllocated += q * f;
    }

    const freeBase = Math.max(0, totalStock - otherAllocated);
    const autoQuota = Math.floor(freeBase / smallestFactor);
    smallestInput.value = autoQuota;

    this.recalcRepackage(totalStock, baseUnit);
  },

  async submitRepackage(itemId, itemName) {
    const inputs = Array.from(document.querySelectorAll('.rp-quota-input'));
    const allocations = inputs.map(i => ({
      productUnitId: parseInt(i.dataset.unitId),
      allocatedStock: parseFloat(i.value) || 0
    }));

    try {
      const res = await API.post('/api/products/repackage', { itemId, itemName, allocations });
      App.toast(res.message || 'Alokasi stok berhasil disimpan!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  async resetFloating(itemId, itemName) {
    if (!await App.confirm(`Kembalikan stok "${itemName}" ke mode Floating Pool (konversi otomatis)? Alokasi kuota fisik saat ini akan dinonaktifkan.`)) {
      return;
    }

    try {
      const res = await API.post('/api/products/repackage/reset', { itemId, itemName });
      App.toast(res.message || 'Berhasil direset ke Floating Pool!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  /**
   * TIPE 2: COMPOSITE BUNDLE / HAMPERS MODAL
   */
  showBundleModal() {
    // Only master items that are not already bundles
    const availableItems = this.groupedData.filter(i => !i.units.some(u => u.isBundle));

    if (availableItems.length === 0) {
      return App.toast('Belum ada barang master untuk dijadikan komponen hampers. Buat master barang terlebih dahulu.', 'warning');
    }

    const body = `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          <strong>🧺 Konsep Paket Hampers / Bundling (Model B - On-Demand):</strong><br>
          Gabungkan beberapa barang menjadi satu paket siap jual (misal: 1.5kg Mangga + 1kg Apel + 1 Keranjang).
          Stok paket dihitung otomatis dari komponen yang paling sedikit (bottleneck). Saat checkout kasir, stok komponen dipotong otomatis dengan sistem FIFO dan kalkulasi HPP akurat.
        </p>
      </div>

      <div class="form-group">
        <label>Nama Paket Hampers / Bundle *</label>
        <input type="text" id="bdName" placeholder="Contoh: Paket Hampers Buah Segar Premium" required>
      </div>

      <div class="form-group">
        <label>Keterangan / Isi Paket</label>
        <textarea id="bdDesc" rows="2" placeholder="Contoh: Berisi Mangga Harum Manis, Apel Fuji, Anggur Red Globe, dan Keranjang Parcel"></textarea>
      </div>

      <div class="form-group">
        <label>Harga Jual Paket (Rp) *</label>
        <input type="number" id="bdPrice" min="1" step="100" placeholder="Contoh: 125000" oninput="ProductsComponent.recalcBundle()" required>
      </div>

      <div class="form-group">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" id="bdReseller" checked>
          <span>Tampilkan Paket ini di Portal Reseller</span>
        </label>
      </div>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4 style="margin: 0; font-size: 15px;">🥗 Komponen Bahan (Recipe / Bill of Materials)</h4>
        <button type="button" class="btn btn-sm btn-outline" style="border:1px solid var(--primary); color:var(--primary);" onclick="ProductsComponent.addBundleRow()">
          ➕ Tambah Komponen
        </button>
      </div>

      <div class="table-container" style="margin-bottom: 16px;">
        <table>
          <thead>
            <tr>
              <th>Pilih Barang Komponen</th>
              <th>Stok Gudang</th>
              <th>HPP Dasar</th>
              <th style="width: 140px;">Kebutuhan per Paket</th>
              <th>Subtotal HPP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="bundleRows">
            <!-- Dynamic rows inserted here -->
          </tbody>
        </table>
      </div>

      <!-- Realtime Bundle Calculator Status -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-top: 16px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #475569; font-weight: 600;">ESTIMASI HPP PAKET</div>
          <div style="font-size: 16px; font-weight: 700; color: #1e293b;" id="bdTotalHpp">Rp 0</div>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #166534; font-weight: 600;">ESTIMASI PROFIT</div>
          <div style="font-size: 16px; font-weight: 700; color: #14532d;" id="bdProfit">Rp 0 (0%)</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #1e40af; font-weight: 600;">KAPASITAS RAKIT SAAT INI</div>
          <div style="font-size: 16px; font-weight: 700; color: #1e3a8a;" id="bdBottleneck">0 Paket</div>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="ProductsComponent.submitBundle()">💾 Simpan Paket Hampers</button>
    `;

    App.showModal('🧺 Setup Paket Hampers / Bundling (Multi-Item)', body, footer, 'modal-lg');
    // Add two initial rows
    this.addBundleRow();
    this.addBundleRow();
  },

  addBundleRow() {
    const tbody = document.getElementById('bundleRows');
    if (!tbody) return;

    const availableItems = this.groupedData.filter(i => !i.units.some(u => u.isBundle));
    const rowIndex = Date.now() + Math.random().toString(36).substring(2, 6);

    const tr = document.createElement('tr');
    tr.id = `bdRow_${rowIndex}`;
    tr.innerHTML = `
      <td>
        <select class="bd-item-select" onchange="ProductsComponent.onBundleItemChange('${rowIndex}')" style="width:100%; padding:6px 10px;">
          <option value="">-- Pilih Barang --</option>
          ${availableItems.map(item => `
            <option value="${item.id}"
              data-stock="${item.totalBaseStock}"
              data-base-unit="${item.baseUnit}"
              data-hpp="${item.avgBaseHpp}">
              ${item.name} (${item.baseUnit})
            </option>
          `).join('')}
        </select>
      </td>
      <td id="bdStock_${rowIndex}" style="color:var(--gray-600);">-</td>
      <td id="bdHpp_${rowIndex}" style="color:var(--gray-600);">-</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px;">
          <input type="number" class="bd-qty-input" value="1" min="0.0001" step="0.1" style="width:80px; padding:6px 8px; text-align:right;" oninput="ProductsComponent.recalcBundle()">
          <span id="bdUnit_${rowIndex}" style="font-size:12px; color:var(--gray-500);">-</span>
        </div>
      </td>
      <td id="bdSubtotal_${rowIndex}" style="font-weight:600; color:var(--primary);">Rp 0</td>
      <td>
        <button type="button" class="btn btn-sm btn-danger" onclick="ProductsComponent.removeBundleRow(this)">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  },

  removeBundleRow(btn) {
    const tr = btn.closest('tr');
    if (tr) {
      tr.remove();
      this.recalcBundle();
    }
  },

  onBundleItemChange(rowIndex) {
    const tr = document.getElementById(`bdRow_${rowIndex}`);
    if (!tr) return;

    const select = tr.querySelector('.bd-item-select');
    const opt = select.selectedOptions[0];

    const stockEl = document.getElementById(`bdStock_${rowIndex}`);
    const hppEl = document.getElementById(`bdHpp_${rowIndex}`);
    const unitEl = document.getElementById(`bdUnit_${rowIndex}`);

    if (opt && opt.value) {
      const stock = parseFloat(opt.dataset.stock) || 0;
      const hpp = parseFloat(opt.dataset.hpp) || 0;
      const unit = opt.dataset.baseUnit;

      stockEl.textContent = `${Format.number(stock, 1)} ${unit}`;
      hppEl.textContent = Format.currency(hpp);
      unitEl.textContent = unit;
    } else {
      stockEl.textContent = '-';
      hppEl.textContent = '-';
      unitEl.textContent = '-';
    }

    this.recalcBundle();
  },

  recalcBundle() {
    const rows = document.querySelectorAll('#bundleRows tr');
    let totalBundleHpp = 0;
    let minBundles = Infinity;
    let hasItem = false;

    rows.forEach(tr => {
      const select = tr.querySelector('.bd-item-select');
      const qtyInput = tr.querySelector('.bd-qty-input');
      const subtotalEl = tr.querySelector('[id^="bdSubtotal_"]');

      const opt = select?.selectedOptions[0];
      if (opt && opt.value) {
        hasItem = true;
        const stock = parseFloat(opt.dataset.stock) || 0;
        const hpp = parseFloat(opt.dataset.hpp) || 0;
        const needed = parseFloat(qtyInput.value) || 0;

        const subtotal = hpp * needed;
        totalBundleHpp += subtotal;
        if (subtotalEl) subtotalEl.textContent = Format.currency(subtotal);

        const possible = needed > 0 ? Math.floor(stock / needed) : 0;
        if (possible < minBundles) {
          minBundles = possible;
        }
      }
    });

    const finalBottleneck = (!hasItem || minBundles === Infinity) ? 0 : minBundles;
    const price = parseFloat(document.getElementById('bdPrice')?.value) || 0;
    const profitNominal = price - totalBundleHpp;
    const profitPercent = totalBundleHpp > 0 ? ((profitNominal / totalBundleHpp) * 100).toFixed(1) : 0;

    const hppEl = document.getElementById('bdTotalHpp');
    const profitEl = document.getElementById('bdProfit');
    const bottleEl = document.getElementById('bdBottleneck');

    if (hppEl) hppEl.textContent = Format.currency(totalBundleHpp);
    if (profitEl) {
      profitEl.textContent = `${Format.currency(profitNominal)} (+${profitPercent}%)`;
      profitEl.style.color = profitNominal >= 0 ? '#14532d' : '#b91c1c';
    }
    if (bottleEl) {
      bottleEl.textContent = `${Format.number(finalBottleneck, 0)} Paket`;
      bottleEl.style.color = finalBottleneck > 0 ? '#1e3a8a' : '#b91c1c';
    }
  },

  async submitBundle() {
    const name = document.getElementById('bdName')?.value?.trim();
    const price = parseFloat(document.getElementById('bdPrice')?.value);
    const description = document.getElementById('bdDesc')?.value?.trim();
    const resellerVisible = document.getElementById('bdReseller')?.checked;

    if (!name) return App.toast('Nama paket hampers wajib diisi.', 'error');
    if (!price || price <= 0) return App.toast('Harga jual paket harus lebih besar dari 0.', 'error');

    const rows = document.querySelectorAll('#bundleRows tr');
    const components = [];

    rows.forEach(tr => {
      const select = tr.querySelector('.bd-item-select');
      const qtyInput = tr.querySelector('.bd-qty-input');
      const opt = select?.selectedOptions[0];

      if (opt && opt.value) {
        const qty = parseFloat(qtyInput.value) || 0;
        if (qty > 0) {
          components.push({
            itemId: parseInt(opt.value),
            quantityNeeded: qty
          });
        }
      }
    });

    if (components.length === 0) {
      return App.toast('Tambahkan minimal 1 komponen bahan untuk paket ini.', 'error');
    }

    try {
      const res = await API.post('/api/products/bundle', {
        name,
        sellingPrice: price,
        description,
        resellerVisible,
        components
      });
      App.toast(res.message || 'Paket bundling berhasil dibuat!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  /**
   * View recipe of a bundle
   */
  async showRecipeModal(bundleUnitId, bundleName) {
    try {
      const res = await API.get(`/api/products/bundle/${bundleUnitId}/recipe`);
      const recipe = res.data;

      const body = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 13px; color: #475569;">
            Daftar bahan baku penyusun untuk <strong>${bundleName}</strong>. Setiap pembelian 1 paket akan memotong bahan baku berikut secara otomatis dengan prinsip FIFO.
          </p>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Komponen Bahan</th>
                <th>Kebutuhan per Paket</th>
                <th>Satuan Dasar</th>
              </tr>
            </thead>
            <tbody>
              ${recipe.map(r => `
                <tr>
                  <td><strong>${r.component_item_name}</strong></td>
                  <td>${Format.number(r.quantity_needed, 2)}</td>
                  <td>${r.component_base_unit || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      const footer = `<button class="btn btn-primary" onclick="App.closeModal()">Tutup</button>`;
      App.showModal(`🔍 Resep Bahan - ${bundleName}`, body, footer);
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
