export interface ExtendInterfaceLogPageQuery {
  interfaceId?: string; // 接口ID
  name?: string; // 接口名称
  successCount?: number; // 成功次数
  failCount?: number; // 失败次数
  lastExecTime?: string; // 最后执行时间
}

export interface ExtendInterfaceLogSaveVO {
  interfaceId?: string; // 接口ID
  name?: string; // 接口名称
  successCount?: number; // 成功次数
  failCount?: number; // 失败次数
  lastExecTime?: string; // 最后执行时间
}

export interface ExtendInterfaceLogUpdateVO {
  id: string;
  interfaceId?: string; // 接口ID
  name?: string; // 接口名称
  successCount?: number; // 成功次数
  failCount?: number; // 失败次数
  lastExecTime?: string; // 最后执行时间
}

export interface ExtendInterfaceLogResultVO {
  echoMap?: any;
  id?: string; //
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人
  updatedTime?: string; // 修改时间
  updatedBy?: string; // 修改人
  interfaceId?: string; // 接口ID
  name?: string; // 接口名称
  successCount?: number; // 成功次数
  failCount?: number; // 失败次数
  lastExecTime?: string; // 最后执行时间
}
