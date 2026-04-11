import { request, toCleanParams } from '../core';

const adminBlogsApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    // Defensive: avoid sending literal "undefined" query values.
    if (clean.search === 'undefined') delete clean.search;
    if (clean.status === 'undefined') delete clean.status;
    if (clean.sortKey === 'undefined') delete clean.sortKey;
    if (clean.sortDirection === 'undefined') delete clean.sortDirection;
    if (clean.page === 'undefined') delete clean.page;
    if (clean.limit === 'undefined') delete clean.limit;

    const q = new URLSearchParams(clean).toString();
    return request(`/blogs?all=1${q ? `&${q}` : ''}`);
  },
  get: (slug) => request(`/blogs/${slug}`),
  create: (body) => request('/blogs', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/blogs/${id}`, { method: 'DELETE' }),
};

export default adminBlogsApi;

