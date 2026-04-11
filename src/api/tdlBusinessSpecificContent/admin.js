import { request } from '../core';

const adminTdlBusinessSpecificContentApi = {
  get: () => request('/tdl-business-specific-content'),
  create: (body) =>
    request('/tdl-business-specific-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/tdl-business-specific-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tdl-business-specific-content', { method: 'DELETE' }),
};

export default adminTdlBusinessSpecificContentApi;

