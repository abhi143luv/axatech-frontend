import { request } from '../core';

const tdlInvoiceContentPublicApi = {
  get: () => request('/tdl-invoice-content'),
};

export default tdlInvoiceContentPublicApi;

