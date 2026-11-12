/**
 * Users component - manage system users (owner only).
 */
const UsersComponent = {
  async render() {
    const content = document.getElementById('contentArea');
    document.getElementById('headerActions').innerHTML = `
      <button class="btn btn-primary" onclick="UsersComponent.showForm()">➕ Tambah User</button>`;

    content.innerHTML = '<p>Memuat user...</p>';

    try {
      const res = await API.get('/api/auth/users');
      const users = res.data;

      content.innerHTML = `
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>ID</th><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Terdaftar</th></tr></thead>
              <tbody>
                ${users.map(u => `<tr>
                  <td>#${u.id}</td>
                  <td><strong>${u.name}</strong></td>
                  <td>${u.email}</td>
                  <td><span class="badge badge-info">${u.role}</span></td>
                  <td><span class="badge ${u.is_active ? 'badge-success' : 'badge-danger'}">${u.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td>${Format.date(u.created_at)}</td>
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
      <form id="userForm">
        <div class="form-group"><label>Nama</label><input type="text" id="ufName" required></div>
        <div class="form-group"><label>Email</label><input type="email" id="ufEmail" required></div>
        <div class="form-group"><label>Password</label><input type="password" id="ufPassword" required minlength="6"></div>
        <div class="form-group"><label>Role</label>
          <select id="ufRole" required>
            <option value="cashier">Kasir</option>
            <option value="reseller">Reseller</option>
            <option value="owner">Owner</option>
            <option value="developer">Developer</option>
          </select>
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="UsersComponent.submit()">Simpan</button>`;

    App.showModal('Tambah User Baru', body, footer);
  },

  async submit() {
    try {
      await API.post('/api/auth/register', {
        name: document.getElementById('ufName').value,
        email: document.getElementById('ufEmail').value,
        password: document.getElementById('ufPassword').value,
        role: document.getElementById('ufRole').value
      });
      App.toast('User berhasil ditambahkan!');
      App.closeModal();
      this.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
