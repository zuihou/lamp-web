import {
  EMsgSaveVO,
  MyMsgResult,
  EMsgUpdateVO,
  EMsgResultVO,
  EMsgPageQuery,
} from './model/eMsgModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'msg';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.MSG}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.MSG}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefixEnum.MSG}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefixEnum.MSG}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.MSG}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Get: (id: string) => {
    return {
      url: `${ServicePrefixEnum.MSG}/${MODULAR}/${id}`,
      method: RequestEnum.GET,
    } as AxiosRequestConfig;
  },
  DeleteMyMsg: {
    url: `${ServicePrefixEnum.MSG}/anyone/myMsg/deleteMyMsg`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Mark: {
    url: `${ServicePrefixEnum.MSG}/anyone/myMsg/mark`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  MyMsg: {
    url: `${ServicePrefixEnum.MSG}/anyone/myMsg`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  PageMyMsg: {
    url: `${ServicePrefixEnum.MSG}/anyone/myMsg/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<EMsgPageQuery>) =>
  defHttp.request<PageResult<EMsgResultVO>>({ ...Api.Page, params });

export const query = (params: EMsgPageQuery) =>
  defHttp.request<EMsgResultVO[]>({ ...Api.Query, params });

export const save = (params: EMsgSaveVO) => defHttp.request<EMsgResultVO>({ ...Api.Save, params });

export const update = (params: EMsgUpdateVO) =>
  defHttp.request<EMsgResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });
export const deleteMyMsg = (params: string[]) =>
  defHttp.request<boolean>({ ...Api.DeleteMyMsg, params });

export const get = (id: string) => defHttp.request<EMsgResultVO>({ ...Api.Get(id) });

export const mark = (params: string[]) => defHttp.request<boolean>({ ...Api.Mark, params });

export const myMsg = (params: PageParams<EMsgPageQuery>) =>
  defHttp.request<MyMsgResult>({ ...Api.MyMsg, params }, { errorMessageMode: 'none' });

export const pageMyMsg = (params: PageParams<EMsgPageQuery>) =>
  defHttp.request<PageResult<EMsgResultVO>>({ ...Api.PageMyMsg, params });
