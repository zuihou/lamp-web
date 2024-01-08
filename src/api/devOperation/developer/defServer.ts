import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defServer';

export const Api = {
  Get: {
    url: `${ServicePrefixEnum.SYSTEM}/${MODULAR}`,
    method: RequestEnum.GET,
    timeout: 2 * 60 * 1000,
  } as AxiosRequestConfig,
};

export const get = () => defHttp.request<any>({ ...Api.Get });
