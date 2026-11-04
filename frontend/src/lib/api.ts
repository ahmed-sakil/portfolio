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

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // Distinguish network/CORS failure from standard API response errors
    if (err.name === 'TypeError' && err.message?.includes('fetch')) {
      throw new Error(
        `Cannot reach the backend server at "${API_BASE}". Please verify that your backend is running, VITE_API_URL is configured, and CORS allows your domain.`
      );
    }
    throw err;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}
