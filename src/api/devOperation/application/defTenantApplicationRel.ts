import {
  DefTenantApplicationRelSaveVO,
  DefTenantApplicationRelUpdateVO,
  DefTenantApplicationRelResultVO,
  DefTenantApplicationRelPageQuery,
} from './model/defTenantApplicationRelModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defTenantApplicationRel';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Grant: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/grant`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Cancel: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/cancel`,
    method: RequestEnum.POST,
  },
  Renewal: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/renewal`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Detail: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/detail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<DefTenantApplicationRelPageQuery>) =>
  defHttp.request<PageResult<DefTenantApplicationRelResultVO>>({ ...Api.Page, params });

export const query = (params: DefTenantApplicationRelPageQuery) =>
  defHttp.request<DefTenantApplicationRelResultVO[]>({ ...Api.Query, params });

export const grant = (params: DefTenantApplicationRelSaveVO) =>
  defHttp.request<boolean>({ ...Api.Grant, params });

export const renewal = (params: DefTenantApplicationRelUpdateVO) =>
  defHttp.request<boolean>({ ...Api.Renewal, params });

export const cancel = (params: string[]) => defHttp.request<boolean>({ ...Api.Cancel, params });

export const detail = (id: string) =>
  defHttp.request<DefTenantApplicationRelResultVO>({ ...Api.Detail, params: { id } });
