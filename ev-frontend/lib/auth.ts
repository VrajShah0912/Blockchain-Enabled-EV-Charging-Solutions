import { api } from './api';

export const authService = {
  async login(email: string, password: string, isAdmin = false) {
    return api.post<{ token: string; user: any }>('/auth/login', { email, password, isAdmin });
  },

  async register(name: string, email: string, password: string, passwordConfirm: string) {
    return api.post('/auth/signup', { name, email, password, passwordConfirm });
  },

  async getCurrentUser(token: string) {
    return api.get('/users/me', token);
  },

  logout() {
    // Clear token from storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  storeToken(token: string, remember: boolean) {
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
};