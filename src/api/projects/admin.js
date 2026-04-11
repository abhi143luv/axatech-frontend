import { request, toCleanParams } from '../core';

const adminProjectsApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    // Defensive: avoid sending the literal "undefined" string to the backend.
    if (clean.search === 'undefined') delete clean.search;
    const q = new URLSearchParams(clean).toString();
    return request(`/projects?all=1${q ? `&${q}` : ''}`);
  },
  create: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  deleteBulk: (ids) =>
    request('/projects/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
};

export default adminProjectsApi;

