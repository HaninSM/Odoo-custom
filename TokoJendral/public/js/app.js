/**
 * Main application router and state manager.
 * Handles page navigation and component rendering.
 */
const App = {
  currentPage: 'dashboard',

  init() {
    // Check authentication
    const token = API.getToken();
    if (!token) {
      window.location.href = '/';
      return;
    }

    const user = API.getUser();

    // Render sidebar
    Sidebar.render();

    // Navigate to initial page
    if (user && user.role === 'developer') {
      this.navigate('developer');
    } else {
      this.navigate('dashboard');
    }
  },

  navigate(page) {
    const user = API.getUser();
    // If role is developer, strictly force only developer page
    if (user && user.role === 'developer') {
      page = 'developer';
    }

    this.currentPage = page;
    Sidebar.setActive(page);

    const titleMap = {
      dashboard: 'Dashboard',
      pos: 'Point of Sale',
      inventory: 'Stok Barang',
      transactions: 'Riwayat Transaksi',
      purchases: 'Pembelian / Restock',
      products: 'Produk & Satuan',
      suppliers: 'Supplier',
      expenses: 'Pengeluaran Operasional',
      reports: 'Laporan',
      users: 'User Management',
      settings: 'Pengaturan',
      developer: 'Developer Maintenance & Data Cleanup'
    };

    const titleEl = document.getElementById('pageTitle');
    if (titleEl) {
      titleEl.textContent = titleMap[page] || page;
    }
    const headerActions = document.getElementById('headerActions');
    if (headerActions) {
      headerActions.innerHTML = '';
    }

    // Render the corresponding component
    const componentMap = {
      dashboard: DashboardComponent,
      pos: POSComponent,
      inventory: InventoryComponent,
      transactions: TransactionsComponent,
      purchases: PurchasesComponent,
      products: ProductsComponent,
      suppliers: SuppliersComponent,
      expenses: ExpensesComponent,
      reports: ReportsComponent,
      users: UsersComponent,
      settings: SettingsComponent,
      developer: DeveloperComponent
    };

    const component = componentMap[page];
    if (component && component.render) {
      component.render();
    } else {
      document.getElementById('contentArea').innerHTML = `
        <div class="empty-state">
          <div class="icon">🛠️</div>
          <p>Halaman "${page}" sedang dalam pengembangan.</p>
        </div>`;
    }
  },

  /** Show toast notification */
  toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  /** Show confirmation dialog */
  async confirm(message) {
    return window.confirm(message);
  },

  /** Create a modal dialog */
  showModal(title, bodyHtml, footerHtml = '', modalClass = '') {
    // Remove existing modal
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal ${modalClass}">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="App.closeModal()">&times;</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>`;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) App.closeModal();
    });

    document.body.appendChild(overlay);
  },

  closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  }
};

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());
