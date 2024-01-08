import {
  DefGenTestTreeSaveVO,
  DefGenTestTreeUpdateVO,
  DefGenTestTreeResultVO,
  DefGenTestTreePageQuery,
} from './model/defGenTestTreeModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defGenTestTree';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Tree: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/tree`,
    method: RequestEnum.POST,
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

export const tree = (params?: DefGenTestTreePageQuery) =>
  defHttp.request<DefGenTestTreeResultVO>({ ...Api.Tree, params });

export const page = (params: PageParams<DefGenTestTreePageQuery>) =>
  defHttp.request<PageResult<DefGenTestTreeResultVO>>({ ...Api.Page, params });

export const query = (params: DefGenTestTreePageQuery) =>
  defHttp.request<DefGenTestTreeResultVO[]>({ ...Api.Query, params });

export const save = (params: DefGenTestTreeSaveVO) =>
  defHttp.request<DefGenTestTreeResultVO>({ ...Api.Save, params });

export const update = (params: DefGenTestTreeUpdateVO) =>
  defHttp.request<DefGenTestTreeResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
