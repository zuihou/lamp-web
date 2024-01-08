export interface BasePositionPageQuery {
  name?: string;
  orgId?: string;
  state?: boolean;
  remarks?: string;
}

export interface BasePositionSaveVO {
  name: string;
  orgId: string;
  state: boolean;
  remarks: string;
}

export interface BasePositionUpdateVO {
  id: string;
  name: string;
  orgId: string;
  state: boolean;
  remarks: string;
}

export interface BasePositionResultVO {
  name?: string;
  orgId?: string;
  state?: boolean;
  remarks?: string;
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  echoMap?: any;
}
