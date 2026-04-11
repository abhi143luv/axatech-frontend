import { request } from '../core';

const adminIntegrationSmsApiContentApi = {
  get: () => request('/integration-sms-api-content'),
  create: (body) =>
    request('/integration-sms-api-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/integration-sms-api-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/integration-sms-api-content', { method: 'DELETE' }),
};

export default adminIntegrationSmsApiContentApi;

