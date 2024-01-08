import { defHttp } from '/@/utils/http/axios';
import {
  DefUserAvatarUpdateVO,
  DefUserBaseInfoUpdateVO,
  DefUserEmailUpdateVO,
  DefUserMobileUpdateVO,
  DefUserPasswordUpdateVO,
} from './model/userInfoModel';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';

import { ServicePrefixEnum } from '/@/enums/commonEnum';
import { AxiosRequestConfig } from 'axios';
import { DefApplicationResultVO } from '../../devOperation/application/model/defApplicationModel';

export const Api = {
  FindMyApplication: {
    url: `${ServicePrefixEnum.TENANT}/anyone/findMyApplication`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  FindRecommendApplication: {
    url: `${ServicePrefixEnum.TENANT}/anyone/findRecommendApplication`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  UpdateAvatar: {
    url: `${ServicePrefixEnum.OAUTH}/anyone/avatar`,
    method: RequestEnum.PUT,
  } as AxiosRequestConfig,
  UpdatePassword: {
    url: `${ServicePrefixEnum.OAUTH}/anyone/password`,
    method: RequestEnum.PUT,
  } as AxiosRequestConfig,
  UpdateEmail: {
    url: `${ServicePrefixEnum.OAUTH}/anyone/email`,
    method: RequestEnum.PUT,
  } as AxiosRequestConfig,
  UpdateMobile: {
    url: `${ServicePrefixEnum.OAUTH}/anyone/mobile`,
    method: RequestEnum.PUT,
  } as AxiosRequestConfig,
  UpdateBaseInfo: {
    url: `${ServicePrefixEnum.OAUTH}/anyone/baseInfo`,
    method: RequestEnum.PUT,
  } as AxiosRequestConfig,
  UpdateDefApp: {
    url: `${ServicePrefixEnum.TENANT}/anyone/updateDefApp`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  GetDefApp: {
    url: `${ServicePrefixEnum.TENANT}/anyone/getDefApp`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const updateDefApp = (applicationId: string) =>
  defHttp.request<boolean>({
    ...Api.UpdateDefApp,
    params: { applicationId },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });

export const getDefApp = () => defHttp.request<DefApplicationResultVO>({ ...Api.GetDefApp });

export const findMyApplication = (name?: string) =>
  defHttp.request<DefApplicationResultVO[]>({
    ...Api.FindMyApplication,
    params: { name },
    timeout: 60 * 1000,
  });

export const findRecommendApplication = (name?: string) =>
  defHttp.request<DefApplicationResultVO[]>({ ...Api.FindRecommendApplication, params: { name } });

export const updateAvatar = (params: DefUserAvatarUpdateVO) =>
  defHttp.request<boolean>({ ...Api.UpdateAvatar, params });

export const updatePassword = (params: DefUserPasswordUpdateVO) =>
  defHttp.request<boolean>({ ...Api.UpdatePassword, params });

export const updateEmail = (params: DefUserMobileUpdateVO) =>
  defHttp.request<boolean>({ ...Api.UpdateEmail, params });

export const updateMobile = (params: DefUserEmailUpdateVO) =>
  defHttp.request<boolean>({ ...Api.UpdateMobile, params });

export const updateBaseInfo = (params: DefUserBaseInfoUpdateVO) =>
  defHttp.request<boolean>({ ...Api.UpdateBaseInfo, params });
