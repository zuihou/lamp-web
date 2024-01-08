import {
  ExtendInterfaceLoggingPageQuery,
  ExtendInterfaceLoggingResultVO,
  ExtendInterfaceLoggingSaveVO,
  ExtendInterfaceLoggingUpdateVO,
} from './model/extendInterfaceLoggingModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'extendInterfaceLogging';
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
};

export const copy = (id: string) =>
  defHttp.request<ExtendInterfaceLoggingResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const page = (params: PageParams<ExtendInterfaceLoggingPageQuery>) =>
  defHttp.request<PageResult<ExtendInterfaceLoggingResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<ExtendInterfaceLoggingResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: ExtendInterfaceLoggingPageQuery) =>
  defHttp.request<ExtendInterfaceLoggingResultVO[]>({
    ...Api.Query,
    params,
  });

export const save = (params: ExtendInterfaceLoggingSaveVO) =>
  defHttp.request<ExtendInterfaceLoggingResultVO>({
    ...Api.Save,
    params,
  });

export const update = (params: ExtendInterfaceLoggingUpdateVO) =>
  defHttp.request<ExtendInterfaceLoggingResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) =>
  defHttp.request<boolean>(
    {
      ...Api.Delete,
      params,
    },
    { withTenant: false },
  );
