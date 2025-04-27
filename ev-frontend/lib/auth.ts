import apiClient from './api';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string, isAdmin = false): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', { email, password, isAdmin });
  return response.data;
};

export const register = async (name: string, email: string, password: string, passwordConfirm: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/signup', { name, email, password, passwordConfirm });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const storeToken = (token: string, remember: boolean): void => {
  const expires = remember ? { expires: 90 } : undefined;
  Cookies.set('token', token, expires);
};

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const logout = (): void => {
  Cookies.remove('token');
};