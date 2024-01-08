export interface ExtendInterfaceLoggingPageQuery {
  logId?: string; // 接口日志ID
  execTime?: string; // 执行时间
  status?: string; // 执行状态
  params?: string; // 请求参数
  result?: string; // 接口返回
  bizId?: string; // 业务ID
}

export interface ExtendInterfaceLoggingSaveVO {
  logId?: string; // 接口日志ID
  execTime?: string; // 执行时间
  status?: string; // 执行状态
  params?: string; // 请求参数
  result?: string; // 接口返回
  bizId?: string; // 业务ID
}

export interface ExtendInterfaceLoggingUpdateVO {
  id: string;
  logId?: string; // 接口日志ID
  execTime?: string; // 执行时间
  status?: string; // 执行状态
  params?: string; // 请求参数
  result?: string; // 接口返回
  bizId?: string; // 业务ID
}

export interface ExtendInterfaceLoggingResultVO {
  echoMap?: any;
  id?: string; //
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人
  updatedTime?: string; // 修改时间
  updatedBy?: string; // 修改人
  logId?: string; // 接口日志ID
  execTime?: string; // 执行时间
  status?: string; // 执行状态
  params?: string; // 请求参数
  result?: string; // 接口返回
  bizId?: string; // 业务ID
}
