import {
  DefUserSaveVO,
  DefUserUpdateVO,
  DefUserResultVO,
  DefUserPageQuery,
  DefUserPasswordResetVO,
} from './model/defUserModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defUser';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  CheckUsername: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/checkUsername`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  CheckEmail: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/checkEmail`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  CheckIdCard: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/checkIdCard`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  CheckMobile: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/checkMobile`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  PageUser: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/pageUser`,
    method: RequestEnum.POST,
  },
  QueryUser: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/queryUser`,
    method: RequestEnum.POST,
  },
  ResetPassword: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/resetPassword`,
    method: RequestEnum.PUT,
  },
  UpdateState: {
    url: `${ServicePrefixEnum.TENANT}/${MODULAR}/updateState`,
    method: RequestEnum.PUT,
  },
};

export const page = (params: PageParams<DefUserPageQuery>) =>
  defHttp.request<PageResult<DefUserResultVO>>({ ...Api.Page, params });

export const query = (params?: DefUserPageQuery) =>
  defHttp.request<DefUserResultVO[]>({ ...Api.Query, params });

export const save = (params: DefUserSaveVO) =>
  defHttp.request<DefUserResultVO>({ ...Api.Save, params });

export const update = (params: DefUserUpdateVO) =>
  defHttp.request<DefUserResultVO>({ ...Api.Update, params });

export const updateState = (id: string, state: boolean) =>
  defHttp.request<boolean>({
    ...Api.UpdateState,
    params: { id, state },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });

export const resetPassword = (params: DefUserPasswordResetVO) =>
  defHttp.request<boolean>({ ...Api.ResetPassword, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const checkUsername = (username: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.CheckUsername, params: { username, id } });

export const checkEmail = (email: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.CheckEmail, params: { email, id } });

export const checkIdCard = (idCard: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.CheckIdCard, params: { idCard, id } });

export const checkMobile = (mobile: string, id?: string) =>
  defHttp.request<boolean>({ ...Api.CheckMobile, params: { mobile, id } });

export const pageUser = (params: PageParams<DefUserPageQuery>) =>
  defHttp.request<PageResult<DefUserResultVO>>({ ...Api.PageUser, params });

export const queryUser = (params: DefUserPageQuery) =>
  defHttp.request<DefUserResultVO[]>({ ...Api.QueryUser, params });
