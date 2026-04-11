import { request } from '../core';

const tdlBusinessSpecificContentPublicApi = {
  get: () => request('/tdl-business-specific-content'),
};

export default tdlBusinessSpecificContentPublicApi;

