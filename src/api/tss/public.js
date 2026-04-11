import { request } from '../core';

export function tss(type) {
  return request(`/tss${type ? `?type=${type}` : ''}`);
}

