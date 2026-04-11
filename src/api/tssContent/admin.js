import { request } from '../core';

const adminTssContentApi = {
  get: () => request('/tss-content'),
  update: (body) => request('/tss-content', { method: 'PUT', body: JSON.stringify(body) }),
};

export default adminTssContentApi;

