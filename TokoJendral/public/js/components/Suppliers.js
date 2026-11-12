/**
 * Suppliers component - CRUD for supplier management.
 */
const SuppliersComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    document.getElementById('headerActions').innerHTML = `
      <button class="btn btn-primary" onclick="SuppliersComponent.showForm()">➕ Tambah Supplier</button>`;

    content.innerHTML = '<p>Memuat supplier...</p>';

    try {
      const res = await API.get('/api/suppliers');
      const suppliers = res.data;

      content.innerHTML = `
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>ID</th><th>Nama</th><th>Telepon</th><th>Alamat</th><th>Aksi</th></tr></thead>
              <tbody>
                ${suppliers.length === 0 ? '<tr><td colspan="5" class="empty-state">Belum ada supplier.</td></tr>' :
                  suppliers.map(s => `<tr>
                    <td>#${s.id}</td>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.phone || '-'}</td>
                    <td>${s.address || '-'}</td>
                    <td>
                      <button class="btn btn-sm btn-warning" onclick='SuppliersComponent.showForm(${JSON.stringify(s)})'>✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="SuppliersComponent.remove(${s.id})">🗑️</button>
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

  showForm(supplier = null) {
    const isEdit = !!supplier;
    const body = `
      <form id="supplierForm">
        <div class="form-group"><label>Nama Supplier</label><input type="text" id="sfName" required value="${supplier?.name || ''}"></div>
        <div class="form-group"><label>Telepon</label><input type="text" id="sfPhone" value="${supplier?.phone || ''}"></div>
        <div class="form-group"><label>Alamat</label><textarea id="sfAddress">${supplier?.address || ''}</textarea></div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuppliersComponent.submit(${supplier?.id || 'null'})">${isEdit ? 'Update' : 'Simpan'}</button>`;

    App.showModal(isEdit ? 'Edit Supplier' : 'Tambah Supplier', body, footer);
  },

  async submit(id) {
    const data = {
      name: document.getElementById('sfName').value,
      phone: document.getElementById('sfPhone').value,
      address: document.getElementById('sfAddress').value
    };

    try {
      if (id) {
        await API.put(`/api/suppliers/${id}`, data);
        App.toast('Supplier berhasil diupdate!');
      } else {
        await API.post('/api/suppliers', data);
        App.toast('Supplier berhasil ditambahkan!');
      }
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  async remove(id) {
    if (!await App.confirm('Hapus supplier ini?')) return;
    try {
      await API.delete(`/api/suppliers/${id}`);
      App.toast('Supplier berhasil dihapus!');
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
