import { request } from '../core';

const adminLicensesApi = {
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
    // Legacy: if `all` is missing/false => returns only active plans
    if (status == null && all) query.set('all', 1);
    if (type) query.set('type', type);
    if (page !== undefined && page !== null) query.set('page', page);
    if (limit !== undefined && limit !== null) query.set('limit', limit);
    if (search) query.set('search', search);
    if (sortKey) query.set('sortKey', sortKey);
    if (sortDirection) query.set('sortDirection', sortDirection);

    const qs = query.toString();
    return request(`/licenses${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/licenses', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/licenses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/licenses/${id}`, { method: 'DELETE' }),
};

export default adminLicensesApi;

