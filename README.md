# 🛒 SecureMart Grocery

A modern, fully-featured grocery shopping website with secure OTP-based two-factor authentication (MFA).

## 🚀 Quick Start

1. Open `index.html` in any modern web browser — **no server required!**
2. Use the demo accounts below to explore all features.

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@securemart.com | Admin@123 |
| **Manager** | manager@securemart.com | Manager@123 |
| **Cashier** | cashier@securemart.com | Cashier@123 |
| **Customer** | john@example.com | Customer@123 |

> **OTP Note:** Since this is a demo, the OTP is displayed on-screen after login. In production, it would be sent via Email/SMS.

---

## ✨ Features

### 🛍️ Shopping
- 15 grocery products across 9 categories
- Product cards with images, pricing, stock status, quantity selectors
- Full product detail page with ratings and description
- Shopping cart with real-time totals, delivery calculation, and GST
- Complete checkout with address and payment method selection
- Order tracking with status updates

### 🔐 Authentication & Security
- User registration with strong password validation
- Login via email / username / mobile number
- **OTP-based Two-Factor Authentication (MFA)** — 6-digit OTP, 5-minute expiry
- OTP is single-use and invalidated after verification
- Resend OTP with rate limiting (3 resends per 10 minutes)
- Max 5 OTP attempts before lockout
- Forgot password → OTP verification → Reset password flow
- Password hashing using SHA-256 (via WebCrypto API) with salt
- JWT-like session tokens with 24-hour expiry
- Rate limiting on login (5 attempts / 15 minutes) and OTP endpoints
- Passwords never stored in plain text

### 👥 User Roles
| Role | Access |
|------|--------|
| Customer | Shop, Cart, Checkout, Orders, Profile |
| Cashier | All customer pages + Employee Dashboard |
| Manager | All cashier pages + order management |
| Admin | Everything + User management, Admin Dashboard |

### 👥 Management & Monitoring ("Who is Logged In" & "Who Ordered")
- **Live Active Session Monitoring**: The Admin Dashboard features a dedicated **"Who is Logged In"** tab that indicates the currently active user and a complete timestamped log of all user logins, usernames, emails, and roles.
- **Grocery Orders & Buyers Overview**: Direct view of who ordered groceries, their registered name, email, contact number, delivery address, ordered items with quantities, payment method, and real-time status management.

### 📱 Pages (14 total)
1. **Home** — Hero, categories, featured products, features section
2. **Products** — Full catalog with search, category filter, sort
3. **Product Detail** — Image, description, ratings, add to cart
4. **Cart** — Items, quantities, summary, delivery/tax calculation
5. **Checkout** — Address form, payment methods, order placement
6. **Login** — Multi-identifier login (email/username/mobile)
7. **Register** — Full registration with validation
8. **OTP Verification** — 6-box OTP entry with countdown timer
9. **Forgot Password** — Identify account for reset
10. **Reset Password** — OTP + new password entry
11. **User Profile** — Edit info, change password, MFA status, orders
12. **Orders** — Order history with status
13. **Employee Dashboard** — Stats, order management, inventory view
14. **Admin Dashboard** — Active session ("Who is Logged In"), grocery buyers & orders ("Who Ordered"), user role management, and inventory overview

---

## 🏗️ File Structure

```
SecureMart/
├── index.html          # Main SPA with all page HTML
├── css/
│   └── style.css       # Full responsive stylesheet (green & white theme)
└── js/
    ├── data.js         # Products, data models, auth, OTP, cart, orders
    ├── ui.js           # UI components, toasts, OTP inputs, form validation
    ├── pages.js        # Page rendering functions
    ├── auth.js         # Authentication flows (login, OTP, register, reset)
    └── app.js          # Router, navigation, app initialization
```

---

## 🔒 Security Implementation

| Feature | Implementation |
|---------|----------------|
| Password Storage | SHA-256 hash + app salt via WebCrypto API |
| OTP Generation | Cryptographically random 6-digit number |
| OTP Storage | Marked as single-use; cleared after verification |
| Session Tokens | Base64-encoded payload with expiry timestamp |
| Rate Limiting | Attempt tracking per user in localStorage |
| OTP Expiry | 5 minutes from generation |
| Max OTP Attempts | 5 attempts then locked |
| Input Sanitization | `createTextNode` sanitization prevents XSS |

> **Note:** This is a client-side demo. In a production system, use a real backend, a proper database, HTTPS, and a real SMS/email OTP delivery service.

---

## 🎨 Design

- **Color Scheme:** Green (`#2e7d32`) and white
- **Typography:** System font stack (Segoe UI)
- **Layout:** Responsive grid — works on mobile, tablet, and desktop
- **Components:** Product cards, OTP inputs, toast notifications, modals, data tables

---

## 📸 Image Credits

Product images sourced from [Unsplash](https://unsplash.com) under the Unsplash License (free for commercial and non-commercial use, no attribution required but appreciated).
