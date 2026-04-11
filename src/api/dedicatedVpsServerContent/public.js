import { request } from '../core';

const dedicatedVpsServerContentPublicApi = {
  get: () => request('/dedicated-vps-server-content'),
};

export default dedicatedVpsServerContentPublicApi;

