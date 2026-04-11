import { request, toCleanParams } from '../core';

const adminTechnologiesApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    // Defensive: avoid sending literal "undefined" query values.
    if (clean.search === 'undefined') delete clean.search;
    if (clean.category === 'undefined') delete clean.category;
    if (clean.status === 'undefined') delete clean.status;
    if (clean.sortKey === 'undefined') delete clean.sortKey;
    if (clean.sortDirection === 'undefined') delete clean.sortDirection;

    const q = new URLSearchParams(clean).toString();
    return request(`/technologies?all=1${q ? `&${q}` : ''}`);
  },
  create: (body) => request('/technologies', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/technologies/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/technologies/${id}`, { method: 'DELETE' }),
};

export default adminTechnologiesApi;

