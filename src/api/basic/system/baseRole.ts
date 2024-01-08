import {
  BaseRoleSaveVO,
  BaseRoleUpdateVO,
  BaseRoleResultVO,
  BaseRolePageQuery,
  RoleEmployeeSaveVO,
  BaseRoleResourceRelSaveVO,
} from './model/baseRoleModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'baseRole';

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
  SaveRoleEmployee: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/roleEmployee`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  SaveRoleResource: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/roleResource`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  FindEmployeeIdByRoleId: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/employeeList`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  FindResourceIdByRoleId: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/resourceList`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  FindResourceDataScopeIdByRoleId: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/findResourceDataScopeIdByRoleId`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  PageMyRole: {
    url: `${ServicePrefixEnum.BASE}/${MODULAR}/pageMyRole`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
};
// 查询全部角色
export const page = (params: PageParams<BaseRolePageQuery>) =>
  defHttp.request<PageResult<BaseRoleResultVO>>({ ...Api.Page, params });

// 查询全部角色 或 我的角色 或 未绑定的角色
export const pageMyRole = (params: PageParams<BaseRolePageQuery>) =>
  defHttp.request<PageResult<BaseRoleResultVO>>({ ...Api.PageMyRole, params });

export const query = (params?: BaseRolePageQuery) =>
  defHttp.request<BaseRoleResultVO[]>({ ...Api.Query, params });

export const save = (params: BaseRoleSaveVO) =>
  defHttp.request<BaseRoleResultVO>({ ...Api.Save, params });

export const update = (params: BaseRoleUpdateVO) =>
  defHttp.request<BaseRoleResultVO>({ ...Api.Update, params });

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const saveRoleEmployee = (params: RoleEmployeeSaveVO) =>
  defHttp.request<string[]>({ ...Api.SaveRoleEmployee, params });

export const saveRoleResource = (params: BaseRoleResourceRelSaveVO) =>
  defHttp.request<boolean>({ ...Api.SaveRoleResource, params });

export const findEmployeeIdByRoleId = (roleId: string) =>
  defHttp.request<string[]>({ ...Api.FindEmployeeIdByRoleId, params: { roleId } });

export const findResourceIdByRoleId = (roleId: string) =>
  defHttp.request<Recordable>({ ...Api.FindResourceIdByRoleId, params: { roleId } });

export const findResourceDataScopeIdByRoleId = (roleId: string) =>
  defHttp.request<Recordable>({ ...Api.FindResourceDataScopeIdByRoleId, params: { roleId } });
