import { request } from '../core';

const tdlMisReportingContentPublicApi = {
  get: () => request('/tdl-mis-reporting-content'),
};

export default tdlMisReportingContentPublicApi;

