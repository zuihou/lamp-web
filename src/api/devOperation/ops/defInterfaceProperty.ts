import {
  DefInterfacePropertyUpdateVO,
  DefInterfacePropertyResultVO,
  DefInterfacePropertyPageQuery,
  DefInterfacePropertySaveVO,
  DefInterfacePropertyBatchSaveVO,
} from './model/defInterfacePropertyModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defInterfaceProperty';
const ServicePrefix = ServicePrefixEnum.SYSTEM;

export const Api = {
  Page: {
    url: `${ServicePrefix}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Detail: {
    url: `${ServicePrefix}/${MODULAR}/detail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  Copy: {
    url: `${ServicePrefix}/${MODULAR}/copy`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  BatchSave: {
    url: `${ServicePrefix}/${MODULAR}/batchSave`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefix}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
};

export const copy = (id: string) =>
  defHttp.request<DefInterfacePropertyResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const page = (params: PageParams<DefInterfacePropertyPageQuery>) =>
  defHttp.request<PageResult<DefInterfacePropertyResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<DefInterfacePropertyResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: DefInterfacePropertyPageQuery) =>
  defHttp.request<DefInterfacePropertyResultVO[]>({
    ...Api.Query,
    params,
  });

export const batchSave = (params: DefInterfacePropertyBatchSaveVO) =>
  defHttp.request<DefInterfacePropertyResultVO>({
    ...Api.BatchSave,
    params,
  });
export const save = (params: DefInterfacePropertySaveVO) =>
  defHttp.request<DefInterfacePropertyResultVO>({
    ...Api.Save,
    params,
  });

export const update = (params: DefInterfacePropertyUpdateVO) =>
  defHttp.request<DefInterfacePropertyResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
