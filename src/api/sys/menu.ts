import { defHttp } from '/@/utils/http/axios';
import {
  getMenuListByIdParams,
  getMenuListResultModel,
  VisibleResourceVO,
} from './model/menuModel';

enum Api {
  GetMenuList = '/oauth/anyone/visible/router',
  GetResourceByUserId = '/oauth/anyone/visible/resource',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (params?: getMenuListByIdParams) => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList, params });
};

/**
 * 根据
 * @param params
 */
export function getResourceByUserId(applicationId: string) {
  return defHttp.get<VisibleResourceVO>({
    url: Api.GetResourceByUserId,
    params: { applicationId },
  });
}
