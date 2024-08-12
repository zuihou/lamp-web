import type { AxiosRequestConfig } from 'axios';

import { PageParams, PageResult } from '/@/api/model/baseModel';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { OnlineTokenResultVO, OnlineUsersResultVO } from './model/onlineModel';

const MODULAR = 'defUser/onlineUsers';
const ServicePrefix = ServicePrefixEnum.SYSTEM;

export const Api = {
  Page: {
    url: `${ServicePrefix}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  GetTokenSignList: {
    url: `${ServicePrefix}/${MODULAR}/getTokenSignList`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Kickout: {
    url: `${ServicePrefix}/${MODULAR}/kickout`,
    method: RequestEnum.POST,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  } as AxiosRequestConfig,
  Logout: {
    url: `${ServicePrefix}/${MODULAR}/logout`,
    method: RequestEnum.POST,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<any>) =>
  defHttp.request<PageResult<OnlineUsersResultVO>>({ ...Api.Page, params });

export const getTokenSignList = (params: PageParams<any>) =>
  defHttp.request<OnlineTokenResultVO[]>({ ...Api.GetTokenSignList, params });

export const kickout = (userId?: string, token?: string) =>
  defHttp.request<boolean>({ ...Api.Kickout, params: { userId, token } });

export const logout = (userId?: string, token?: string) =>
  defHttp.request<boolean>({ ...Api.Logout, params: { userId, token } });
