import {
  BaseEmployeeSaveVO,
  BaseEmployeeUpdateVO,
  BaseEmployeeResultVO,
  BaseEmployeePageQuery,
  DefTenantBindUserVO,
  BaseEmployeeRoleRelSaveVO,
} from './model/baseEmployeeModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseEmployee';

export const Api = {
  Page: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/page`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Save: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  Delete: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}`,
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Query: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/query`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Get: (id: string | number) => {
    return {
      url: `${ServicePrefixEnum.BASE}/${MODULAR}/${id}`,
      method: RequestEnum.GET,
    } as AxiosRequestConfig;
  },

  BindUser: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/bindUser`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  InvitationUser: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/invitationUser`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  BindTenantAdmin: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/bindTenantAdmin`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  EmployeeRole: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/employeeRole`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  FindEmployeeRoleByEmployeeId: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/findEmployeeRoleByEmployeeId`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<BaseEmployeePageQuery>) =>
  defHttp.request<PageResult<BaseEmployeeResultVO>>({ ...Api.Page, params });

export const query = (params: BaseEmployeePageQuery) =>
  defHttp.request<BaseEmployeeResultVO[]>({ ...Api.Query, params });
export const get = (id: string | number) =>
  defHttp.request<BaseEmployeeResultVO>({ ...Api.Get(id) });

export const save = (params: BaseEmployeeSaveVO) =>
  defHttp.request<BaseEmployeeResultVO>({ ...Api.Save, params });

export const update = (params: BaseEmployeeUpdateVO) =>
  defHttp.request<BaseEmployeeResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

// 绑定/解绑用户为企业的员工，并设置为租户管理员
export const bindUser = (params: DefTenantBindUserVO) =>
  defHttp.request<boolean>({ ...Api.BindUser, params });

// 租户绑定或解绑用户
export const invitationUser = (params: DefTenantBindUserVO) =>
  defHttp.request<boolean>({ ...Api.InvitationUser, params });

// 绑定/解绑用户为企业的租户管理员
export const bindTenantAdmin = (params: DefTenantBindUserVO) =>
  defHttp.request<boolean>({ ...Api.BindTenantAdmin, params });
// 查询员工拥有的角色
export const findEmployeeRoleByEmployeeId = (employeeId: string) =>
  defHttp.request<string[]>({ ...Api.FindEmployeeRoleByEmployeeId, params: { employeeId } });
// 给员工绑定角色
export const saveEmployeeRole = (params: BaseEmployeeRoleRelSaveVO) =>
  defHttp.request<string[]>({ ...Api.EmployeeRole, params });
