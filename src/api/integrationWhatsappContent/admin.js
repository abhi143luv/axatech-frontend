import { request } from '../core';

const adminIntegrationWhatsappContentApi = {
  get: () => request('/integration-whatsapp-content'),
  create: (body) =>
    request('/integration-whatsapp-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/integration-whatsapp-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/integration-whatsapp-content', { method: 'DELETE' }),
};

export default adminIntegrationWhatsappContentApi;

