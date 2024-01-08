import {
  DatasourceConfig,
  DatasourceConfigPageQuery,
  DatasourceConfigResult,
  DatasourceConfigSaveDTO,
  DatasourceConfigUpdateDTO,
} from './model/datasourceConfigModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';

const MODULAR = 'defDatasourceConfig';

export const Api = {
  Page: { url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`, method: RequestEnum.POST },
  Save: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefixEnum.TENANT}/${MODULAR}`, method: RequestEnum.PUT },
  Delete: { url: `${ServicePrefixEnum.TENANT}/${MODULAR}`, method: RequestEnum.DELETE },
  TestConnect: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/testConnect`,
    method: RequestEnum.POST,
  },
  Query: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/query`,
    method: RequestEnum.POST,
  },
};

export const page = (params: PageParams<DatasourceConfigPageQuery>) =>
  defHttp.request<PageResult<DatasourceConfigResult>>({ ...Api.Page, params });

export const save = (params: DatasourceConfigSaveDTO) =>
  defHttp.request<DatasourceConfig>({ ...Api.Save, params });

export const update = (params: DatasourceConfigUpdateDTO) =>
  defHttp.request<DatasourceConfig>({ ...Api.Update, params });

export const remove = (ids: string[]) =>
  defHttp.request<boolean>({
    ...Api.Delete,
    params: ids,
  });

export const testConnect = (id: string) =>
  defHttp.request<boolean>({
    ...Api.TestConnect,
    params: { id },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });

export const query = (params?: DatasourceConfig) =>
  defHttp.request<DatasourceConfig[]>({ ...Api.Query, params });
