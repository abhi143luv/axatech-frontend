import { request } from '../core';

const tdlProductivityContentPublicApi = {
  get: () => request('/tdl-productivity-content'),
};

export default tdlProductivityContentPublicApi;

