import { request, toCleanParams } from '../core';

const adminHomeLogoLoopApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    const q = new URLSearchParams(clean).toString();
    return request(`/home-logo-loop?all=1${q ? `&${q}` : ''}`);
  },
  create: (body) => request('/home-logo-loop', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/home-logo-loop/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/home-logo-loop/${id}`, { method: 'DELETE' }),
  deleteBulk: (ids) =>
    request('/home-logo-loop/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
};

export default adminHomeLogoLoopApi;
