import { ExtendMsgRecipientSaveVO, ExtendMsgRecipientUpdateVO, ExtendMsgRecipientResultVO, ExtendMsgRecipientPageQuery } from './model/extendMsgRecipientModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'extendMsgRecipient';
// tips: 建议在ServicePrefixEnum中新增：BASE = '/base'，并将下方代码改为： const ServicePrefix = ServicePrefixEnum.BASE;
// tips: /base 需要与 lamp-gateway-server.yml中配置的Path一致，否则无法正常调用接口！！！
// const ServicePrefix = ServicePrefixEnum.BASE;
const ServicePrefix = '/base';

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
};

export const copy = (id: string) => defHttp.request<ExtendMsgRecipientResultVO>({ ...Api.Copy, params: { id } });

export const page = (params: PageParams<ExtendMsgRecipientPageQuery>) =>
  defHttp.request<PageResult<ExtendMsgRecipientResultVO>>({ ...Api.Page, params });

export const detail = (id: string) =>
  defHttp.request<ExtendMsgRecipientResultVO>({ ...Api.Detail, params: { id } });

export const query = (params: ExtendMsgRecipientPageQuery) => defHttp.request<ExtendMsgRecipientResultVO[]>({ ...Api.Query, params });

export const save = (params: ExtendMsgRecipientSaveVO) => defHttp.request<ExtendMsgRecipientResultVO>({ ...Api.Save, params });

export const update = (params: ExtendMsgRecipientUpdateVO) =>
  defHttp.request<ExtendMsgRecipientResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

