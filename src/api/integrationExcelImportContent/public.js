import { request } from '../core';

const integrationExcelImportContentPublicApi = {
  get: () => request('/integration-excel-import-content'),
};

export default integrationExcelImportContentPublicApi;

