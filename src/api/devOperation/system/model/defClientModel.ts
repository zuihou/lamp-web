export interface DefClientPageQuery {
  clientId?: string;
  clientSecret?: string;
  name?: string;
  type?: string;
  remarks?: string;
  state?: boolean;
}

export interface DefClientSaveVO {
  clientId: string;
  clientSecret: string;
  name: string;
  type: string;
  remarks: string;
  state: boolean;
}

export interface DefClientUpdateVO {
  id: string;
  clientId: string;
  clientSecret: string;
  name: string;
  type: string;
  remarks: string;
  state: boolean;
}

export interface DefClientResultVO {
  clientId?: string;
  clientSecret?: string;
  name?: string;
  type?: string;
  remarks?: string;
  state?: boolean;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}
