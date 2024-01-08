import {
  DefTenantApplicationRecordResultVO,
  DefTenantApplicationRecordPageQuery,
} from './model/defTenantApplicationRecordModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defTenantApplicationRecord';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<DefTenantApplicationRecordPageQuery>) =>
  defHttp.request<PageResult<DefTenantApplicationRecordResultVO>>({ ...Api.Page, params });
