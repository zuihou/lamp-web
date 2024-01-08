import {
  ExtendNoticePageQuery,
  ExtendNoticeResultVO,
  ExtendNoticeSaveVO,
  ExtendNoticeUpdateVO,
  MyNoticeResult,
} from './model/extendNoticeModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'extendNotice';
const ServicePrefix = ServicePrefixEnum.BASE;

export const Api = {
  Page: {
    url: `${ServicePrefix}/${MODULAR}/anyone/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Detail: {
    url: `${ServicePrefix}/${MODULAR}/anyone/detail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  Copy: {
    url: `${ServicePrefix}/${MODULAR}/anyone/copy`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefix}/${MODULAR}/anyone`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefix}/${MODULAR}/anyone`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefix}/${MODULAR}/anyone`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefix}/${MODULAR}/anyone/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Mark: {
    url: `${ServicePrefix}/${MODULAR}/anyone/mark`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  MyNotice: {
    url: `${ServicePrefix}/${MODULAR}/anyone/myNotice`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Get: (id) => {
    return {
      url: `${ServicePrefix}/${MODULAR}/anyone/${id}`,
      method: RequestEnum.GET,
    } as AxiosRequestConfig;
  },
};

export const copy = (id: string) =>
  defHttp.request<ExtendNoticeResultVO>({
    ...Api.Copy,
    params: { id },
  });

export const page = (params: PageParams<ExtendNoticePageQuery>) =>
  defHttp.request<PageResult<ExtendNoticeResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<ExtendNoticeResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: ExtendNoticePageQuery) =>
  defHttp.request<ExtendNoticeResultVO[]>({
    ...Api.Query,
    params,
  });
export const get = (id: string) =>
  defHttp.request<ExtendNoticeResultVO>({
    ...Api.Get(id),
  });

export const save = (params: ExtendNoticeSaveVO) =>
  defHttp.request<ExtendNoticeResultVO>({
    ...Api.Save,
    params,
  });

export const update = (params: ExtendNoticeUpdateVO) =>
  defHttp.request<ExtendNoticeResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const mark = (params: string[]) => defHttp.request<boolean>({ ...Api.Mark, params });

export const myNotice = (params: PageParams<ExtendNoticePageQuery>) =>
  defHttp.request<MyNoticeResult>({ ...Api.MyNotice, params }, { errorMessageMode: 'none' });
