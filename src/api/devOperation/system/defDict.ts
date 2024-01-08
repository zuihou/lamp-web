import {
  DefDictPageQuery,
  DefDictResultVO,
  DefDictSaveVO,
  DefDictUpdateVO,
} from './model/defDictModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defDict';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Copy: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/copy`,
    method: RequestEnum.POST,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
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
  Get: (id: string) => {
    return {
      url: `${ServicePrefixEnum.TENANT}/${MODULAR}/${id}`,
      method: RequestEnum.GET,
    } as AxiosRequestConfig;
  },
};

export const page = (params: PageParams<DefDictPageQuery>) =>
  defHttp.request<PageResult<DefDictResultVO>>({ ...Api.Page, params });

export const query = (params: DefDictPageQuery) =>
  defHttp.request<DefDictResultVO[]>({ ...Api.Query, params });

export const get = (id: string) => defHttp.request<DefDictResultVO>({ ...Api.Get(id) });

export const save = (params: DefDictSaveVO) =>
  defHttp.request<DefDictResultVO>({ ...Api.Save, params });

export const copy = (id: string) =>
  defHttp.request<DefDictResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const update = (params: DefDictUpdateVO) =>
  defHttp.request<DefDictResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (key: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.Check, params: { key, id } });
