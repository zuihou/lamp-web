import {
  DefGenTableColumnPageQuery,
  DefGenTableColumnResultVO,
  DefGenTableColumnUpdateVO,
} from './model/defGenTableColumnModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defGenTableColumn';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  SyncField: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/syncField`,
    method: RequestEnum.POST,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<DefGenTableColumnPageQuery>) =>
  defHttp.request<PageResult<DefGenTableColumnResultVO>>({ ...Api.Page, params });

export const query = (params: DefGenTableColumnPageQuery) =>
  defHttp.request<DefGenTableColumnResultVO[]>({
    ...Api.Query,
    params,
  });

export const update = (params: DefGenTableColumnUpdateVO) =>
  defHttp.request<DefGenTableColumnResultVO>({ ...Api.Update, params });

export const syncField = (tableId: string, id: string) =>
  defHttp.request<DefGenTableColumnResultVO>({ ...Api.SyncField, params: { tableId, id } });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
