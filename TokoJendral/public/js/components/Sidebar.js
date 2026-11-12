/**
 * Sidebar component - renders navigation with previous Indonesian menu labels and modern Invo aesthetic.
 */
const Sidebar = {
  render() {
    const user = API.getUser();
    if (!user) return;

    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRole');
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role.toUpperCase();

    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    const menus = this.getMenus(user.role);

    nav.innerHTML = menus.map(item => {
      if (item.divider) return '<div class="nav-divider"></div>';
      return `<button class="nav-item" data-page="${item.page}" onclick="App.navigate('${item.page}')">
        <span class="icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>`;
    }).join('');
  },

  getMenus(role) {
    if (role === 'developer') {
      return [
        { icon: '🛠️', label: 'Developer Maintenance', page: 'developer' }
      ];
    }

    const common = [
      { icon: '📊', label: 'Dashboard', page: 'dashboard' },
      { icon: '🛒', label: 'POS Kasir', page: 'pos' },
      { icon: '📦', label: 'Stok Barang', page: 'inventory' },
      { icon: '🧾', label: 'Riwayat Transaksi', page: 'transactions' }
    ];

    if (role === 'reseller') {
      return [
        { icon: '📊', label: 'Dashboard', page: 'dashboard' },
        { icon: '🛒', label: 'POS Penjualan', page: 'pos' },
        { icon: '🧾', label: 'Riwayat Transaksi', page: 'transactions' }
      ];
    }

    if (role === 'cashier') return common;

    // Owner gets full menu
    return [
      ...common,
      { divider: true },
      { icon: '📥', label: 'Pembelian / Restock', page: 'purchases' },
      { icon: '🏷️', label: 'Produk & Satuan', page: 'products' },
      { icon: '🤝', label: 'Supplier', page: 'suppliers' },
      { divider: true },
      { icon: '💸', label: 'Pengeluaran', page: 'expenses' },
      { icon: '📈', label: 'Laporan', page: 'reports' },
      { icon: '👥', label: 'User Management', page: 'users' },
      { icon: '⚙️', label: 'Pengaturan', page: 'settings' }
    ];
  },

  setActive(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
  }
};

