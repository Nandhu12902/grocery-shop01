// ==========================================
// SecureMart Grocery - Auth Flows
// ==========================================

const Auth = {

  // ---- REGISTRATION ----
  async register(e) {
    e.preventDefault();
    clearAlert('register-alert');

    const username = $('#reg-username').value.trim();
    const email = $('#reg-email').value.trim();
    const mobile = $('#reg-mobile').value.trim();
    const password = $('#reg-password').value;
    const confirmPw = $('#reg-confirm-pw').value;
    const role = $('#reg-role')?.value || 'customer';

    // Validate
    let valid = true;
    valid = validateField($('#reg-username'), [Validators.username]) && valid;
    valid = validateField($('#reg-email'), [Validators.required, Validators.email]) && valid;
    if (mobile) valid = validateField($('#reg-mobile'), [Validators.mobile]) && valid;
    valid = validateField($('#reg-password'), [Validators.password]) && valid;

    if (password !== confirmPw) {
      showFieldError($('#reg-confirm-pw'), 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    const btn = $('#register-btn');
    setLoading(btn, true, 'Creating Account...');

    try {
      await UserDB.create({ username, email, mobile, password, role });
      showToast('Account created successfully! Please log in.', 'success');
      setTimeout(() => App.navigate('login'), 1500);
    } catch (err) {
      showAlert('register-alert', err.message, 'danger');
    } finally {
      setLoading(btn, false);
    }
  },

  // ---- LOGIN ----
  async login(e) {
    e.preventDefault();
    clearAlert('login-alert');

    const identifier = $('#login-identifier').value.trim();
    const password = $('#login-password').value;

    if (!identifier || !password) {
      showAlert('login-alert', 'Please enter your credentials.', 'warning');
      return;
    }

    // Rate limiting
    const rl = RateLimiter.check('login_' + identifier, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      showAlert('login-alert', rl.reason, 'danger');
      return;
    }

    const btn = $('#login-btn');
    setLoading(btn, true, 'Signing In...');

    try {
      await new Promise(r => setTimeout(r, 600)); // Simulate network delay

      const user = await UserDB.verifyPassword(identifier, password);
      if (!user) {
        showAlert('login-alert', 'Invalid credentials. Please check your username/email/mobile and password.', 'danger');
        return;
      }

      if (!user.isActive) {
        showAlert('login-alert', 'Your account has been deactivated. Please contact support.', 'danger');
        return;
      }

      // Store pending auth and proceed to OTP
      Store.set('pending_auth', { userId: user.id });
      RateLimiter.reset('login_' + identifier);
      Auth.sendOTP(user, 'login');

    } catch(err) {
      showAlert('login-alert', 'An error occurred. Please try again.', 'danger');
      console.error(err);
    } finally {
      setLoading(btn, false);
    }
  },

  // ---- SEND OTP ----
  sendOTP(user, purpose = 'login') {
    const otp = OTPStore.create(user.id, purpose);
    Store.set('otp_user_id', user.id);

    // DEMO: Display OTP (in production, send via SMS/Email)
    const demoOtp = Store.get('otp_' + user.id)?.otp;

    App.navigate('otp');
    setTimeout(() => {
      const otpDisplayEl = $('#otp-demo-display');
      if (otpDisplayEl) {
        otpDisplayEl.innerHTML = `
          <div class="demo-notice">
            ⚠️ <strong>DEMO MODE:</strong> In production, OTP is sent to <strong>${sanitizeHtml(user.email)}</strong>.
            For testing, your OTP is: <strong style="font-size:1.2rem;color:var(--primary-dark);letter-spacing:4px;">${demoOtp}</strong>
          </div>
        `;
      }

      const otpEmailEl = $('#otp-sent-to');
      if (otpEmailEl) {
        const masked = user.email.replace(/(?<=.{2}).(?=.*@)/g, '*');
        otpEmailEl.textContent = masked;
      }

      initOTPInputs('otp-form');
      clearOTPTimer();
      startOTPTimer(user.id, 'otp-countdown', () => {
        showAlert('otp-alert', 'OTP has expired. Please request a new one.', 'warning');
        const verifyBtn = $('#verify-otp-btn');
        if (verifyBtn) verifyBtn.disabled = true;
      });
    }, 100);
  },

  // ---- VERIFY OTP ----
  async verifyOTP(e) {
    e.preventDefault();
    clearAlert('otp-alert');

    const userId = Store.get('otp_user_id');
    if (!userId) {
      showAlert('otp-alert', 'Session expired. Please login again.', 'danger');
      setTimeout(() => App.navigate('login'), 2000);
      return;
    }

    // Rate limiting for OTP attempts
    const rl = RateLimiter.check('otp_' + userId, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      showAlert('otp-alert', rl.reason, 'danger');
      return;
    }

    const inputOtp = getOTPValue('otp-form');
    if (inputOtp.length !== 6) {
      showAlert('otp-alert', 'Please enter the complete 6-digit OTP.', 'warning');
      return;
    }

    const btn = $('#verify-otp-btn');
    setLoading(btn, true, 'Verifying...');

    try {
      await new Promise(r => setTimeout(r, 400));
      const result = OTPStore.verify(userId, inputOtp);

      if (!result.success) {
        showAlert('otp-alert', result.reason, 'danger');
        return;
      }

      // SUCCESS
      clearOTPTimer();
      showAlert('otp-alert', '✅ OTP verified successfully! Logging you in...', 'success');

      const user = UserDB.findById(userId);
      const token = generateToken(userId);
      Session.set(user, token);
      Store.remove('pending_auth');
      Store.remove('otp_user_id');
      RateLimiter.reset('otp_' + userId);
      RateLimiter.reset('login_' + user.email);

      setTimeout(() => {
        updateNavbar();
        updateCartBadge();
        showToast(`Welcome back, ${user.username}! 🎉`, 'success');

        // Route based on role
        const dashboard = ['cashier', 'manager', 'admin'].includes(user.role);
        App.navigate(user.role === 'admin' ? 'admin' : dashboard ? 'employee' : 'home');
      }, 1200);

    } finally {
      setLoading(btn, false);
    }
  },

  // ---- RESEND OTP ----
  resendOTP() {
    const userId = Store.get('otp_user_id');
    if (!userId) {
      showAlert('otp-alert', 'Session expired. Please login again.', 'danger');
      setTimeout(() => App.navigate('login'), 2000);
      return;
    }

    const rl = RateLimiter.check('resend_otp_' + userId, 3, 10 * 60 * 1000);
    if (!rl.allowed) {
      showAlert('otp-alert', 'Too many resend attempts. Please wait before trying again.', 'danger');
      return;
    }

    const user = UserDB.findById(userId);
    if (!user) return;

    clearOTPInputs('otp-form');
    clearAlert('otp-alert');

    const otp = OTPStore.create(userId, 'login');
    const record = Store.get('otp_' + userId);

    const otpDisplayEl = $('#otp-demo-display');
    if (otpDisplayEl) {
      otpDisplayEl.innerHTML = `
        <div class="demo-notice">
          ⚠️ <strong>DEMO MODE:</strong> New OTP sent to <strong>${sanitizeHtml(user.email)}</strong>.
          Your OTP is: <strong style="font-size:1.2rem;color:var(--primary-dark);letter-spacing:4px;">${record?.otp}</strong>
        </div>
      `;
    }

    const verifyBtn = $('#verify-otp-btn');
    if (verifyBtn) verifyBtn.disabled = false;

    startOTPTimer(userId, 'otp-countdown', () => {
      showAlert('otp-alert', 'OTP has expired. Please request a new one.', 'warning');
      if (verifyBtn) verifyBtn.disabled = true;
    });

    showToast('New OTP has been generated!', 'info');
  },

  // ---- LOGOUT ----
  logout() {
    const user = Session.getCurrentUser();
    clearOTPTimer();
    Session.clear();
    Cart.clear();
    updateNavbar();
    updateCartBadge();
    showToast('You have been logged out successfully.', 'info');
    App.navigate('home');
    Pages.renderHome();
  },

  // ---- FORGOT PASSWORD ----
  async forgotPassword(e) {
    e.preventDefault();
    clearAlert('forgot-alert');

    const identifier = $('#forgot-identifier').value.trim();
    if (!identifier) {
      showAlert('forgot-alert', 'Please enter your email or mobile number.', 'warning');
      return;
    }

    const btn = $('#forgot-btn');
    setLoading(btn, true, 'Sending...');

    await new Promise(r => setTimeout(r, 700));

    const user = UserDB.findByIdentifier(identifier);
    // Always show success to prevent user enumeration
    showAlert('forgot-alert', 
      'If an account exists with that email/mobile, a password reset OTP has been sent. Check the demo display below.',
      'success');

    if (user) {
      Store.set('reset_user_id', user.id);
      const otp = OTPStore.create(user.id, 'reset');
      const record = Store.get('otp_' + user.id);

      const demoEl = $('#forgot-demo');
      if (demoEl) {
        demoEl.innerHTML = `
          <div class="demo-notice" style="margin-top:12px;">
            ⚠️ <strong>DEMO MODE:</strong> Reset OTP for <strong>${sanitizeHtml(user.email)}</strong>:
            <strong style="font-size:1.2rem;color:var(--primary-dark);letter-spacing:4px;">${record?.otp}</strong>
          </div>
          <button class="btn-primary" style="margin-top:12px;" onclick="App.navigate('reset-password')">
            Enter OTP & Reset Password →
          </button>
        `;
      }
    }

    setLoading(btn, false);
  },

  // ---- RESET PASSWORD ----
  async resetPassword(e) {
    e.preventDefault();
    clearAlert('reset-alert');

    const userId = Store.get('reset_user_id');
    if (!userId) {
      showAlert('reset-alert', 'Session expired. Please start the password reset process again.', 'danger');
      return;
    }

    const otp = getOTPValue('reset-otp-form');
    const newPassword = $('#reset-new-pw').value;
    const confirmPw = $('#reset-confirm-pw').value;

    if (otp.length !== 6) {
      showAlert('reset-alert', 'Please enter the 6-digit OTP.', 'warning');
      return;
    }

    if (!validateField($('#reset-new-pw'), [Validators.password])) return;

    if (newPassword !== confirmPw) {
      showFieldError($('#reset-confirm-pw'), 'Passwords do not match.');
      return;
    }

    const btn = $('#reset-btn');
    setLoading(btn, true, 'Resetting...');

    try {
      await new Promise(r => setTimeout(r, 400));
      const result = OTPStore.verify(userId, otp);

      if (!result.success) {
        showAlert('reset-alert', result.reason, 'danger');
        return;
      }

      const hash = await hashPassword(newPassword);
      UserDB.update(userId, { passwordHash: hash });
      Store.remove('reset_user_id');

      showAlert('reset-alert', 'Password reset successfully! You can now login with your new password.', 'success');
      showToast('Password reset successful! Please login.', 'success');
      setTimeout(() => App.navigate('login'), 2000);

    } finally {
      setLoading(btn, false);
    }
  }
};
