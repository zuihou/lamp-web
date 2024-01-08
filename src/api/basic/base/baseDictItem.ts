import {
  BaseDictItemSaveVO,
  BaseDictItemUpdateVO,
  BaseDictItemResultVO,
  BaseDictItemPageQuery,
} from './model/baseDictItemModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseDictItem';

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
  Check: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/check`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<BaseDictItemPageQuery>) =>
  defHttp.request<PageResult<BaseDictItemResultVO>>({ ...Api.Page, params });

export const query = (params: BaseDictItemPageQuery) =>
  defHttp.request<BaseDictItemResultVO[]>({ ...Api.Query, params });

export const save = (params: BaseDictItemSaveVO) =>
  defHttp.request<BaseDictItemResultVO>({ ...Api.Save, params });

export const update = (params: BaseDictItemUpdateVO) =>
  defHttp.request<BaseDictItemResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (key: string, dictId: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.Check, params: { key, dictId, id } });
