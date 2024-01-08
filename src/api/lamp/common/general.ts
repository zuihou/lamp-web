import { defHttp } from '/@/utils/http/axios';
import { ServicePrefixEnum } from '/@/enums/commonEnum';
import { OptionsGetResultModel, CodeQueryVO, SystemApiVO } from './model/optionsModel';
import { RequestEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { TimeDelayReq, DelayResult, AsyncResult } from '/@/utils/lamp/timeDelayReq';

export const Api = {
  SystemApiScan: (serviceProfix: string) => {
    return {
      url: `/${serviceProfix}/anyone/systemApiScan`,
      method: RequestEnum.GET,
    };
  },
  FindEnumListByType: {
    url: `${ServicePrefixEnum.OAUTH}/anyTenant/enums/findEnumListByType`,
    method: RequestEnum.POST,
  },
  FindCodeListByType: {
    url: `${ServicePrefixEnum.OAUTH}/anyUser/dict/findDictMapItemListByKey`,
    method: RequestEnum.POST,
  },
  Params: {
    url: `${ServicePrefixEnum.OAUTH}/anyUser/parameter/value`,
    method: RequestEnum.GET,
  },
};

export const findSystemApi = (serviceProfix: string) => {
  return defHttp.request<Map<String, SystemApiVO[]>>({ ...Api.SystemApiScan(serviceProfix) });
};

/**
 * @description: Get 蜜桔
 */
export const findEnumListByType = (params: CodeQueryVO[] = []) => {
  return defHttp.request<OptionsGetResultModel>({ ...Api.FindEnumListByType, params });
};

/**
 * @description: Get 字典
 */
export const findCodeListByType = (params: CodeQueryVO[] = []) => {
  return defHttp.request<OptionsGetResultModel>({
    ...Api.FindCodeListByType,
    params,
  });
};
export const findParams = (params: string[] | string = []) => {
  if (isString(params)) {
    params = [params];
  }
  return defHttp.request<string>({ ...Api.Params, params });
};

const codeTimeDelayReq = new TimeDelayReq({
  cacheKey: (param) => `${param?.type}`,
  getErrorData(_param, error, _reject) {
    return {
      code: 400,
      msg: error.message || '请求错误',
      data: [],
    };
  },
  // 实现批量请求
  async api(paramList, cacheKey) {
    const data = await findCodeListByType(paramList);
    const resultMap: Map<string, DelayResult> = new Map<string, DelayResult>();
    paramList.forEach((param) => {
      const key = cacheKey(param);
      const dictList = data[param?.type];
      if (dictList) {
        resultMap.set(key, {
          key,
          isOk: true,
          data: {
            code: 0,
            data: dictList,
          },
        });
      }
    });
    return resultMap;
  },
});

export async function asyncFindDictList(param: Recordable): Promise<AsyncResult> {
  return codeTimeDelayReq.loadByParam(param);
}

const enumTimeDelayReq = new TimeDelayReq({
  cacheKey: (param: any) => `${param?.type}`,
  getErrorData(_param: any, error, _reject) {
    return {
      code: 400,
      msg: error?.message || '请求错误',
      data: [],
    };
  },
  // 实现批量请求
  async api(paramList, cacheKey) {
    const data = await findEnumListByType(paramList);
    const resultMap: Map<string, DelayResult> = new Map<string, DelayResult>();
    paramList.forEach((param) => {
      const key = cacheKey(param);
      const enumList = data[param?.type];
      if (enumList) {
        resultMap.set(key, {
          key,
          isOk: true,
          data: {
            code: 0,
            data: enumList,
          },
        });
      }
    });
    return resultMap;
  },
});

export async function asyncFindEnumList(code: Recordable): Promise<AsyncResult> {
  return await enumTimeDelayReq.loadByParam(code);
}
