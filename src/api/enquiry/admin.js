import { request, toCleanParams } from '../core';

const adminEnquiryApi = {
  list: (params = {}) => {
    const clean = toCleanParams(params) || {};
    // Defensive: avoid sending literal "undefined" query values.
    if (clean.search === 'undefined') delete clean.search;
    if (clean.status === 'undefined') delete clean.status;
    if (clean.type === 'undefined') delete clean.type;
    if (clean.page === 'undefined') delete clean.page;
    if (clean.limit === 'undefined') delete clean.limit;
    if (clean.search === 'null') delete clean.search;

    const q = new URLSearchParams(clean).toString();
    return request(`/enquiries${q ? `?${q}` : ''}`);
  },
  get: (id) => request(`/enquiries/${id}`),
  updateStatus: (id, body) =>
    request(`/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
};

export default adminEnquiryApi;

