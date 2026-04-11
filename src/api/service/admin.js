import { request, toCleanParams } from '../core';

const adminServicesApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    // Defensive: avoid sending literal "undefined" to backend
    if (clean.search === 'undefined') delete clean.search;
    if (clean.status === 'undefined') delete clean.status;
    if (clean.sortKey === 'undefined') delete clean.sortKey;
    if (clean.sortDirection === 'undefined') delete clean.sortDirection;

    const q = new URLSearchParams(clean).toString();
    return request(`/services?all=1${q ? `&${q}` : ''}`);
  },
  create: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/services/${id}`, { method: 'DELETE' }),
};

export default adminServicesApi;

