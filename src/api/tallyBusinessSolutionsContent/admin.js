import { request } from '../core';

const adminTallyBusinessSolutionsContentApi = {
  get: () => request('/tally-business-solutions-content'),
  create: (body) =>
    request('/tally-business-solutions-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/tally-business-solutions-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tally-business-solutions-content', { method: 'DELETE' }),
};

export default adminTallyBusinessSolutionsContentApi;

