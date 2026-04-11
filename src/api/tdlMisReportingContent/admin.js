import { request } from '../core';

const adminTdlMisReportingContentApi = {
  get: () => request('/tdl-mis-reporting-content'),
  create: (body) =>
    request('/tdl-mis-reporting-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/tdl-mis-reporting-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tdl-mis-reporting-content', { method: 'DELETE' }),
};

export default adminTdlMisReportingContentApi;

