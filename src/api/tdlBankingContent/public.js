import { request } from '../core';

const tdlBankingContentPublicApi = {
  get: () => request('/tdl-banking-content'),
};

export default tdlBankingContentPublicApi;

