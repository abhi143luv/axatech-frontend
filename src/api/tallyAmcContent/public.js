import { request } from '../core';

const tallyAmcContentPublicApi = {
  get: () => request('/tally-amc-content'),
};

export default tallyAmcContentPublicApi;

