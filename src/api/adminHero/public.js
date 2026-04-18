import { request, toCleanParams } from '../core';

/** Public list: active banners by default (same query shape as home logo loop). */
export function adminHeroBanners(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/admin-hero-banners${q ? `?${q}` : ''}`);
}
