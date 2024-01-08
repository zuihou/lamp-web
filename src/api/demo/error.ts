import { defHttp } from '/@/utils/http/axios';
import { MOCK_API_URL } from '/@/settings/siteSetting';

enum Api {
  // The address does not exist
  Error = '/error',
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => defHttp.get({ url: Api.Error }, { apiUrl: MOCK_API_URL });
