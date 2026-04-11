import { request } from '../core';

export function tssContent() {
  return request('/tss-content');
}

