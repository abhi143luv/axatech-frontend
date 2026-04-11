import { request } from '../core';

const adminIntegrationThirdPartyContentApi = {
  get: () => request('/integration-third-party-content'),
  create: (body) =>
    request('/integration-third-party-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/integration-third-party-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/integration-third-party-content', { method: 'DELETE' }),
};

export default adminIntegrationThirdPartyContentApi;

