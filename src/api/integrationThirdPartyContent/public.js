import { request } from '../core';

const integrationThirdPartyContentPublicApi = {
  get: () => request('/integration-third-party-content'),
};

export default integrationThirdPartyContentPublicApi;

