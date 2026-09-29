// ==========================================
// SecureMart Grocery - UI & Components
// ==========================================

// ---- Toast Notifications ----
function showToast(message, type = 'success', duration = 4000) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = $('#toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-msg">${sanitizeHtml(message)}</span>
    <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// Fallback high-quality vector image generator for groceries
function getProductFallbackSvg(name) {
  const map = {
    'Basmati Rice': { bg: '#FFF8E1', emoji: '🌾', label: 'Premium Rice' },
    'Wheat Flour': { bg: '#FFF3E0', emoji: '🌾', label: 'Wheat Flour' },
    'Full Cream Milk': { bg: '#E1F5FE', emoji: '🥛', label: 'Fresh Milk' },
    'Fresh White Eggs': { bg: '#FAFAFA', emoji: '🥚', label: 'Fresh White Eggs' },
    'White Bread': { bg: '#FFF8E1', emoji: '🍞', label: 'White Bread' },
    'Fresh Tomatoes': { bg: '#FFEBEE', emoji: '🍅', label: 'Fresh Tomatoes' },
    'Fresh Potatoes': { bg: '#EFEBE9', emoji: '🥔', label: 'Fresh Potatoes' },
    'Red Onions': { bg: '#F3E5F5', emoji: '🧅', label: 'Red Onions' },
    'Royal Gala Apples': { bg: '#FFEBEE', emoji: '🍎', label: 'Fresh Apples' },
    'Ripe Bananas': { bg: '#FFFDE7', emoji: '🍌', label: 'Ripe Bananas' },
    'Sunflower Oil': { bg: '#FFF8E1', emoji: '🌻', label: 'Cooking Oil' },
    'White Sugar': { bg: '#F5F5F5', emoji: '🍬', label: 'White Sugar' },
    'Butter Biscuits': { bg: '#FFF3E0', emoji: '🍪', label: 'Butter Biscuits' },
    'Ground Coffee': { bg: '#EFEBE9', emoji: '☕', label: 'Ground Coffee' },
    'Assam Tea Leaves': { bg: '#E8F5E9', emoji: '🍃', label: 'Assam Tea' }
  };
  const item = map[name] || { bg: '#E8F5E9', emoji: '🛒', label: name };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${item.bg}"/>
    <circle cx="200" cy="180" r="95" fill="rgba(255,255,255,0.8)"/>
    <text x="200" y="215" font-size="90" text-anchor="middle">${item.emoji}</text>
    <text x="200" y="320" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="22" font-weight="700" fill="#2E7D32" text-anchor="middle">${item.label}</text>
    <text x="200" y="350" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="13" font-weight="600" fill="#757575" text-anchor="middle">SecureMart Fresh</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  el.className = 'toast-container';
  document.body.appendChild(el);
  return el;
}

// ---- Cart Badge ----
function updateCartBadge() {
  const count = Cart.count();
  $$('.cart-badge').forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
  $$('.cart-count-text').forEach(el => el.textContent = count);
}

// ---- Stock Status ----
function getStockStatus(stock) {
  if (stock === 0) return { text: '✗ Out of Stock', cls: 'out', badge: 'Out of Stock', badgeCls: 'out-of-stock' };
  if (stock <= 10) return { text: `⚠ Low Stock (${stock} left)`, cls: 'low', badge: 'Low Stock', badgeCls: 'low-stock' };
  return { text: '✓ In Stock', cls: 'in-stock', badge: null, badgeCls: null };
}

// ---- Product Card ----
function createProductCard(product, quantities = {}) {
  const qty = quantities[product.id] || 1;
  const stock = getStockStatus(product.stock);
  const outOfStock = product.stock === 0;

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  card.innerHTML = `
    ${stock.badge ? `<span class="product-badge ${stock.badgeCls}">${stock.badge}</span>` : ''}
    <div class="product-img-wrap" onclick="App.showProductDetail(${product.id})">
      <img src="${product.image}" alt="${sanitizeHtml(product.name)}" 
           loading="lazy" onerror="this.onerror=null;this.src=getProductFallbackSvg('${product.name.replace(/'/g, "\\'")}');">
    </div>
    <div class="product-info">
      <div class="product-category">${sanitizeHtml(product.category)}</div>
      <div class="product-name" onclick="App.showProductDetail(${product.id})">${sanitizeHtml(product.name)}</div>
      <div class="product-price">${formatCurrency(product.price)} <span class="unit">/ ${sanitizeHtml(product.unit)}</span></div>
      <div class="stock-status ${stock.cls}">${stock.text}</div>
      <div class="qty-selector">
        <button class="qty-btn" onclick="changeQty(${product.id}, -1)" ${outOfStock ? 'disabled' : ''}>−</button>
        <span class="qty-num" id="qty-${product.id}">${qty}</span>
        <button class="qty-btn" onclick="changeQty(${product.id}, 1)" ${outOfStock ? 'disabled' : ''}>+</button>
      </div>
      <button class="add-to-cart-btn" onclick="addToCartFromCard(${product.id})" ${outOfStock ? 'disabled' : ''}>
        🛒 ${outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  `;
  return card;
}

// Quantity management for product cards
const cardQuantities = {};
function changeQty(productId, delta) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  cardQuantities[productId] = cardQuantities[productId] || 1;
  cardQuantities[productId] = Math.max(1, Math.min(cardQuantities[productId] + delta, product.stock || 1));
  const el = $(`#qty-${productId}`);
  if (el) el.textContent = cardQuantities[productId];
}

function addToCartFromCard(productId) {
  if (!Session.isLoggedIn()) {
    showToast('Please login to add items to cart.', 'warning');
    App.navigate('login');
    return;
  }
  const qty = cardQuantities[productId] || 1;
  if (Cart.add(productId, qty)) {
    const product = PRODUCTS.find(p => p.id === productId);
    showToast(`${product.name} added to cart! 🛒`, 'success');
    cardQuantities[productId] = 1;
    const el = $(`#qty-${productId}`);
    if (el) el.textContent = 1;
  } else {
    showToast('Unable to add item. Out of stock.', 'error');
  }
}

// ---- OTP Inputs ----
function initOTPInputs(containerId) {
  const inputs = $$(`#${containerId} .otp-input`);
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', e => {
      inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
      if (inp.value) {
        inp.classList.add('filled');
        if (i < inputs.length - 1) inputs[i + 1].focus();
      } else {
        inp.classList.remove('filled');
      }
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
      if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
      if (e.key === 'ArrowRight' && i < inputs.length - 1) inputs[i + 1].focus();
    });
    inp.addEventListener('paste', e => {
      e.preventDefault();
      const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((ch, j) => {
        if (inputs[j]) { inputs[j].value = ch; inputs[j].classList.add('filled'); }
      });
      if (inputs[pasted.length]) inputs[pasted.length].focus();
    });
  });
}

function getOTPValue(containerId) {
  return $$(`#${containerId} .otp-input`).map(inp => inp.value).join('');
}

function clearOTPInputs(containerId) {
  $$(`#${containerId} .otp-input`).forEach(inp => {
    inp.value = '';
    inp.classList.remove('filled');
  });
}

// ---- OTP Timer ----
let otpTimerInterval = null;
function startOTPTimer(userId, displayId, onExpire) {
  clearOTPTimer();
  const el = $(`#${displayId}`);
  function tick() {
    const secs = OTPStore.getTimeLeft(userId);
    if (!el) return;
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    el.textContent = `${m}:${s}`;
    if (secs <= 0) {
      clearOTPTimer();
      if (onExpire) onExpire();
    }
  }
  tick();
  otpTimerInterval = setInterval(tick, 1000);
}

function clearOTPTimer() {
  if (otpTimerInterval) { clearInterval(otpTimerInterval); otpTimerInterval = null; }
}

// ---- Form Validation ----
const Validators = {
  required: val => val.trim() !== '' || 'This field is required.',
  email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email address.',
  mobile: val => /^[6-9]\d{9}$/.test(val) || 'Enter a valid 10-digit mobile number.',
  password: val => {
    if (val.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(val)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*]/.test(val)) return 'Password must contain at least one special character (!@#$%^&*).';
    return true;
  },
  username: val => val.trim().length >= 3 || 'Username must be at least 3 characters.',
  minLength: (min) => val => val.trim().length >= min || `Minimum ${min} characters required.`
};

function validateField(input, validators) {
  for (const v of validators) {
    const result = v(input.value);
    if (result !== true) {
      input.classList.add('error'); input.classList.remove('success');
      showFieldError(input, result);
      return false;
    }
  }
  input.classList.remove('error'); input.classList.add('success');
  clearFieldError(input);
  return true;
}

function showFieldError(input, msg) {
  clearFieldError(input);
  const err = document.createElement('div');
  err.className = 'field-error';
  err.style.cssText = 'color:#d32f2f;font-size:0.78rem;margin-top:4px;display:flex;align-items:center;gap:4px;';
  err.innerHTML = `⚠ ${sanitizeHtml(msg)}`;
  input.closest('.form-group').appendChild(err);
}

function clearFieldError(input) {
  const existing = input.closest('.form-group')?.querySelector('.field-error');
  if (existing) existing.remove();
}

function showAlert(containerId, message, type = 'danger') {
  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = $(`#${containerId}`);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${icons[type] || ''} ${sanitizeHtml(message)}</div>`;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert(containerId) {
  const el = $(`#${containerId}`);
  if (el) el.innerHTML = '';
}

// ---- Modal ----
function openModal(id) {
  const modal = $(`#${id}`);
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const modal = $(`#${id}`);
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ---- Loading State ----
function setLoading(btn, loading, text = '') {
  if (loading) {
    btn.dataset.origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${text || 'Loading...'}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.origText || text;
  }
}

// ---- Render Category Bar ----
function renderCategoryBar(containerId, activeId = 'all', onSelect) {
  const el = $(`#${containerId}`);
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => `
    <button class="cat-btn ${c.id === activeId ? 'active' : ''}" 
            onclick="(${onSelect.toString()})('${c.id}')">
      ${c.icon} ${c.name}
    </button>
  `).join('');
}

// ---- Star Rating ----
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '⭑';
  for (let i = full + (half ? 1 : 0); i < 5; i++) stars += '☆';
  return `<span style="color:#ff8f00;font-size:0.95rem;">${stars}</span> <span style="color:#757575;font-size:0.82rem;">(${rating} • ${formatNumber(rating > 100 ? 312 : 145)} reviews)</span>`;
}

function formatNumber(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
}

// ---- Navbar update ----
function updateNavbar() {
  const user = Session.getCurrentUser();
  const loginLinks = $$('.nav-guest');
  const userLinks = $$('.nav-authenticated');
  const roleLinks = $$('.nav-role-link');

  loginLinks.forEach(el => el.style.display = user ? 'none' : '');
  userLinks.forEach(el => el.style.display = user ? '' : 'none');

  if (user) {
    $$('.nav-username').forEach(el => el.textContent = user.username);
    $$('.nav-role').forEach(el => el.textContent = user.role);
    // Show role-specific nav
    roleLinks.forEach(el => {
      const roles = el.dataset.roles?.split(',') || [];
      el.style.display = (roles.length === 0 || roles.includes(user.role)) ? '' : 'none';
    });
  }
}

// ---- Hamburger Menu ----
function toggleMobileMenu() {
  const menu = $('#mobile-menu');
  if (menu) menu.classList.toggle('open');
}

function closeMobileMenu() {
  const menu = $('#mobile-menu');
  if (menu) menu.classList.remove('open');
}
