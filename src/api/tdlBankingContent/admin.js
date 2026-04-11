import { request } from '../core';

const adminTdlBankingContentApi = {
  get: () => request('/tdl-banking-content'),
  create: (body) => request('/tdl-banking-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) => request('/tdl-banking-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tdl-banking-content', { method: 'DELETE' }),
};

export default adminTdlBankingContentApi;

