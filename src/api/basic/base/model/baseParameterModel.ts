export interface BaseParameterPageQuery {
  key?: string;
  value?: string;
  name?: string;
  remarks?: string;
  state?: boolean;
  paramType?: string;
  createdOrgId?: string;
}

export interface BaseParameterSaveVO {
  key: string;
  value: string;
  name: string;
  remarks: string;
  state: boolean;
  paramType: string;
  createdOrgId: string;
}

export interface BaseParameterUpdateVO {
  id: string;
  key: string;
  value: string;
  name: string;
  remarks: string;
  state: boolean;
  paramType: string;
  createdOrgId: string;
}

export interface BaseParameterResultVO {
  key?: string;
  value?: string;
  name?: string;
  remarks?: string;
  state?: boolean;
  paramType?: string;
  createdOrgId?: string;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}
