import { request, toCleanParams } from '../core';

export function technologies(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/technologies${q ? `?${q}` : ''}`);
}

export function technology(slug) {
  return request(`/technologies/${slug}`);
}

