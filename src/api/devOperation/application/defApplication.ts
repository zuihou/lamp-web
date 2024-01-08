import {
  DefApplicationSaveVO,
  DefApplicationUpdateVO,
  DefApplicationResultVO,
  DefApplicationPageQuery,
  ApplicationResourceResultVO,
} from './model/defApplicationModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defApplication';

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
  Query: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  FindApplicationResourceList: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/findApplicationResourceList`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  // 首页、我的应用 等查询我的可用应用
  FindMyApplication: {
    url: `${ServicePrefixEnum.TENANT}/anyone/findMyApplication`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  // 角色授权时，查询当前企业拥有的应用和资源
  FindAvailableApplicationResourceList: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/findAvailableApplicationResourceList`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  // 角色授权时，查询当前企业拥有的应用和数据权限
  FindAvailableApplicationDataScopeList: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/findAvailableApplicationDataScopeList`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const pageFindMyApplication = (params: PageParams<DefApplicationPageQuery>) =>
  defHttp.request<DefApplicationResultVO[]>({
    ...Api.FindMyApplication,
    params: { name: params?.model?.name },
  });

export const findApplicationResourceList = () =>
  defHttp.request<ApplicationResourceResultVO[]>({ ...Api.FindApplicationResourceList });

export const findAvailableApplicationResourceList = () =>
  defHttp.request<ApplicationResourceResultVO[]>({ ...Api.FindAvailableApplicationResourceList });

export const findAvailableApplicationDataScopeList = () =>
  defHttp.request<ApplicationResourceResultVO[]>({ ...Api.FindAvailableApplicationDataScopeList });

export const page = (params: PageParams<DefApplicationPageQuery>) =>
  defHttp.request<PageResult<DefApplicationResultVO>>({ ...Api.Page, params });

export const query = (params?: DefApplicationPageQuery) =>
  defHttp.request<DefApplicationResultVO[]>({ ...Api.Query, params });

export const save = (params: DefApplicationSaveVO) =>
  defHttp.request<DefApplicationResultVO>({ ...Api.Save, params });

export const update = (params: DefApplicationUpdateVO) =>
  defHttp.request<DefApplicationResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
