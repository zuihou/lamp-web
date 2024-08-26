import { FileResultVO, AppendixQuery, AppendixResultVO } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';
import type { AxiosProgressEvent } from 'axios';
import { UploadFileParams } from '/#/axios';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import { TimeDelayReq, DelayResult, AsyncResult, CacheKeyFunc } from '/@/utils/lamp/timeDelayReq';
import { errImg } from '/@/utils/file/base64Conver';

/**
 * 上传
 *
 * @description: Upload interface
 */
export function uploadFile(
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<FileResultVO>(
    {
      url: `${ServicePrefixEnum.FILE}/anyone/file/upload`,
      onUploadProgress,
      // 60 s
      timeout: 60 * 1000,
    },
    params,
  );
}

export const downloadFile = (ids: string[] | number[]) =>
  defHttp.request<any>(
    {
      url: ServicePrefixEnum.FILE + '/anyone/file/download',
      method: RequestEnum.GET,
      responseType: 'blob',
      params: qs.stringify({ ids }, { arrayFormat: 'repeat' }),
    },
    { isReturnNativeResponse: true },
  );

/**
 * 根据文件id获取文件url
 *
 * @param params 文件id
 * @returns
 */
export const findUrlById = (params: string[] | number[]) => {
  return defHttp.request<string[]>({
    url: `${ServicePrefixEnum.BASE}/anyone/file/findUrlById`,
    method: RequestEnum.POST,
    params,
  });
};

/**
 * 根据业务id和业务类型，查询附件
 *
 * @param params 附件参数
 * @returns
 */
export const listByBizId = (params: AppendixQuery) => {
  return defHttp.request<AppendixResultVO[]>({
    url: `${ServicePrefixEnum.BASE}/anyone/appendix/listByBizId`,
    method: RequestEnum.POST,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
};
export const listFileByBizId = (params: AppendixQuery) => {
  return defHttp.request<FileResultVO[]>({
    url: `${ServicePrefixEnum.BASE}/anyone/appendix/listFileByBizId`,
    method: RequestEnum.POST,
    params,
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

const findUrlByIdReq = new TimeDelayReq({
  cacheKey: (param: Recordable) => `${param}`,
  // 实现批量请求
  async api(paramList, cacheKey) {
    const result = await findUrlById(paramList);
    return buildResult(paramList, cacheKey, result);
  },
});

/**
 * 异步批量查询文件
 *
 * @param id 文件id
 * @returns 访问路径
 */
export async function asyncFindUrlById(id: string): Promise<AsyncResult> {
  return findUrlByIdReq.loadByParam(id);
}
