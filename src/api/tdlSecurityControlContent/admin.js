import { request } from '../core';

const adminTdlSecurityControlContentApi = {
  get: () => request('/tdl-security-control-content'),
  create: (body) =>
    request('/tdl-security-control-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/tdl-security-control-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tdl-security-control-content', { method: 'DELETE' }),
};

export default adminTdlSecurityControlContentApi;

