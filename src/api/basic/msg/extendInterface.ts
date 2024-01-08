import {
  ExtendInterfaceSaveVO,
  ExtendInterfaceUpdateVO,
  ExtendInterfaceResultVO,
  ExtendInterfacePageQuery,
} from './model/extendInterfaceModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'extendInterface';
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
  defHttp.request<ExtendInterfaceResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const page = (params: PageParams<ExtendInterfacePageQuery>) =>
  defHttp.request<PageResult<ExtendInterfaceResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<ExtendInterfaceResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: ExtendInterfacePageQuery) =>
  defHttp.request<ExtendInterfaceResultVO[]>({
    ...Api.Query,
    params,
  });

export const save = (params: ExtendInterfaceSaveVO) =>
  defHttp.request<ExtendInterfaceResultVO>({
    ...Api.Save,
    params,
  });

export const update = (params: ExtendInterfaceUpdateVO) =>
  defHttp.request<ExtendInterfaceResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const check = (code: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.Check, params: { code, id } });
