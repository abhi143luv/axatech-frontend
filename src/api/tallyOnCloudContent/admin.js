import { request } from '../core';

const adminTallyOnCloudContentApi = {
  get: () => request('/tally-on-cloud-content'),
  create: (body) =>
    request('/tally-on-cloud-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/tally-on-cloud-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/tally-on-cloud-content', { method: 'DELETE' }),
};

export default adminTallyOnCloudContentApi;

