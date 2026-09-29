// ==========================================
// SecureMart Grocery - Page Renderers
// ==========================================

const Pages = {

  // ---- HOME PAGE ----
  renderHome() {
    const container = $('#home-products-grid');
    if (!container) return;
    container.innerHTML = '';
    const featured = PRODUCTS.slice(0, 8);
    featured.forEach(p => container.appendChild(createProductCard(p, cardQuantities)));

    // Render categories on home
    const catGrid = $('#home-categories-grid');
    if (catGrid) {
      catGrid.innerHTML = CATEGORIES.slice(1).map(c => `
        <div class="cat-pill" onclick="App.navigate('products', {cat: '${c.id}'})"
             style="background:white;border-radius:12px;padding:16px;text-align:center;
                    cursor:pointer;box-shadow:var(--shadow-sm);transition:var(--transition);
                    border:2px solid transparent;"
             onmouseover="this.style.borderColor='var(--primary-light)'"
             onmouseout="this.style.borderColor='transparent'">
          <div style="font-size:2.2rem;margin-bottom:6px;">${c.icon}</div>
          <div style="font-size:0.85rem;font-weight:600;color:var(--dark-gray);">${c.name}</div>
        </div>
      `).join('');
    }
  },

  // ---- PRODUCTS PAGE ----
  renderProducts(filter = 'all', search = '') {
    const container = $('#products-grid');
    if (!container) return;

    let filtered = PRODUCTS;
    if (filter && filter !== 'all') {
      filtered = filtered.filter(p => p.category === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <span class="icon">🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>`;
      return;
    }
    filtered.forEach(p => container.appendChild(createProductCard(p, cardQuantities)));
    $('#products-count').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
  },

  // ---- PRODUCT DETAIL ----
  renderProductDetail(productId) {
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;
    const stock = getStockStatus(p.stock);
    const container = $('#product-detail-content');
    if (!container) return;

    cardQuantities[p.id] = cardQuantities[p.id] || 1;

    container.innerHTML = `
      <div class="product-detail-layout">
        <div class="product-detail-img">
          <img src="${p.image}" alt="${sanitizeHtml(p.name)}" 
               onerror="this.onerror=null;this.src=getProductFallbackSvg('${p.name.replace(/'/g, "\\'")}');">
        </div>
        <div class="product-detail-info">
          <div class="product-category" style="font-size:0.9rem;margin-bottom:8px;">${sanitizeHtml(p.category)}</div>
          <h1>${sanitizeHtml(p.name)}</h1>
          <div>${renderStars(p.rating)}</div>
          <div class="product-detail-price">${formatCurrency(p.price)} <span style="font-size:1rem;font-weight:400;color:var(--text-light);">/ ${sanitizeHtml(p.unit)}</span></div>
          <div class="stock-status ${stock.cls}" style="font-size:0.95rem;margin:12px 0;">${stock.text}</div>
          <p style="color:var(--dark-gray);line-height:1.7;margin-bottom:16px;">${sanitizeHtml(p.description)}</p>
          <div class="product-tags">
            ${(p.tags || []).map(t => `<span class="tag">${sanitizeHtml(t)}</span>`).join('')}
            <span class="tag">${sanitizeHtml(p.category)}</span>
          </div>
          <div style="margin-top:20px;">
            <div style="font-weight:600;margin-bottom:10px;color:var(--dark-gray);">Quantity:</div>
            <div class="qty-selector" style="margin-bottom:16px;">
              <button class="qty-btn" onclick="changeQty(${p.id},-1);$('#detail-qty').textContent=cardQuantities[${p.id}]||1" ${p.stock===0?'disabled':''}>−</button>
              <span class="qty-num" id="detail-qty">${cardQuantities[p.id] || 1}</span>
              <button class="qty-btn" onclick="changeQty(${p.id},1);$('#detail-qty').textContent=cardQuantities[${p.id}]||1" ${p.stock===0?'disabled':''}>+</button>
            </div>
            <button class="add-to-cart-btn" style="max-width:260px;padding:14px 24px;font-size:1rem;" 
                    onclick="addToCartFromCard(${p.id})" ${p.stock===0?'disabled':''}>
              🛒 ${p.stock===0?'Out of Stock':'Add to Cart'}
            </button>
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
            <div style="display:flex;gap:20px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:8px;font-size:0.88rem;color:var(--dark-gray);">
                <span style="font-size:1.3rem;">🚚</span> Free delivery above ₹499
              </div>
              <div style="display:flex;align-items:center;gap:8px;font-size:0.88rem;color:var(--dark-gray);">
                <span style="font-size:1.3rem;">🔄</span> 7-day easy returns
              </div>
              <div style="display:flex;align-items:center;gap:8px;font-size:0.88rem;color:var(--dark-gray);">
                <span style="font-size:1.3rem;">🛡️</span> Quality guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ---- CART PAGE ----
  renderCart() {
    const items = Cart.get();
    const listEl = $('#cart-items-list');
    const summaryEl = $('#cart-summary');
    const emptyEl = $('#cart-empty');

    if (!listEl) return;

    if (items.length === 0) {
      listEl.style.display = 'none';
      summaryEl.style.display = 'none';
      emptyEl.style.display = 'block';
      return;
    }

    listEl.style.display = 'block';
    summaryEl.style.display = 'block';
    emptyEl.style.display = 'none';

    listEl.innerHTML = items.map(item => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item" id="cart-item-${p.id}">
          <img class="cart-item-img" src="${p.image}" alt="${sanitizeHtml(p.name)}"
               onerror="this.onerror=null;this.src=getProductFallbackSvg('${p.name.replace(/'/g, "\\'")}');">
          <div class="cart-item-info">
            <div class="cart-item-name">${sanitizeHtml(p.name)}</div>
            <div class="cart-item-category">${sanitizeHtml(p.category)}</div>
            <div class="cart-item-price">${formatCurrency(p.price)} / ${sanitizeHtml(p.unit)}</div>
            <div class="qty-selector" style="margin-top:8px;">
              <button class="qty-btn" onclick="updateCartQty(${p.id}, ${item.qty - 1})">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${p.id}, ${item.qty + 1})">+</button>
            </div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-total">${formatCurrency(p.price * item.qty)}</div>
            <button class="remove-btn" onclick="removeFromCart(${p.id})" title="Remove item">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Summary
    const subtotal = Cart.total();
    const shipping = subtotal >= 499 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    summaryEl.innerHTML = `
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--primary-dark);margin-bottom:16px;">Order Summary</h3>
      <div class="summary-row"><span>Subtotal (${Cart.count()} items)</span><span>${formatCurrency(subtotal)}</span></div>
      <div class="summary-row"><span>Delivery</span><span style="color:${shipping===0?'var(--success)':'inherit'}">${shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
      ${shipping > 0 ? `<div style="font-size:0.78rem;color:var(--text-light);padding:4px 0;">Add ₹${499-subtotal} more for free delivery</div>` : ''}
      <div class="summary-row"><span>GST (5%)</span><span>${formatCurrency(tax)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatCurrency(total)}</span></div>
      <button class="btn-primary" style="margin-top:16px;" onclick="App.navigate('checkout')">
        Proceed to Checkout →
      </button>
      <button class="btn-secondary" style="margin-top:10px;width:100%;" onclick="App.navigate('products')">
        ← Continue Shopping
      </button>
      <div style="text-align:center;margin-top:12px;font-size:0.8rem;color:var(--text-light);">
        🔒 Secure checkout • Multiple payment options
      </div>
    `;
  },

  // ---- CHECKOUT ----
  renderCheckout() {
    const subtotal = Cart.total();
    const shipping = subtotal >= 499 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;
    const user = Session.getCurrentUser();

    $('#checkout-summary').innerHTML = `
      <div class="cart-summary" style="position:static;">
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--primary-dark);margin-bottom:16px;">Order Summary</h3>
        ${Cart.get().map(item => {
          const p = PRODUCTS.find(pr => pr.id === item.id);
          return p ? `<div class="summary-row" style="font-size:0.88rem;">
            <span>${sanitizeHtml(p.name)} ×${item.qty}</span>
            <span>${formatCurrency(p.price * item.qty)}</span>
          </div>` : '';
        }).join('')}
        <div class="summary-row" style="margin-top:8px;"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="summary-row"><span>Delivery</span><span style="color:${shipping===0?'var(--success)':'inherit'}">${shipping===0?'FREE':formatCurrency(shipping)}</span></div>
        <div class="summary-row"><span>GST (5%)</span><span>${formatCurrency(tax)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatCurrency(total)}</span></div>
      </div>
    `;

    // Prefill user data
    if (user) {
      const nameField = $('#checkout-name');
      const emailField = $('#checkout-email');
      const phoneField = $('#checkout-phone');
      if (nameField) nameField.value = user.username || '';
      if (emailField) emailField.value = user.email || '';
      if (phoneField) phoneField.value = user.mobile || '';
    }
  },

  // ---- ORDERS ----
  renderOrders() {
    const user = Session.getCurrentUser();
    if (!user) return;
    const orders = Orders.getByUser(user.id);
    const container = $('#orders-list');
    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:60px 24px;color:var(--text-light);">
          <span style="font-size:3.5rem;display:block;margin-bottom:12px;">📦</span>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here!</p>
          <button class="btn-primary" style="margin-top:16px;max-width:200px;" onclick="App.navigate('products')">
            Shop Now
          </button>
        </div>`;
      return;
    }

    const statusClass = { delivered: 'status-delivered', processing: 'status-processing', shipped: 'status-shipped', cancelled: 'status-cancelled' };

    container.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">📦 ${sanitizeHtml(o.id)}</div>
            <div class="order-date">${formatDate(o.createdAt)}</div>
          </div>
          <span class="order-status ${statusClass[o.status] || ''}">${o.status}</span>
        </div>
        <div class="order-body">
          <div class="order-items-preview">
            ${o.items.map(i => `<span class="order-item-tag">🛒 ${sanitizeHtml(i.name)} ×${i.qty}</span>`).join('')}
          </div>
          <div class="order-total-row">
            <div class="order-amount">${formatCurrency(o.total)}</div>
            <div style="font-size:0.82rem;color:var(--text-light);">via ${o.paymentMethod?.toUpperCase()}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  // ---- PROFILE ----
  renderProfile() {
    const user = Session.getCurrentUser();
    if (!user) return;

    const ph = $('#profile-header');
    if (ph) {
      ph.innerHTML = `
        <div class="profile-avatar">👤</div>
        <div class="profile-name">${sanitizeHtml(user.username)}</div>
        <div class="profile-email">${sanitizeHtml(user.email)}</div>
        <div class="profile-role">${sanitizeHtml(user.role)}</div>
      `;
    }

    // Fill form
    const fields = { 'pf-username': user.username, 'pf-email': user.email, 'pf-mobile': user.mobile };
    for (const [id, val] of Object.entries(fields)) {
      const el = $(`#${id}`);
      if (el) el.value = val || '';
    }
  },

  // ---- EMPLOYEE DASHBOARD ----
  renderEmployeeDashboard() {
    const user = Session.getCurrentUser();
    if (!user || !['cashier', 'manager', 'admin'].includes(user.role)) return;

    const allOrders = Orders.getAll();
    const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
    const processingOrders = allOrders.filter(o => o.status === 'processing').length;
    const totalUsers = UserDB.getAll().length;

    const statsEl = $('#employee-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <div class="stat-num">${allOrders.length}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <div class="stat-num">${processingOrders}</div>
            <div class="stat-label">Pending Orders</div>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-num">${formatCurrency(totalRevenue)}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <div class="stat-num">${PRODUCTS.length}</div>
            <div class="stat-label">Products</div>
          </div>
        </div>
      `;
    }

    // Orders table
    const ordersTable = $('#emp-orders-table-body');
    if (ordersTable) {
      const statusClass = { delivered: 'status-delivered', processing: 'status-processing', shipped: 'status-shipped', cancelled: 'status-cancelled' };
      ordersTable.innerHTML = allOrders.slice(0, 10).map(o => {
        const u = UserDB.findById(o.userId);
        return `<tr>
          <td><strong>${sanitizeHtml(o.id)}</strong></td>
          <td>${u ? sanitizeHtml(u.username) : 'Unknown'}</td>
          <td>${o.items.length} item(s)</td>
          <td>${formatCurrency(o.total)}</td>
          <td><span class="order-status ${statusClass[o.status] || ''}">${o.status}</span></td>
          <td>${formatDate(o.createdAt)}</td>
          <td>
            <select onchange="Orders.updateStatus('${o.id}', this.value); Pages.renderEmployeeDashboard(); showToast('Order status updated', 'success');"
                    style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:0.82rem;background:white;">
              ${['processing','shipped','delivered','cancelled'].map(s => 
                `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`
              ).join('')}
            </select>
          </td>
        </tr>`;
      }).join('') || '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-light);">No orders yet</td></tr>';
    }

    // Products table
    const productsTable = $('#emp-products-table-body');
    if (productsTable) {
      productsTable.innerHTML = PRODUCTS.map(p => {
        const stock = getStockStatus(p.stock);
        return `<tr>
          <td><strong>${sanitizeHtml(p.name)}</strong></td>
          <td>${sanitizeHtml(p.category)}</td>
          <td>${formatCurrency(p.price)}</td>
          <td><span class="stock-status ${stock.cls}">${stock.text}</span></td>
        </tr>`;
      }).join('');
    }
  },

  // ---- ADMIN DASHBOARD ----
  renderAdminDashboard() {
    const user = Session.getCurrentUser();
    if (!user || user.role !== 'admin') return;

    const allUsers = UserDB.getAll();
    const allOrders = Orders.getAll();

    const usersTable = $('#admin-users-table-body');
    if (usersTable) {
      usersTable.innerHTML = allUsers.map(u => `
        <tr>
          <td><strong>${sanitizeHtml(u.username)}</strong></td>
          <td>${sanitizeHtml(u.email)}</td>
          <td>${sanitizeHtml(u.mobile || '—')}</td>
          <td><span class="order-status status-${u.role === 'admin' ? 'processing' : u.role === 'manager' ? 'shipped' : u.role === 'cashier' ? 'delivered' : 'cancelled'}"
                    style="text-transform:capitalize;">${sanitizeHtml(u.role)}</span></td>
          <td>${formatDate(u.createdAt)}</td>
          <td>
            <select onchange="adminUpdateRole('${u.id}', this.value)"
                    style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:0.82rem;background:white;"
                    ${u.id === user.id ? 'disabled title="Cannot change your own role"' : ''}>
              ${['customer','cashier','manager','admin'].map(r =>
                `<option value="${r}" ${u.role===r?'selected':''}>${r.charAt(0).toUpperCase()+r.slice(1)}</option>`
              ).join('')}
            </select>
          </td>
        </tr>
      `).join('');
    }

    const productsTable = $('#admin-products-table-body');
    if (productsTable) {
      productsTable.innerHTML = PRODUCTS.map(p => {
        const stock = getStockStatus(p.stock);
        return `<tr>
          <td><strong>${sanitizeHtml(p.name)}</strong></td>
          <td>${sanitizeHtml(p.category)}</td>
          <td>${formatCurrency(p.price)}</td>
          <td><span class="stock-status ${stock.cls}">${stock.text}</span></td>
          <td><button class="btn-secondary" style="padding:6px 12px;font-size:0.82rem;" 
                      onclick="App.showProductDetail(${p.id})">View</button></td>
        </tr>`;
      }).join('');
    }
  }
};

// ---- Admin helper ----
function adminUpdateRole(userId, newRole) {
  const currentUser = Session.getCurrentUser();
  if (userId === currentUser?.id) {
    showToast('Cannot change your own role.', 'error');
    Pages.renderAdminDashboard();
    return;
  }
  UserDB.update(userId, { role: newRole });
  showToast('User role updated successfully.', 'success');
}

// ---- Cart actions ----
function updateCartQty(productId, newQty) {
  Cart.updateQty(productId, newQty);
  Pages.renderCart();
}

function removeFromCart(productId) {
  Cart.remove(productId);
  Pages.renderCart();
  showToast('Item removed from cart.', 'info');
}
