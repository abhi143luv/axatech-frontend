import { request, toCleanParams } from '../core';

export function projects(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/projects${q ? `?${q}` : ''}`);
}

export function project(slug) {
  return request(`/projects/${slug}`);
}

