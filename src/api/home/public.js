import { request } from '../core';

export function home() {
  return request('/home');
}

