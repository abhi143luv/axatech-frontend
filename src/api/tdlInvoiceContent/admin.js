import { request } from '../core';

const adminTdlInvoiceContentApi = {
  get: () => request('/tdl-invoice-content'),
  create: (body) => request('/tdl-invoice-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) => request('/tdl-invoice-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tdl-invoice-content', { method: 'DELETE' }),
};

export default adminTdlInvoiceContentApi;

