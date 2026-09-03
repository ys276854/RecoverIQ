const TOKEN_KEY = 'rzp_leak_radar_token';
const USER_KEY = 'rzp_leak_radar_user';

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(token, user, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  async login(email, password, remember = false) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember_me: remember })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Authentication failed');
    }
    this.setSession(data.token, data.user, remember);
    return data;
  },

  async loginAsDemo() {
    return this.login('demo@acmecommerce.in', 'demo123', true);
  },

  async signup(signupData) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Account creation failed');
    }
    this.setSession(data.token, data.user, true);
    return data;
  },

  async completeOnboarding(onboardingData) {
    const token = this.getToken();
    const res = await fetch('/api/auth/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(onboardingData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Onboarding failed');
    }
    const user = this.getUser() || {};
    user.onboarded = true;
    user.business_name = onboardingData.business_name;
    this.setSession(token, user, true);
    return data;
  },

  async fetchCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        this.clearSession();
        return null;
      }
      const data = await res.json();
      this.setSession(token, data.user, true);
      return data.user;
    } catch (e) {
      return null;
    }
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {}
    }
    this.clearSession();
  }
};
