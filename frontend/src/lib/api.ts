const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('portfolio_admin_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData (e.g. file uploads) by omitting explicit Content-Type
  if (options?.body instanceof FormData) {
    delete (headers as any)['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}
