import { request } from '../core';

const adminTdlProductivityContentApi = {
  get: () => request('/tdl-productivity-content'),
  create: (body) =>
    request('/tdl-productivity-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/tdl-productivity-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tdl-productivity-content', { method: 'DELETE' }),
};

export default adminTdlProductivityContentApi;

