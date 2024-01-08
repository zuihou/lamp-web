import { ProjectGeneratorVO } from './model/defGenProjectModel';
import { defHttp } from '/@/utils/http/axios';
import { RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import type { AxiosRequestConfig } from 'axios';

const MODULAR = 'defGenProject';

export const Api = {
  GetDef: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/getDef`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Generator: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/generator`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Download: {
    url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/download`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
};

export const getDef = () => defHttp.request<ProjectGeneratorVO>({ ...Api.GetDef });

export const generator = (params: ProjectGeneratorVO) =>
  defHttp.request<boolean>({
    ...Api.Generator,
    params,
  });
export const download = (params: ProjectGeneratorVO) =>
  defHttp.request<any>(
    {
      ...Api.Download,
      responseType: 'blob',
      params,
    },
    { isReturnNativeResponse: true },
  );
