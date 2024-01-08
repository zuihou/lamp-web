import {
  ExtendMsgSaveVO,
  ExtendMsgUpdateVO,
  ExtendMsgResultVO,
  ExtendMsgPageQuery,
  ExtendMsgSendVO,
} from './model/extendMsgModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'extendMsg';
// tips: 建议在ServicePrefixEnum中新增：BASE = '/base'，并将下方代码改为： const ServicePrefix = ServicePrefixEnum.BASE;
// tips: /base 需要与 lamp-gateway-server.yml中配置的Path一致，否则无法正常调用接口！！！
const ServicePrefix = ServicePrefixEnum.BASE;

export const Api = {
  Page: {
    url: `${ServicePrefix}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Detail: {
    url: `${ServicePrefix}/${MODULAR}/detail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  Copy: {
    url: `${ServicePrefix}/${MODULAR}/copy`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Publish: {
    url: `${ServicePrefix}/${MODULAR}/publish`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefix}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  SendByTemplate: {
    url: `${ServicePrefix}/${MODULAR}/sendByTemplate`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Get: (id: string) => {
    return {
      url: `${ServicePrefix}/${MODULAR}/${id}`,
      method: RequestEnum.GET,
    } as AxiosRequestConfig;
  },
};

export const copy = (id: string) =>
  defHttp.request<ExtendMsgResultVO>({ ...Api.Copy, params: { id } });

export const page = (params: PageParams<ExtendMsgPageQuery>) =>
  defHttp.request<PageResult<ExtendMsgResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<ExtendMsgResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: ExtendMsgPageQuery) =>
  defHttp.request<ExtendMsgResultVO[]>({
    ...Api.Query,
    params,
  });

export const get = (id: string) => defHttp.request<ExtendMsgResultVO>({ ...Api.Get(id) });

export const save = (params: ExtendMsgSaveVO) =>
  defHttp.request<ExtendMsgResultVO>({
    ...Api.Save,
    params,
  });
export const publish = (params: ExtendMsgSaveVO) =>
  defHttp.request<boolean>({
    ...Api.Publish,
    params,
  });
export const sendByTemplate = (params: ExtendMsgSendVO) =>
  defHttp.request<boolean>({
    ...Api.SendByTemplate,
    params,
  });

export const update = (params: ExtendMsgUpdateVO) =>
  defHttp.request<ExtendMsgResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
