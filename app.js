// ==========================================
// SecureMart Grocery - App Router
// ==========================================

const App = {
  currentPage: 'home',
  currentProductId: null,
  productsFilter: 'all',
  productsSearch: '',

  // ---- Navigation ----
  navigate(page, params = {}) {
    const user = Session.getCurrentUser();

    // Auth guard
    const protectedPages = ['cart', 'checkout', 'orders', 'profile', 'employee', 'admin'];
    if (protectedPages.includes(page) && !user) {
      showToast('Please login to continue.', 'warning');
      App.navigate('login');
      return;
    }

    // Role guard
    if (page === 'admin' && user?.role !== 'admin') {
      showToast('Access denied. Admin only.', 'error');
      App.navigate('home');
      return;
    }

    if (page === 'employee' && !['cashier', 'manager', 'admin'].includes(user?.role)) {
      showToast('Access denied. Employees only.', 'error');
      App.navigate('home');
      return;
    }

    // Cart guard for checkout
    if (page === 'checkout' && Cart.count() === 0) {
      showToast('Your cart is empty!', 'warning');
      App.navigate('cart');
      return;
    }

    // Hide all pages
    $$('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const pageEl = $(`#page-${page.replace(/-/g, '_')}`);
    if (!pageEl) {
      console.warn('Page not found:', page);
      App.navigate('home');
      return;
    }

    pageEl.classList.add('active');
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();

    // Update active nav link
    $$('.nav-links a, .mobile-menu a').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.page === page) a.classList.add('active');
    });

    // Render page content
    this.renderPage(page, params);
    history.pushState({ page, params }, '', `#${page}`);
  },

  renderPage(page, params = {}) {
    switch (page) {
      case 'home':
        Pages.renderHome();
        break;
      case 'products':
        if (params.cat) {
          this.productsFilter = params.cat;
        }
        this.renderProductsPage();
        break;
      case 'product-detail':
        if (params.id) this.currentProductId = params.id;
        Pages.renderProductDetail(this.currentProductId);
        break;
      case 'cart':
        Pages.renderCart();
        break;
      case 'checkout':
        Pages.renderCheckout();
        break;
      case 'orders':
        Pages.renderOrders();
        break;
      case 'profile':
        Pages.renderProfile();
        break;
      case 'employee':
        Pages.renderEmployeeDashboard();
        break;
      case 'admin':
        Pages.renderAdminDashboard();
        break;
    }
  },

  renderProductsPage() {
    renderCategoryBar('products-cat-bar', this.productsFilter, (cat) => {
      App.productsFilter = cat;
      App.productsSearch = '';
      const searchInput = $('#products-search');
      if (searchInput) searchInput.value = '';
      Pages.renderProducts(cat, '');
      $$('#products-cat-bar .cat-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = $(`#products-cat-bar .cat-btn:nth-child(${CATEGORIES.findIndex(c => c.id === cat) + 1})`);
      if (activeBtn) activeBtn.classList.add('active');
    });
    Pages.renderProducts(this.productsFilter, this.productsSearch);
  },

  showProductDetail(productId) {
    this.currentProductId = productId;
    this.navigate('product-detail', { id: productId });
  },

  searchProducts(query) {
    this.productsSearch = query;
    Pages.renderProducts(this.productsFilter, query);
  },

  // ---- Checkout Submit ----
  async submitCheckout(e) {
    e.preventDefault();
    const user = Session.getCurrentUser();
    if (!user) return;

    const address = {
      line1: $('#checkout-address').value.trim(),
      city: $('#checkout-city').value.trim(),
      state: $('#checkout-state').value.trim(),
      pincode: $('#checkout-pincode').value.trim()
    };

    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      showAlert('checkout-alert', 'Please fill in all address fields.', 'warning');
      return;
    }

    const paymentMethod = $('input[name="payment"]:checked')?.value;
    if (!paymentMethod) {
      showAlert('checkout-alert', 'Please select a payment method.', 'warning');
      return;
    }

    const btn = $('#checkout-btn');
    setLoading(btn, true, 'Placing Order...');

    await new Promise(r => setTimeout(r, 1000));

    const cartItems = Cart.get();
    const order = Orders.create(user.id, cartItems, address, paymentMethod);
    Cart.clear();

    setLoading(btn, false);
    closeModal('checkout-success-modal');

    // Show success modal
    $('#order-success-id').textContent = order.id;
    openModal('checkout-success-modal');
  },

  // ---- Update Profile ----
  async updateProfile(e) {
    e.preventDefault();
    const user = Session.getCurrentUser();
    if (!user) return;

    const username = $('#pf-username').value.trim();
    const mobile = $('#pf-mobile').value.trim();

    if (username.length < 3) {
      showAlert('profile-alert', 'Username must be at least 3 characters.', 'warning');
      return;
    }

    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      showAlert('profile-alert', 'Enter a valid mobile number.', 'warning');
      return;
    }

    const btn = $('#save-profile-btn');
    setLoading(btn, true, 'Saving...');
    await new Promise(r => setTimeout(r, 500));

    UserDB.update(user.id, { username, mobile });
    setLoading(btn, false);
    showAlert('profile-alert', 'Profile updated successfully!', 'success');
    Pages.renderProfile();
    showToast('Profile updated!', 'success');
  },

  // ---- Change Password ----
  async changePassword(e) {
    e.preventDefault();
    const user = Session.getCurrentUser();
    if (!user) return;

    const currentPw = $('#pf-current-pw').value;
    const newPw = $('#pf-new-pw').value;
    const confirmPw = $('#pf-confirm-pw').value;

    const verified = await UserDB.verifyPassword(user.email, currentPw);
    if (!verified) {
      showAlert('password-alert', 'Current password is incorrect.', 'danger');
      return;
    }

    if (!validateField($('#pf-new-pw'), [Validators.password])) return;

    if (newPw !== confirmPw) {
      showFieldError($('#pf-confirm-pw'), 'Passwords do not match.');
      return;
    }

    const btn = $('#change-pw-btn');
    setLoading(btn, true, 'Updating...');
    await new Promise(r => setTimeout(r, 500));

    const hash = await hashPassword(newPw);
    UserDB.update(user.id, { passwordHash: hash });

    setLoading(btn, false);
    showAlert('password-alert', 'Password changed successfully!', 'success');
    $('#pf-current-pw').value = '';
    $('#pf-new-pw').value = '';
    $('#pf-confirm-pw').value = '';
    showToast('Password updated!', 'success');
  },

  // ---- Profile Tab Switching ----
  switchProfileTab(tab) {
    $$('.profile-tab-content').forEach(el => el.style.display = 'none');
    $$('.profile-nav-item').forEach(btn => btn.classList.remove('active'));
    const tabEl = $(`#profile-tab-${tab}`);
    if (tabEl) tabEl.style.display = 'block';
    const navItem = $(`[data-profile-tab="${tab}"]`);
    if (navItem) navItem.classList.add('active');

    if (tab === 'orders') Pages.renderOrders();
  }
};

// ---- Browser back/forward ----
window.addEventListener('popstate', (e) => {
  const state = e.state;
  if (state?.page) {
    App.navigate(state.page, state.params || {});
  }
});

// ==========================================
// App Initialization
// ==========================================
async function initApp() {
  // Seed demo data
  await seedDemoData();

  // Check existing session
  const session = Session.get();
  updateNavbar();
  updateCartBadge();

  // Handle initial route from hash
  const hash = window.location.hash.replace('#', '') || 'home';
  const validPages = ['home', 'products', 'login', 'register', 'cart'];

  // Navigate to home by default
  if (validPages.includes(hash) && !['cart'].includes(hash)) {
    App.navigate(hash);
  } else {
    App.navigate('home');
  }

  // Global search in nav
  const navSearch = $('#nav-search');
  if (navSearch) {
    navSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        App.navigate('products');
        setTimeout(() => {
          const searchInput = $('#products-search');
          if (searchInput) {
            searchInput.value = navSearch.value;
            App.searchProducts(navSearch.value);
          }
        }, 100);
      }
    });
  }

  // Products page search
  document.addEventListener('input', e => {
    if (e.target.id === 'products-search') {
      App.searchProducts(e.target.value);
    }
    if (e.target.id === 'hero-search-input') {
      // Just trigger products navigation on enter
    }
  });

  document.addEventListener('keydown', e => {
    if (e.target.id === 'hero-search-input' && e.key === 'Enter') {
      const q = e.target.value;
      App.navigate('products');
      setTimeout(() => {
        const searchInput = $('#products-search');
        if (searchInput) { searchInput.value = q; App.searchProducts(q); }
      }, 100);
    }
  });

  // Password toggle buttons
  document.addEventListener('click', e => {
    if (e.target.classList.contains('toggle-pw') || e.target.closest('.toggle-pw')) {
      const btn = e.target.closest('.toggle-pw') || e.target;
      const input = btn.previousElementSibling || btn.parentElement?.querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? '🙈' : '👁️';
      }
    }
  });

  // Sort filter
  document.addEventListener('change', e => {
    if (e.target.id === 'sort-select') {
      const val = e.target.value;
      // Apply sort to current products
      Pages.renderProducts(App.productsFilter, App.productsSearch, val);
    }
  });
}

// Start app when DOM ready
document.addEventListener('DOMContentLoaded', initApp);
