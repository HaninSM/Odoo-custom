/**
 * API client wrapper for the POS system.
 * Handles JWT token attachment, response parsing, and error handling.
 */
const API = {
  baseUrl: '',

  getToken() {
    return localStorage.getItem('pos_token');
  },

  getUser() {
    const user = localStorage.getItem('pos_user');
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    window.location.href = '/';
  },

  async request(method, url, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);

    const response = await fetch(this.baseUrl + url, opts);

    // Handle 401 - redirect to login
    if (response.status === 401) {
      this.logout();
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error ${response.status}`);
    }
    return data;
  },

  get(url) { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); },
  put(url, body) { return this.request('PUT', url, body); },
  delete(url) { return this.request('DELETE', url); }
};
