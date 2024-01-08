import { BaseLoginLogPageQuery, BaseLoginLogResultVO } from './model/baseLoginLogModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseLoginLog';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  AnyonePage: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/anyone/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Delete: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Clear: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/clear`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<BaseLoginLogPageQuery>) =>
  defHttp.request<PageResult<BaseLoginLogResultVO>>({ ...Api.Page, params });

export const anyonePage = (params: PageParams<BaseLoginLogPageQuery>) =>
  defHttp.request<PageResult<BaseLoginLogResultVO>>({ ...Api.AnyonePage, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
export const clear = (type: string | number) =>
  defHttp.request<boolean>({
    ...Api.Clear,
    params: { type },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
