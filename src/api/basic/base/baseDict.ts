import {
  BaseDictSaveVO,
  BaseDictUpdateVO,
  BaseDictResultVO,
  BaseDictPageQuery,
} from './model/baseDictModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseDict';

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
  ImportDict: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/importDict`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Get: (id: string) => {
    return {
      url: `${ServicePrefixEnum.BASE}/${MODULAR}/${id}`,
      method: RequestEnum.GET,
    } as AxiosRequestConfig;
  },
};

export const page = (params: PageParams<BaseDictPageQuery>) =>
  defHttp.request<PageResult<BaseDictResultVO>>({ ...Api.Page, params });

export const query = (params: BaseDictPageQuery) =>
  defHttp.request<BaseDictResultVO[]>({ ...Api.Query, params });

export const get = (id: string) => defHttp.request<BaseDictResultVO>({ ...Api.Get(id) });

export const save = (params: BaseDictSaveVO) =>
  defHttp.request<BaseDictResultVO>({ ...Api.Save, params });

export const update = (params: BaseDictUpdateVO) =>
  defHttp.request<BaseDictResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (key: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.Check, params: { key, id } });

export const importDict = (id: string) =>
  defHttp.request<boolean>({
    ...Api.ImportDict,
    params: { id },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
