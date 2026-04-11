import { request, toCleanParams } from '../core';

export function blogs(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/blogs${q ? `?${q}` : ''}`);
}

export function blog(slug) {
  return request(`/blogs/${slug}`);
}

