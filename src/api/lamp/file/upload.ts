import { FileResultVO, AppendixQuery } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';
import { UploadFileParams } from '/#/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import { TimeDelayReq, DelayResult, AsyncResult, CacheKeyFunc } from '/@/utils/lamp/timeDelayReq';
import { errImg } from '/@/utils/file/base64Conver';

/**
 * 上传到 租户库。 此接口适用于将文件上到租户自己的库
 *
 *  此接口要对应 asyncFindUrlById 接口来回显
 * @description: Upload interface
 */
export function uploadToTenant(
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<FileResultVO>(
    {
      url: `${ServicePrefixEnum.FILE}/file/anyone/upload`,
      onUploadProgress,
      // 60 s
      timeout: 60 * 1000,
    },
    params,
  );
}

/**
 * 上传到默认库， 此接口适用于def库的表 上传文件到默认库
 *
 * 此接口要对应 asyncFindDefUrlById 接口来回显
 * @description: Upload interface
 */
export function uploadToDef(
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<FileResultVO>(
    {
      url: `${ServicePrefixEnum.FILE}/file/anyTenant/upload`,
      onUploadProgress,
      // 60 s
      timeout: 60 * 1000,
    },
    params,
  );
}

export const downloadFromTenant = (ids: string[] | number[]) =>
  defHttp.request<any>(
    {
      url: ServicePrefixEnum.FILE + '/file/anyone/download',
      method: RequestEnum.GET,
      responseType: 'blob',
      params: qs.stringify({ ids }, { arrayFormat: 'repeat' }),
    },
    { isReturnNativeResponse: true },
  );

export const downloadFromDef = (ids: string[] | number[]) =>
  defHttp.request<any>(
    {
      url: ServicePrefixEnum.FILE + '/file/anyTenant/download',
      method: RequestEnum.GET,
      responseType: 'blob',
      params: qs.stringify({ ids }, { arrayFormat: 'repeat' }),
    },
    { isReturnNativeResponse: true },
  );

export const findUrlFormTenantById = (params: string[] | number[]) => {
  return defHttp.request<string[]>({
    url: ServicePrefixEnum.FILE + '/file/anyone/findUrlById',
    method: RequestEnum.POST,
    params,
  });
};

export const findUrlFromDefById = (params: string[] | number[]) => {
  return defHttp.request<string[]>({
    url: ServicePrefixEnum.FILE + '/file/anyTenant/findUrlById',
    method: RequestEnum.POST,
    params,
  });
};

export const listByBizId = (params: AppendixQuery) => {
  return defHttp.request<FileResultVO[]>({
    url: params.prefix + '/anyone/appendix/listByBizId',
    method: RequestEnum.POST,
    params: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
};

function buildResult(paramList: Array<any>, cacheKey: CacheKeyFunc, result: string[]) {
  const resultMap: Map<string, DelayResult> = new Map<string, DelayResult>();

  paramList.forEach((param) => {
    const key = cacheKey(param);
    const url = result[param];
    resultMap.set(key, {
      key,
      isOk: url ? true : false,
      data: {
        code: 0,
        data: url ?? errImg,
      },
    });
  });
  return resultMap;
}

const findUrlFormTenantByIdReq = new TimeDelayReq({
  cacheKey: (param: Recordable) => `${param}`,
  // 实现批量请求
  async api(paramList, cacheKey) {
    const result = await findUrlFormTenantById(paramList);
    return buildResult(paramList, cacheKey, result);
  },
});

const findUrlFromDefByIdReq = new TimeDelayReq({
  cacheKey: (param: Recordable) => `${param}`,
  // 实现批量请求
  async api(paramList, cacheKey) {
    const result = await findUrlFromDefById(paramList);
    return buildResult(paramList, cacheKey, result);
  },
});

/**
 * 查询base库的文件
 * @param id base库 base_file表的文件id
 * @returns 访问路径
 */
export async function asyncFindUrlById(id: string): Promise<AsyncResult> {
  return findUrlFormTenantByIdReq.loadByParam(id);
}

/**
 * 查询Def库的文件
 * @param id defalts库 base_file表的文件id
 * @returns 访问路径
 */
export async function asyncFindDefUrlById(id: string): Promise<AsyncResult> {
  return findUrlFromDefByIdReq.loadByParam(id);
}
