import { request } from '../core';

const integrationWhatsappContentPublicApi = {
  get: () => request('/integration-whatsapp-content'),
};

export default integrationWhatsappContentPublicApi;

