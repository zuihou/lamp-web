import {
  DefAreaSaveVO,
  DefAreaUpdateVO,
  DefAreaResultVO,
  DefAreaPageQuery,
} from './model/defAreaModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defArea';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Tree: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/tree`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  LazyList: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/lazyList`,
    method: RequestEnum.POST,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
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
};

export const tree = (params?: DefAreaPageQuery) =>
  defHttp.request<DefAreaResultVO>({ ...Api.Tree, params });

export const lazyList = (params: DefAreaPageQuery) =>
  defHttp.request<DefAreaResultVO[]>({ ...Api.LazyList, params });

export const page = (params: PageParams<DefAreaPageQuery>) =>
  defHttp.request<PageResult<DefAreaResultVO>>({ ...Api.Page, params });

export const query = (params: DefAreaPageQuery) =>
  defHttp.request<DefAreaResultVO[]>({ ...Api.Query, params });

export const save = (params: DefAreaSaveVO) =>
  defHttp.request<DefAreaResultVO>({ ...Api.Save, params });

export const update = (params: DefAreaUpdateVO) =>
  defHttp.request<DefAreaResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
