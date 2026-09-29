// ==========================================
// SecureMart Grocery - Core Data & Utilities
// ==========================================

// ---- Product Catalog ----
const PRODUCTS = [
  {
    id: 1, name: "Basmati Rice", category: "Grains & Rice",
    price: 89, unit: "5 kg bag",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    stock: 120, description: "Premium long-grain basmati rice with a delightful aroma. Perfect for biryani, pulao, and everyday meals.",
    tags: ["Organic", "Premium"], rating: 4.6, reviews: 238
  },
  {
    id: 2, name: "Wheat Flour", category: "Grains & Rice",
    price: 45, unit: "2 kg pack",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    stock: 85, description: "Finely milled whole wheat flour for soft rotis, chapatis, and baked goods. High fiber content.",
    tags: ["Whole Wheat", "High Fiber"], rating: 4.4, reviews: 156
  },
  {
    id: 3, name: "Full Cream Milk", category: "Dairy & Eggs",
    price: 62, unit: "1 litre",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
    stock: 8, description: "Fresh full cream milk sourced from local farms. Rich in calcium and vitamins. Pasteurised & homogenised.",
    tags: ["Farm Fresh", "Pasteurised"], rating: 4.7, reviews: 312
  },
  {
    id: 4, name: "Fresh White Eggs", category: "Dairy & Eggs",
    price: 95, unit: "12 eggs",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80",
    stock: 45, description: "Pure white farm-fresh table eggs rich in high quality protein, vitamins, and minerals. Perfect for breakfast and baking.",
    tags: ["White Eggs", "Farm Fresh"], rating: 4.6, reviews: 215
  },
  {
    id: 5, name: "White Bread", category: "Bakery",
    price: 42, unit: "400 g loaf",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    stock: 30, description: "Soft and fluffy white sandwich bread, freshly baked. Great for sandwiches and toast.",
    tags: ["Freshly Baked", "Soft"], rating: 4.3, reviews: 145
  },
  {
    id: 6, name: "Fresh Tomatoes", category: "Vegetables",
    price: 35, unit: "500 g",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80",
    stock: 60, description: "Crisp, juicy red ripe farm tomatoes. High in lycopene and vitamin C, ideal for everyday cooking and fresh salads.",
    tags: ["Local Farm", "Fresh"], rating: 4.5, reviews: 204
  },
  {
    id: 7, name: "Fresh Potatoes", category: "Vegetables",
    price: 28, unit: "1 kg",
    image: "https://images.unsplash.com/photo-1518977676405-d4b9ff70eb63?w=500&auto=format&fit=crop&q=80",
    stock: 90, description: "Fresh, earthy potatoes perfect for boiling, roasting, curries, and french fries. Rich in dietary potassium and fiber.",
    tags: ["Fresh", "Pantry Essential"], rating: 4.4, reviews: 172
  },
  {
    id: 8, name: "Red Onions", category: "Vegetables",
    price: 32, unit: "1 kg",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop",
    stock: 75, description: "Pungent and flavorful red onions, essential for Indian cooking. Rich in antioxidants.",
    tags: ["Fresh", "Organic"], rating: 4.3, reviews: 167
  },
  {
    id: 9, name: "Royal Gala Apples", category: "Fruits",
    price: 120, unit: "1 kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    stock: 5, description: "Crisp and sweet Royal Gala apples packed with fiber and vitamins. A healthy everyday snack.",
    tags: ["Imported", "Fresh"], rating: 4.6, reviews: 223
  },
  {
    id: 10, name: "Ripe Bananas", category: "Fruits",
    price: 48, unit: "1 dozen",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    stock: 40, description: "Fresh yellow bananas, naturally sweet and creamy. High in potassium and energy.",
    tags: ["Fresh", "Natural"], rating: 4.5, reviews: 201
  },
  {
    id: 11, name: "Sunflower Oil", category: "Oils & Fats",
    price: 175, unit: "1 litre",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
    stock: 55, description: "Light, refined sunflower cooking oil with high smoke point. Ideal for frying, baking, and sauteing.",
    tags: ["Refined", "Light"], rating: 4.4, reviews: 178
  },
  {
    id: 12, name: "White Sugar", category: "Pantry",
    price: 42, unit: "1 kg",
    image: "https://images.unsplash.com/photo-1581391371658-9a50bb073e77?w=400&h=400&fit=crop",
    stock: 100, description: "Fine granulated white sugar for everyday cooking, baking, and beverages.",
    tags: ["Refined", "Pure"], rating: 4.3, reviews: 112
  },
  {
    id: 13, name: "Butter Biscuits", category: "Snacks",
    price: 38, unit: "200 g pack",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    stock: 65, description: "Crispy and delicious butter biscuits perfect for tea time. Light, flaky, and irresistibly tasty.",
    tags: ["Crunchy", "Tea-time"], rating: 4.4, reviews: 189
  },
  {
    id: 14, name: "Ground Coffee", category: "Beverages",
    price: 285, unit: "200 g jar",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    stock: 35, description: "Rich and aromatic premium ground coffee. Dark roast for a bold, full-bodied cup every morning.",
    tags: ["Dark Roast", "Arabica"], rating: 4.7, reviews: 345
  },
  {
    id: 15, name: "Assam Tea Leaves", category: "Beverages",
    price: 155, unit: "250 g pack",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    stock: 0, description: "Premium Assam CTC tea leaves with a strong, malty flavor. Brews a robust cup of chai.",
    tags: ["Premium", "Assam"], rating: 4.5, reviews: 267
  }
];

// ---- Categories ----
const CATEGORIES = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "Grains & Rice", name: "Grains & Rice", icon: "🌾" },
  { id: "Dairy & Eggs", name: "Dairy & Eggs", icon: "🥛" },
  { id: "Bakery", name: "Bakery", icon: "🍞" },
  { id: "Vegetables", name: "Vegetables", icon: "🥦" },
  { id: "Fruits", name: "Fruits", icon: "🍎" },
  { id: "Oils & Fats", name: "Oils & Fats", icon: "🫙" },
  { id: "Pantry", name: "Pantry", icon: "🥫" },
  { id: "Snacks", name: "Snacks", icon: "🍪" },
  { id: "Beverages", name: "Beverages", icon: "☕" }
];

// ---- Utility Functions ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatCurrency(amount) {
  return '₹' + parseFloat(amount).toFixed(2);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function sanitizeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ---- Storage Helpers ----
const Store = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('sm_' + key)); }
    catch { return null; }
  },
  set(key, val) {
    localStorage.setItem('sm_' + key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem('sm_' + key);
  }
};

// ---- Password Hashing (SHA-256 via WebCrypto) ----
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'securemart_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---- OTP Generator ----
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---- Token Generator ----
function generateToken(userId) {
  const payload = { userId, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
}

function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

// ---- Rate Limiter ----
const RateLimiter = {
  check(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const data = Store.get('rl_' + key) || { attempts: [], blocked_until: null };
    if (data.blocked_until && now < data.blocked_until) {
      const mins = Math.ceil((data.blocked_until - now) / 60000);
      return { allowed: false, reason: `Too many attempts. Try again in ${mins} minute(s).` };
    }
    data.attempts = (data.attempts || []).filter(t => now - t < windowMs);
    if (data.attempts.length >= maxAttempts) {
      data.blocked_until = now + windowMs;
      Store.set('rl_' + key, data);
      return { allowed: false, reason: `Too many attempts. Blocked for 15 minutes.` };
    }
    data.attempts.push(now);
    Store.set('rl_' + key, data);
    return { allowed: true };
  },
  reset(key) {
    Store.remove('rl_' + key);
  }
};

// ==========================================
// User Management System
// ==========================================
const UserDB = {
  getAll() { return Store.get('users') || []; },
  save(users) { Store.set('users', users); },

  findByEmail(email) {
    return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findByMobile(mobile) {
    return this.getAll().find(u => u.mobile === mobile);
  },
  findById(id) {
    return this.getAll().find(u => u.id === id);
  },
  findByIdentifier(identifier) {
    const users = this.getAll();
    return users.find(u =>
      u.email.toLowerCase() === identifier.toLowerCase() ||
      u.mobile === identifier ||
      u.username.toLowerCase() === identifier.toLowerCase()
    );
  },

  async create(data) {
    const users = this.getAll();
    if (this.findByEmail(data.email)) throw new Error('Email already registered.');
    if (data.mobile && this.findByMobile(data.mobile)) throw new Error('Mobile number already registered.');
    const pwHash = await hashPassword(data.password);
    const user = {
      id: generateId(),
      username: data.username,
      email: data.email,
      mobile: data.mobile || '',
      passwordHash: pwHash,
      role: data.role || 'customer',
      createdAt: new Date().toISOString(),
      isActive: true,
      orders: []
    };
    users.push(user);
    this.save(users);
    return user;
  },

  async verifyPassword(identifier, password) {
    const user = this.findByIdentifier(identifier);
    if (!user) return null;
    const hash = await hashPassword(password);
    return hash === user.passwordHash ? user : null;
  },

  update(id, updates) {
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.save(users);
    return users[idx];
  }
};

// ---- OTP Store ----
const OTPStore = {
  create(userId, purpose = 'login') {
    const otp = generateOTP();
    const record = {
      userId,
      otp, // In production, hash this!
      purpose,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      attempts: 0,
      used: false
    };
    Store.set('otp_' + userId, record);
    return otp;
  },

  verify(userId, inputOtp) {
    const record = Store.get('otp_' + userId);
    if (!record) return { success: false, reason: 'No OTP found. Please request a new one.' };
    if (record.used) return { success: false, reason: 'OTP already used. Please request a new one.' };
    if (Date.now() > record.expiresAt) {
      Store.remove('otp_' + userId);
      return { success: false, reason: 'OTP has expired. Please request a new one.' };
    }
    if (record.attempts >= 5) {
      return { success: false, reason: 'Too many incorrect attempts. Please request a new OTP.' };
    }
    if (record.otp !== inputOtp) {
      record.attempts++;
      Store.set('otp_' + userId, record);
      const remaining = 5 - record.attempts;
      return { success: false, reason: `Invalid OTP. ${remaining} attempt(s) remaining.` };
    }
    record.used = true;
    Store.remove('otp_' + userId);
    RateLimiter.reset('otp_' + userId);
    return { success: true };
  },

  getTimeLeft(userId) {
    const record = Store.get('otp_' + userId);
    if (!record) return 0;
    return Math.max(0, Math.ceil((record.expiresAt - Date.now()) / 1000));
  },

  clear(userId) {
    Store.remove('otp_' + userId);
  }
};

// ---- Login Activity Logger ----
const LoginLog = {
  getAll() { return Store.get('login_logs') || []; },
  save(logs) { Store.set('login_logs', logs); },
  logLogin(user) {
    const logs = this.getAll();
    const entry = {
      id: generateId(),
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString(),
      userAgent: navigator.userAgent || 'Web Browser'
    };
    logs.unshift(entry);
    if (logs.length > 100) logs.pop();
    this.save(logs);
    return entry;
  }
};

// ---- Session Management ----
const Session = {
  set(user, token) {
    Store.set('session', { userId: user.id, token, role: user.role });
    LoginLog.logLogin(user);
  },
  get() {
    const s = Store.get('session');
    if (!s) return null;
    const payload = parseToken(s.token);
    if (!payload) { this.clear(); return null; }
    return s;
  },
  getCurrentUser() {
    const s = this.get();
    if (!s) return null;
    return UserDB.findById(s.userId);
  },
  clear() {
    Store.remove('session');
    Store.remove('pending_auth');
  },
  isLoggedIn() {
    return !!this.get();
  }
};

// ---- Cart Management ----
const Cart = {
  get() { return Store.get('cart') || []; },
  save(items) { Store.set('cart', items); updateCartBadge(); },

  add(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || product.stock === 0) return false;
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      items.push({ id: productId, qty });
    }
    this.save(items);
    return true;
  },

  remove(productId) {
    this.save(this.get().filter(i => i.id !== productId));
  },

  updateQty(productId, qty) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    if (qty <= 0) { this.remove(productId); return; }
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = Math.min(qty, product.stock); this.save(items); }
  },

  count() { return this.get().reduce((s, i) => s + i.qty, 0); },

  total() {
    return this.get().reduce((s, i) => {
      const p = PRODUCTS.find(pr => pr.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },

  clear() { this.save([]); }
};

// ---- Orders ----
const Orders = {
  getAll() { return Store.get('orders') || []; },
  save(orders) { Store.set('orders', orders); },

  create(userId, cartItems, address, paymentMethod) {
    const orders = this.getAll();
    const items = cartItems.map(ci => {
      const p = PRODUCTS.find(pr => pr.id === ci.id);
      return { id: ci.id, name: p.name, qty: ci.qty, price: p.price, image: p.image };
    });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: 'ORD-' + generateId().toUpperCase(),
      userId, items, total, address, paymentMethod,
      status: 'processing',
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    this.save(orders);
    return order;
  },

  getByUser(userId) {
    return this.getAll().filter(o => o.userId === userId);
  },

  updateStatus(orderId, status) {
    const orders = this.getAll();
    const o = orders.find(o => o.id === orderId);
    if (o) { o.status = status; this.save(orders); }
  }
};

// ==========================================
// Demo Data Seeding
// ==========================================
async function seedDemoData() {
  if (Store.get('seeded')) return;

  const demoUsers = [
    { username: 'admin', email: 'admin@securemart.com', mobile: '9999000001', password: 'Admin@123', role: 'admin' },
    { username: 'manager1', email: 'manager@securemart.com', mobile: '9999000002', password: 'Manager@123', role: 'manager' },
    { username: 'cashier1', email: 'cashier@securemart.com', mobile: '9999000003', password: 'Cashier@123', role: 'cashier' },
    { username: 'john_doe', email: 'john@example.com', mobile: '9876543210', password: 'Customer@123', role: 'customer' }
  ];

  for (const u of demoUsers) {
    try { await UserDB.create(u); } catch(e) { /* already exists */ }
  }

  // Demo orders
  const john = UserDB.findByEmail('john@example.com');
  if (john && Orders.getByUser(john.id).length === 0) {
    Orders.create(john.id, [
      { id: 1, qty: 2 }, { id: 3, qty: 1 }, { id: 14, qty: 1 }
    ], { line1: '12 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' }, 'card');
    const orders = Orders.getAll();
    if (orders.length > 0) {
      orders[0].status = 'delivered';
      Orders.save(orders);
    }
    Orders.create(john.id, [
      { id: 5, qty: 2 }, { id: 10, qty: 3 }
    ], { line1: '12 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' }, 'upi');
  }

  // Demo login activity logs
  if (LoginLog.getAll().length === 0) {
    const now = Date.now();
    const demoLogs = [
      {
        id: generateId(),
        userId: 'demo-admin',
        username: 'admin',
        email: 'admin@securemart.com',
        role: 'admin',
        loginTime: new Date(now - 12 * 60 * 1000).toISOString(),
        userAgent: 'Chrome on Windows 11'
      },
      {
        id: generateId(),
        userId: 'demo-john',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'customer',
        loginTime: new Date(now - 45 * 60 * 1000).toISOString(),
        userAgent: 'Safari on iPhone iOS 17'
      },
      {
        id: generateId(),
        userId: 'demo-cashier',
        username: 'cashier1',
        email: 'cashier@securemart.com',
        role: 'cashier',
        loginTime: new Date(now - 3 * 3600 * 1000).toISOString(),
        userAgent: 'Edge on Windows 10'
      }
    ];
    LoginLog.save(demoLogs);
  }

  Store.set('seeded', true);
}
