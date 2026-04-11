import { request } from '../core';

export function cloud(type) {
  return request(`/cloud${type ? `?type=${type}` : ''}`);
}

