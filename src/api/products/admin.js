import { request } from '../core';

const adminProductsApi = {
  list: (params = {}) => {
    const {
      category,
      featured,
      status,
      search,
      page,
      limit,
      sortKey,
      sortDirection,
      all,
    } = params;

    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (featured != null) query.set('featured', featured);
    if (status) query.set('status', status);
    if (search) query.set('search', search);
    if (page !== undefined && page !== null) query.set('page', page);
    if (limit !== undefined && limit !== null) query.set('limit', limit);
    if (sortKey) query.set('sortKey', sortKey);
    if (sortDirection) query.set('sortDirection', sortDirection);
    if (status == null && all) query.set('all', 1);

    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  deleteBulk: (ids) =>
    request('/products/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
};

export default adminProductsApi;

