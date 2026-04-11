import { request } from '../core';

const tallyBusinessSolutionsContentPublicApi = {
  get: () => request('/tally-business-solutions-content'),
};

export default tallyBusinessSolutionsContentPublicApi;

