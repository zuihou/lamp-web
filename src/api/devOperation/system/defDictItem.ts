import {
  DefDictItemSaveVO,
  DefDictItemUpdateVO,
  DefDictItemResultVO,
  DefDictItemPageQuery,
} from './model/defDictItemModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defDictItem';

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
  Check: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/check`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<DefDictItemPageQuery>) =>
  defHttp.request<PageResult<DefDictItemResultVO>>({ ...Api.Page, params });

export const query = (params: DefDictItemPageQuery) =>
  defHttp.request<DefDictItemResultVO[]>({ ...Api.Query, params });

export const save = (params: DefDictItemSaveVO) =>
  defHttp.request<DefDictItemResultVO>({ ...Api.Save, params });

export const update = (params: DefDictItemUpdateVO) =>
  defHttp.request<DefDictItemResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (key: string, dictId: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.Check, params: { key, dictId, id } });
