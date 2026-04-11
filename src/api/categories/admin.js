import { request } from '../core';

const adminCategoriesApi = {
  list: (params = {}) => {
    const { all, status, search } = params;
    const query = new URLSearchParams();

    // Legacy: `all=1` means include inactive categories.
    if (all) query.set('all', 1);
    if (status) query.set('status', status);
    if (search) query.set('search', search);

    const qs = query.toString();
    return request(`/categories${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

export default adminCategoriesApi;

