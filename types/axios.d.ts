export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;
export type SuccessMessageMode = ErrorMessageMode;

export interface RequestOptions {
  // 将请求参数拼接到url
  joinParamsToUrl?: boolean;
  // 格式化请求参数时间
  formatDate?: boolean;
  // 是否处理请求结果
  isTransformResponse?: boolean;
  // 是否返回本地响应头,需要获取响应头时使用此属性
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // 接口地址，如果保留为空，则使用默认值
  apiUrl?: string;
  // 请求拼接路径
  urlPrefix?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // Success message prompt type
  successMessageMode?: SuccessMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // 是否在标头中发送令牌
  withToken?: boolean;
  withTenant?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
}

export interface RetryRequest {
  isOpenRetry: boolean;
  count: number;
  waitTime: number;
}
export interface Result<T = any> {
  isSuccess: boolean;
  code: number;
  msg: string;
  data: T;
  path?: string;
  extra: any;
  timestamp: string;
  errorMsg: string;
}

//文件上传参数
export interface UploadFileParams {
  // 其他的扩展参数
  data?: Recordable;
  // 后台用于接收file对象的参数名称
  name?: string;
  // file name
  file: File | Blob;
  // 传给后端的，文件名
  filename?: string;
  [key: string]: any;
}
