export interface DefLoginLogPageQuery {
  tenantId?: string;
  employeeId?: string;
  userId?: string;
  requestIp?: string;
  nickName?: string;
  username?: string;
  status?: string;
  description?: string;
  loginDate?: string;
  ua?: string;
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  location?: string;
}

export interface DefLoginLogSaveVO {
  tenantId: string;
  employeeId: string;
  userId: string;
  requestIp: string;
  nickName: string;
  username: string;
  status: string;
  description: string;
  loginDate: string;
  ua: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  location: string;
}

export interface DefLoginLogUpdateVO {
  id: string;
  tenantId: string;
  employeeId: string;
  userId: string;
  requestIp: string;
  nickName: string;
  username: string;
  status: string;
  description: string;
  loginDate: string;
  ua: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  location: string;
}

export interface DefLoginLogResultVO {
  tenantId?: string;
  employeeId?: string;
  userId?: string;
  requestIp?: string;
  nickName?: string;
  username?: string;
  status?: string;
  description?: string;
  loginDate?: string;
  ua?: string;
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  location?: string;
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  echoMap?: any;
}
