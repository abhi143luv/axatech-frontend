import { request } from '../core';

const adminWebAppDevelopmentContentApi = {
  get: () => request('/web-app-development-content'),
  create: (body) =>
    request('/web-app-development-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/web-app-development-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/web-app-development-content', { method: 'DELETE' }),
};

export default adminWebAppDevelopmentContentApi;

