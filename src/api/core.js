// In production use backend URL + /api; locally Vite proxies /api to the server
const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
export const API_BASE = base ? `${base}/api` : '/api';

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

export function formRequest(path, method, formData) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${API_BASE}${path}`, { method, headers, body: formData }).then((res) =>
    res
      .json()
      .then((data) => {
        if (!res.ok) throw new Error(data.message || res.statusText);
        return data;
      })
      .catch(() => {
        if (!res.ok) throw new Error(res.statusText);
        return {};
      })
  );
}

export function toCleanParams(params) {
  return params &&
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
}
