const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) => request<T>(endpoint, { method: 'GET', token }),
  post: <T>(endpoint: string, body: any, token?: string) => 
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), token }),
  put: <T>(endpoint: string, body: any, token?: string) => 
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), token }),
  delete: <T>(endpoint: string, token?: string) => 
    request<T>(endpoint, { method: 'DELETE', token }),
};