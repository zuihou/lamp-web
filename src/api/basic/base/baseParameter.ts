import {
  BaseParameterSaveVO,
  BaseParameterUpdateVO,
  BaseParameterResultVO,
  BaseParameterPageQuery,
} from './model/baseParameterModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseParameter';

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
};

export const page = (params: PageParams<BaseParameterPageQuery>) =>
  defHttp.request<PageResult<BaseParameterResultVO>>({ ...Api.Page, params });

export const query = (params: BaseParameterPageQuery) =>
  defHttp.request<BaseParameterResultVO[]>({ ...Api.Query, params });

export const save = (params: BaseParameterSaveVO) =>
  defHttp.request<BaseParameterResultVO>({ ...Api.Save, params });

export const update = (params: BaseParameterUpdateVO) =>
  defHttp.request<BaseParameterResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
