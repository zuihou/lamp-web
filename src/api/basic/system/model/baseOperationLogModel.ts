export interface BaseOperationLogPageQuery {
  requestIp?: string;
  type?: string;
  userName?: string;
  description?: string;
  classPath?: string;
  actionMethod?: string;
  requestUri?: string;
  httpMethod?: string;
  startTime?: string;
  finishTime?: string;
  consumingTime?: string;
  ua?: string;
  createdOrgId?: string;
}

export interface BaseOperationLogSaveVO {
  requestIp: string;
  type: string;
  userName: string;
  description: string;
  classPath: string;
  actionMethod: string;
  requestUri: string;
  httpMethod: string;
  startTime: string;
  finishTime: string;
  consumingTime: string;
  ua: string;
  createdOrgId: string;
}

export interface BaseOperationLogUpdateVO {
  id: string;
  requestIp: string;
  type: string;
  userName: string;
  description: string;
  classPath: string;
  actionMethod: string;
  requestUri: string;
  httpMethod: string;
  startTime: string;
  finishTime: string;
  consumingTime: string;
  ua: string;
  createdOrgId: string;
}

export interface BaseOperationLogResultVO {
  requestIp?: string;
  type?: string;
  userName?: string;
  description?: string;
  classPath?: string;
  actionMethod?: string;
  requestUri?: string;
  httpMethod?: string;
  startTime?: string;
  finishTime?: string;
  consumingTime?: string;
  ua?: string;
  createdOrgId?: string;
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  echoMap?: any;
}
