import { apiFetch } from './api';

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
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember_me: remember })
    });
    this.setSession(data.token, data.user, remember);
    return data;
  },

  async loginAsDemo() {
    return this.login('demo@acmecommerce.in', 'demo123', true);
  },

  async signup(signupData) {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });
    this.setSession(data.token, data.user, true);
    return data;
  },

  async completeOnboarding(onboardingData) {
    const token = this.getToken();
    const data = await apiFetch('/api/auth/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(onboardingData)
    });
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
      const data = await apiFetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      this.setSession(token, data.user, true);
      return data.user;
    } catch (e) {
      this.clearSession();
      return null;
    }
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await apiFetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {}
    }
    this.clearSession();
  }
};
