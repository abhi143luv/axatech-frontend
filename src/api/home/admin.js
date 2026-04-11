import { request } from '../core';

const adminHomeApi = {
  get: () => request('/home'),
  update: (body) => request('/home', { method: 'PUT', body: JSON.stringify(body) }),
};

export default adminHomeApi;

