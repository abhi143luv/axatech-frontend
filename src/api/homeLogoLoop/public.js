import { request, toCleanParams } from '../core';

export function homeLogoLoop(params) {
  const clean = toCleanParams(params) || {};
  const q = new URLSearchParams(clean).toString();
  return request(`/home-logo-loop${q ? `?${q}` : ''}`);
}
