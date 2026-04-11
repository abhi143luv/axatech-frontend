import { request, toCleanParams } from '../core';

const adminCloudApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    // Defensive: avoid sending literal "undefined" query values.
    if (clean.search === 'undefined') delete clean.search;
    if (clean.status === 'undefined') delete clean.status;
    if (clean.type === 'undefined') delete clean.type;
    if (clean.sortKey === 'undefined') delete clean.sortKey;
    if (clean.sortDirection === 'undefined') delete clean.sortDirection;

    const q = new URLSearchParams(clean).toString();
    return request(`/cloud?all=1${q ? `&${q}` : ''}`);
  },
  create: (body) => request('/cloud', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/cloud/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/cloud/${id}`, { method: 'DELETE' }),
};

export default adminCloudApi;

