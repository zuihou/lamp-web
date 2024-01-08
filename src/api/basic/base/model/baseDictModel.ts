export interface BaseDictPageQuery {
  classify?: string;
  key?: string;
  name?: string;
  state?: boolean;
  remark?: string;
  sortValue?: number;
}

export interface BaseDictSaveVO {
  key: string;
  classify: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
}

export interface BaseDictUpdateVO {
  id: string;
  key: string;
  classify: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
}

export interface BaseDictResultVO {
  key?: string;
  classify?: string;
  name?: string;
  state?: boolean;
  remark?: string;
  sortValue?: number;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}
