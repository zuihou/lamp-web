import {
  DefInterfaceSaveVO,
  DefInterfaceUpdateVO,
  DefInterfaceResultVO,
  DefInterfacePageQuery,
} from './model/defInterfaceModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defInterface';
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
  Check: {
    url: `${ServicePrefix}/${MODULAR}/check`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const copy = (id: string) =>
  defHttp.request<DefInterfaceResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const page = (params: PageParams<DefInterfacePageQuery>) =>
  defHttp.request<PageResult<DefInterfaceResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<DefInterfaceResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: DefInterfacePageQuery) =>
  defHttp.request<DefInterfaceResultVO[]>({
    ...Api.Query,
    params,
  });

export const save = (params: DefInterfaceSaveVO) =>
  defHttp.request<DefInterfaceResultVO>({
    ...Api.Save,
    params,
  });

export const update = (params: DefInterfaceUpdateVO) =>
  defHttp.request<DefInterfaceResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (code: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.Check, params: { code, id } });
