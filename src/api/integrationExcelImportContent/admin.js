import { request } from '../core';

const adminIntegrationExcelImportContentApi = {
  get: () => request('/integration-excel-import-content'),
  create: (body) =>
    request('/integration-excel-import-content', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) =>
    request('/integration-excel-import-content', { method: 'PUT', body: JSON.stringify(body) }),
  remove: () => request('/integration-excel-import-content', { method: 'DELETE' }),
};

export default adminIntegrationExcelImportContentApi;

