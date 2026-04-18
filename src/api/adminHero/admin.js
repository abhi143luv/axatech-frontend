import { request, toCleanParams } from '../core';

const adminHeroBannersApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    const q = new URLSearchParams(clean).toString();
    return request(`/admin-hero-banners?all=1${q ? `&${q}` : ''}`);
  },
  create: (body) => request('/admin-hero-banners', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/admin-hero-banners/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/admin-hero-banners/${id}`, { method: 'DELETE' }),
  deleteBulk: (ids) =>
    request('/admin-hero-banners/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
};

export default adminHeroBannersApi;
