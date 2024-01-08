import {
  DefClientSaveVO,
  DefClientUpdateVO,
  DefClientResultVO,
  DefClientPageQuery,
} from './model/defClientModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defClient';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  check: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/check`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<DefClientPageQuery>) =>
  defHttp.request<PageResult<DefClientResultVO>>({ ...Api.Page, params });

export const query = (params: DefClientPageQuery) =>
  defHttp.request<DefClientResultVO[]>({ ...Api.Query, params });

export const save = (params: DefClientSaveVO) =>
  defHttp.request<DefClientResultVO>({ ...Api.Save, params });

export const update = (params: DefClientUpdateVO) =>
  defHttp.request<DefClientResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (code: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.check, params: { code, id } });
