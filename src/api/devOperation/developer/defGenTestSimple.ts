import {
  DefGenTestSimpleSaveVO,
  DefGenTestSimpleUpdateVO,
  DefGenTestSimpleResultVO,
  DefGenTestSimplePageQuery,
} from './model/defGenTestSimpleModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defGenTestSimple';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Detail: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/detail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}`,
    method: RequestEnum.POST,
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

export const page = (params: PageParams<DefGenTestSimplePageQuery>) =>
  defHttp.request<PageResult<DefGenTestSimpleResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<DefGenTestSimpleResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: DefGenTestSimplePageQuery) =>
  defHttp.request<DefGenTestSimpleResultVO[]>({ ...Api.Query, params });

export const save = (params: DefGenTestSimpleSaveVO) =>
  defHttp.request<DefGenTestSimpleResultVO>({ ...Api.Save, params });

export const update = (params: DefGenTestSimpleUpdateVO) =>
  defHttp.request<DefGenTestSimpleResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
