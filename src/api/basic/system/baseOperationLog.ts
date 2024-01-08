import {
  BaseOperationLogPageQuery,
  BaseOperationLogResultVO,
  BaseOperationLogSaveVO,
  BaseOperationLogUpdateVO,
} from './model/baseOperationLogModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseOperationLog';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Clear: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/clear`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Detail: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/detail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<BaseOperationLogPageQuery>) =>
  defHttp.request<PageResult<BaseOperationLogResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<BaseOperationLogResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: BaseOperationLogPageQuery) =>
  defHttp.request<BaseOperationLogResultVO[]>({ ...Api.Query, params });

export const save = (params: BaseOperationLogSaveVO) =>
  defHttp.request<BaseOperationLogResultVO>({ ...Api.Save, params });

export const update = (params: BaseOperationLogUpdateVO) =>
  defHttp.request<BaseOperationLogResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
export const clear = (type: string | number) =>
  defHttp.request<boolean>({
    ...Api.Clear,
    params: { type },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
