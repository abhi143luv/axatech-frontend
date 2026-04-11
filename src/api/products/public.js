import { request, toCleanParams } from '../core';

export function products(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/products${q ? `?${q}` : ''}`);
}

export function product(slug) {
  return request(`/products/${slug}`);
}

