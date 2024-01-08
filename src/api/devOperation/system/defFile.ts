import qs from 'qs';
import { BaseFileResultVO, BaseFilePageQuery } from '/@/api/basic/system/model/baseFileModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'file/def';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.FILE}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Delete: {
    url: `${ServicePrefixEnum.FILE}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,

  Download: {
    url: `${ServicePrefixEnum.FILE}/file/anyTenant/download`,
    method: RequestEnum.GET,
    responseType: 'blob',
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<BaseFilePageQuery>) =>
  defHttp.request<PageResult<BaseFileResultVO>>({ ...Api.Page, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const download = (ids: string[] | number[]) =>
  defHttp.request<void>(
    { ...Api.Download, params: qs.stringify({ ids }, { arrayFormat: 'repeat' }) },
    { isReturnNativeResponse: true },
  );
