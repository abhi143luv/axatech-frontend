import { request } from '../core';

const tallyOnCloudContentPublicApi = {
  get: () => request('/tally-on-cloud-content'),
};

export default tallyOnCloudContentPublicApi;

