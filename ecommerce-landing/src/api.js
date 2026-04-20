const BASE = 'http://localhost:8000/api/v1';

function getToken() { return localStorage.getItem('access_token'); }

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${getToken()}`;
      const retry = await fetch(`${BASE}${path}`, { ...options, headers });
      if (!retry.ok) throw new Error(await retry.text());
      return retry.status === 204 ? null : retry.json();
    }
    localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth:logout'));
    throw new Error('Sessão expirada.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || Object.values(body).flat().join(' ') || `Erro ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE}/auth/token/refresh/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh }) });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
    return true;
  } catch { return false; }
}

export const auth = {
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: async (data) => {
    const res = await request('/auth/login/', { method: 'POST', body: JSON.stringify(data) });
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('refresh_token', res.refresh);
    return res;
  },
  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    try { await request('/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }); }
    finally { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); }
  },
  me: () => request('/auth/me/'),
};

export const catalog = {
  products: (params = '') => request(`/catalog/products/${params}`),
  product: (slug) => request(`/catalog/products/${slug}/`),
  featured: () => request('/catalog/products/featured/'),
  categories: () => request('/catalog/categories/'),
};

export const cart = {
  get: () => request('/cart/'),
  add: (product_id, quantity = 1) => request('/cart/add/', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  updateItem: (id, quantity) => request(`/cart/items/${id}/`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeItem: (id) => request(`/cart/items/${id}/`, { method: 'DELETE' }),
  clear: () => request('/cart/clear/', { method: 'DELETE' }),
};

export const orders = {
  create: (data) => request('/orders/', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/orders/'),
  detail: (id) => request(`/orders/${id}/`),
  cancel: (id) => request(`/orders/${id}/cancel/`, { method: 'POST' }),
};
