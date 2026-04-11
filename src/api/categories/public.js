import { request } from '../core';

export function categories() {
  return request('/categories');
}

