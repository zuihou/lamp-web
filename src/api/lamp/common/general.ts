import { defHttp } from '/@/utils/http/axios';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import { SystemApiVO } from './model/optionsModel';
import { RequestEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';

export const Api = {
  SystemApiScan: (serviceProfix: string) => {
    return {
      url: `/${serviceProfix}/anyone/systemApiScan`,
      method: RequestEnum.GET,
    };
  },
  FindDictItemByType: {
    url: `${ServicePrefixEnum.OAUTH}/anyUser/dict/findDictItemByType`,
    method: RequestEnum.POST,
  },
  Params: {
    url: `${ServicePrefixEnum.OAUTH}/anyUser/parameter/value`,
    method: RequestEnum.GET,
  },
};

export const findSystemApi = (serviceProfix: string) => {
  return defHttp.request<Map<String, SystemApiVO[]>>({ ...Api.SystemApiScan(serviceProfix) });
};

/**
 * @description: Get 字典
 */
export const findDictItemByType = (params: string[] = []) => {
  return defHttp.request<any>({
    ...Api.FindDictItemByType,
    params,
  });
};

export const findParams = (params: string[] | string = []) => {
  if (isString(params)) {
    params = [params];
  }
  return defHttp.request<string>({ ...Api.Params, params });
};
