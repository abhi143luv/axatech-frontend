import { request } from '../core';

const tdlSecurityControlContentPublicApi = {
  get: () => request('/tdl-security-control-content'),
};

export default tdlSecurityControlContentPublicApi;

