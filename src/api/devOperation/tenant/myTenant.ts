import {
  TenantSaveDTO,
  TenantUpdateDTO,
  Tenant,
  TenantPageQuery,
  ReviewComment,
} from './model/tenantModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'anyone/defTenant';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
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
  UpdateStatus: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/updateStatus`,
    method: RequestEnum.POST,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<TenantPageQuery>) =>
  defHttp.request<PageResult<Tenant>>({ ...Api.Page, params });

export const save = (params: TenantSaveDTO) => defHttp.request<Tenant>({ ...Api.Save, params });

export const update = (params: TenantUpdateDTO) =>
  defHttp.request<Tenant>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const updateStatus = (params: ReviewComment) =>
  defHttp.request<boolean>({ ...Api.UpdateStatus, params });
