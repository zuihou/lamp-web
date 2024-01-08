import type { AxiosRequestConfig } from 'axios';
import { ProcessDefinitionDO } from './model/deploymentModel';
import { Model } from './model/modelModel';
import { PageParams, PageResult } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import { Result, UploadFileParams } from '/#/axios';

export const Api = {
  Page: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/page',
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Delete: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/delete',
    method: RequestEnum.DELETE,
  } as AxiosRequestConfig,
  Upload: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/upload',
    method: RequestEnum.POST,
    timeout: 60 * 1000,
  } as AxiosRequestConfig,
  UpdateState: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/updateState',
    method: RequestEnum.PUT,
  } as AxiosRequestConfig,
  SaveModelByPro: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/saveModelByProcessDefinition',
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  GetXml: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/getXml',
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
  GetDiagram: {
    url: ServicePrefixEnum.ACTIVITI + '/definition/getDiagram',
    method: RequestEnum.GET,
    responseType: 'arraybuffer',
  } as AxiosRequestConfig,
};

export const page = (params: PageParams<ProcessDefinitionDO>) =>
  defHttp.request<PageResult<ProcessDefinitionDO>>({ ...Api.Page, params });

export const upload = (
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
) => defHttp.uploadFile<Result<string>>({ ...Api.Upload, onUploadProgress }, params);

export const remove = (params: string[]) => defHttp.request<boolean>({ ...Api.Delete, params });

export const saveModelByPro = (processDefinitionId: string) =>
  defHttp.request<Model>({
    ...Api.SaveModelByPro,
    params: { processDefinitionId },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });

export const updateState = (id: string, suspensionState: string) =>
  defHttp.request<boolean>({
    ...Api.UpdateState,
    params: { id, suspensionState },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
export const getXml = (processDefinitionId: string) =>
  defHttp.request<string>({
    ...Api.GetXml,
    params: { processDefinitionId },
  });
export const getDiagram = (processDefinitionId: string) =>
  defHttp.request<any>(
    {
      ...Api.GetDiagram,
      params: { processDefinitionId },
    },
    { isTransformResponse: false },
  );
