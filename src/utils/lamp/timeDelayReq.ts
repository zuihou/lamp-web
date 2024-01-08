// 延时请求结果
export interface AsyncResult {
  code: number;
  data: string | number | Recordable;
  msg?: string;
}
export interface DelayResult {
  key: string;
  data: AsyncResult;
  endTime?: number;
  isOk: boolean;
}

export type CacheKeyFunc = (data: Recordable) => string;
type ApiFunc = (paramList: Array<any>, cacheKey: CacheKeyFunc) => Promise<Map<string, DelayResult>>;
type ErrorDataFunc = (param: any, error, reject) => AsyncResult;

// 初始化参数
// getErrorData如果没传，遇到错误的时候会把异常抛给每一个reject，如果有则按getErrorData规则执行
export interface InitOption {
  cacheTime?: number;
  api: ApiFunc;
  cacheKey?: CacheKeyFunc;
  delay?: number;
  getErrorData?: (param: any, error, reject) => AsyncResult;
  isUseCache?: boolean;
}
// 延时请求工具类
export class TimeDelayReq {
  timeoutId: NodeJS.Timeout | null = null; // 倒计时id
  tempParam: Array<any> = []; // 零时参数存放
  resMap: Map<string, DelayResult> = new Map<string, DelayResult>(); // 结果集缓存
  cacheTime = 60 * 1000 * 30; // 默认缓存30分钟
  delay = 100; // 请求延时
  isUseCache = true; // 是否使用缓存
  cacheKey: CacheKeyFunc = JSON.stringify; // 默认获取缓存key的方式
  api: ApiFunc = async () => new Map<string, DelayResult>(); // 具体执行请求的方法
  getErrorData: ErrorDataFunc | undefined = undefined; // 错误处理函数
  // 构造函数需要传配置值
  constructor(initOption: InitOption) {
    const { api, getErrorData, cacheKey, cacheTime, delay, isUseCache } = initOption;
    this.api = api;
    this.cacheTime = cacheTime || this.cacheTime;
    this.cacheKey = cacheKey || this.cacheKey;
    this.getErrorData = getErrorData;
    this.delay = delay || 100;
    this.isUseCache = isUseCache || false;
  }
  // 清空缓存
  clear() {
    this.resMap.clear();
  }
  // 清空超时内容
  clearTimeoutCache() {
    // 清空超时的缓存
    for (const key1 of this.resMap.keys()) {
      const item: DelayResult | undefined = this.resMap.get(key1);
      if (item && (item.endTime || 0) < new Date().getTime()) {
        this.resMap.delete(key1);
      }
    }
  }
  // 缓存的KEY 默认是JSON字串
  _loadFormCache(param: any) {
    const key = this.cacheKey(param);
    this.clearTimeoutCache();
    const res = this.resMap.get(key);
    if (res) {
      return res.data;
    }
    return null;
  }
  // 单次请求，缓存有取缓存，缓存没有放进延迟请求参数中，延迟批量请求
  async loadByParam(param: any): Promise<AsyncResult> {
    const result = new Promise<AsyncResult>((resolve, reject) => {
      if (this.isUseCache) {
        try {
          const cache = this._loadFormCache(param);
          if (cache) {
            resolve(cache);
            return;
          }
        } catch (error) {}
      }
      this._loadFromApi(param, resolve, reject);
    });
    return result;
  }
  //  处理请求参数合并的问题
  _loadFromApi(param: any, resolve, reject) {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.tempParam.push({ param, resolve, reject });
    this.timeoutId = setTimeout(() => {
      const paramList = this.tempParam;
      this.tempParam = [];
      this._loadByParams(paramList);
    }, this.delay);
  }
  // 合并请求
  async _loadByParams(paramList: Array<Recordable>) {
    const errRejMap: Map<string, any> = new Map();
    const formatParamList = paramList.map((item) => item.param);
    try {
      const res: Map<string, DelayResult> = await this.api(formatParamList, this.cacheKey);
      const endTime = new Date().getTime() + this.cacheTime;

      const successMap: Map<string, DelayResult> = new Map();
      paramList.forEach((itemParam) => {
        const key = this.cacheKey(itemParam.param);
        const item: DelayResult | undefined = res.get(key);
        if (item) {
          if (item.isOk) {
            // 请求正确
            item.endTime = endTime;
            itemParam.resolve(item.data);
            successMap.set(key, item);
          } else {
            // 请求有错
            itemParam.resolve(item.data);
            res.delete(key);
          }
        } else {
          errRejMap.set(key, itemParam);
        }
      });

      // 写入缓存
      for (const key of successMap.keys()) {
        const item = res.get(key);
        if (item) {
          this.resMap.set(key, item);
        }
      }
      // 处理没有结果的内容
      this.doError(errRejMap, Error('请求无结果'));
    } catch (error: any) {
      this.doError(errRejMap, error);
    }
  }

  doError(resRejMap: Map<string, any>, error: any) {
    if (this.getErrorData) {
      for (const key of resRejMap.keys()) {
        const item = resRejMap.get(key);
        const errData = this.getErrorData(item.param, error, item.reject);
        if (errData) {
          item.resolve(errData);
        }
      }
    } else {
      for (const key of resRejMap.keys()) {
        resRejMap.get(key).reject(error);
      }
    }
  }
}
