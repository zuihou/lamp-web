import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

export const Api = {
  FindOnlineServicePrefix: {
    url: `${ServicePrefixEnum.GATEWAY}/findOnlineServicePrefix`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  FindOnlineService: {
    url: `${ServicePrefixEnum.GATEWAY}/findOnlineService`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const findOnlineServicePrefix = () =>
  defHttp.request<Recordable>({ ...Api.FindOnlineServicePrefix });
export const findOnlineService = () => defHttp.request<Recordable>({ ...Api.FindOnlineService });
