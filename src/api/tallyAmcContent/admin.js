import { request } from '../core';

const adminTallyAmcContentApi = {
  get: () => request('/tally-amc-content'),
  create: (body) => request('/tally-amc-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) => request('/tally-amc-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tally-amc-content', { method: 'DELETE' }),
};

export default adminTallyAmcContentApi;

