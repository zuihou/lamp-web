export interface DefParameterPageQuery {
  key?: string;
  value?: string;
  name?: string;
  remarks?: string;
  state?: boolean;
  paramType?: string;
}

export interface DefParameterSaveVO {
  key: string;
  value: string;
  name: string;
  remarks: string;
  state: boolean;
  paramType: string;
}

export interface DefParameterUpdateVO {
  id: string;
  key: string;
  value: string;
  name: string;
  remarks: string;
  state: boolean;
  paramType: string;
}

export interface DefParameterResultVO {
  key?: string;
  value?: string;
  name?: string;
  remarks?: string;
  state?: boolean;
  paramType?: string;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}
