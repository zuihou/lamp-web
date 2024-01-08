import { DefResourceResultVO } from './defResourceModel';

export interface ApplicationResourceResultVO {
  defApplication: DefApplicationResultVO;
  resourceList: DefResourceResultVO[];
}
export interface DefApplicationPageQuery {
  appKey?: string;
  appSecret?: string;
  name?: string;
  version?: string;
  type?: string;
  introduce?: string;
  remark?: string;
  url?: string;
  isVisible?: boolean;
  sortValue?: number;
  id?: string;
}

export interface DefApplicationSaveVO {
  appKey: string;
  appSecret: string;
  name: string;
  version: string;
  type: string;
  introduce: string;
  remark: string;
  url: string;
  isVisible: boolean;
  sortValue: number;
}

export interface DefApplicationUpdateVO {
  id: string;
  appKey: string;
  appSecret: string;
  name: string;
  version: string;
  type: string;
  introduce: string;
  remark: string;
  url: string;
  isVisible: boolean;
  sortValue: number;
}

export interface DefApplicationResultVO {
  appKey?: string;
  appSecret?: string;
  name?: string;
  version?: string;
  type?: string;
  introduce?: string;
  remark?: string;
  url?: string;
  isVisible?: boolean;
  sortValue?: number;
  id: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
  // 扩展字段
  expirationTime: string;
  state: string;
}
