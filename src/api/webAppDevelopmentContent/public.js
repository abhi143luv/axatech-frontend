import { request } from '../core';

const webAppDevelopmentContentPublicApi = {
  get: () => request('/web-app-development-content'),
};

export default webAppDevelopmentContentPublicApi;

