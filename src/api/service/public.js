import { request, toCleanParams } from '../core';

export function services(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/services${q ? `?${q}` : ''}`);
}

export function service(slug) {
  return request(`/services/${slug}`);
}

