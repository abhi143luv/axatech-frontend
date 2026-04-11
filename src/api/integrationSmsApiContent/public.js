import { request } from '../core';

const integrationSmsApiContentPublicApi = {
  get: () => request('/integration-sms-api-content'),
};

export default integrationSmsApiContentPublicApi;

