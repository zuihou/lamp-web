import {
  ExtendInterfacePropertyUpdateVO,
  ExtendInterfacePropertyResultVO,
  ExtendInterfacePropertyPageQuery,
  ExtendInterfacePropertySaveVO,
  ExtendInterfacePropertyBatchSaveVO,
} from './model/extendInterfacePropertyModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'extendInterfaceProperty';
const ServicePrefix = ServicePrefixEnum.BASE;

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
  defHttp.request<ExtendInterfacePropertyResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const page = (params: PageParams<ExtendInterfacePropertyPageQuery>) =>
  defHttp.request<PageResult<ExtendInterfacePropertyResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<ExtendInterfacePropertyResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: ExtendInterfacePropertyPageQuery) =>
  defHttp.request<ExtendInterfacePropertyResultVO[]>({
    ...Api.Query,
    params,
  });

export const batchSave = (params: ExtendInterfacePropertyBatchSaveVO) =>
  defHttp.request<ExtendInterfacePropertyResultVO>({
    ...Api.BatchSave,
    params,
  });
export const save = (params: ExtendInterfacePropertySaveVO) =>
  defHttp.request<ExtendInterfacePropertyResultVO>({
    ...Api.Save,
    params,
  });

export const update = (params: ExtendInterfacePropertyUpdateVO) =>
  defHttp.request<ExtendInterfacePropertyResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
