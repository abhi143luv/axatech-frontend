import { request } from '../core';

const adminTssApi = {
  list: (params = {}) => {
    const {
      type,
      status,
      all,
      page,
      limit,
      search,
      sortKey,
      sortDirection,
    } = params;

    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (status == null && all) query.set('all', 1);
    if (type) query.set('type', type);
    if (page !== undefined && page !== null) query.set('page', page);
    if (limit !== undefined && limit !== null) query.set('limit', limit);
    if (search) query.set('search', search);
    if (sortKey) query.set('sortKey', sortKey);
    if (sortDirection) query.set('sortDirection', sortDirection);

    const qs = query.toString();
    return request(`/tss${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/tss', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/tss/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/tss/${id}`, { method: 'DELETE' }),
};

export default adminTssApi;

