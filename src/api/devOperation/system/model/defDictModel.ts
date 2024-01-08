export interface DefDictPageQuery {
  classify?: string;
  key?: string;
  name?: string;
  state?: boolean;
  remark?: string;
  sortValue?: number;
}

export interface DefDictSaveVO {
  classify: string;
  key: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
}

export interface DefDictUpdateVO {
  id: string;
  classify: string;
  key: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
}

export interface DefDictResultVO {
  classify?: string;
  key?: string;
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
