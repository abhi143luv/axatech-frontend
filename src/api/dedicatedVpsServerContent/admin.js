import { request } from '../core';

const adminDedicatedVpsServerContentApi = {
  get: () => request('/dedicated-vps-server-content'),
  create: (body) =>
    request('/dedicated-vps-server-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/dedicated-vps-server-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/dedicated-vps-server-content', { method: 'DELETE' }),
};

export default adminDedicatedVpsServerContentApi;

