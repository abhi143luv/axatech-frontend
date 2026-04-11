import { request } from '../core';

export function licenses(type) {
  return request(`/licenses${type ? `?type=${type}` : ''}`);
}

