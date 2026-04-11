import { createPublicApi } from './public';
import { createAdminApi } from './admin';

export const api = {
  ...createPublicApi(),
  admin: createAdminApi(),
};

export default api;
