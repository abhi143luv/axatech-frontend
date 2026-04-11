import { request } from '../core';

export function enquiry(body) {
  return request('/enquiries', { method: 'POST', body: JSON.stringify(body) });
}

