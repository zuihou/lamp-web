export interface DefDictItemPageQuery {
  parentId?: string;
  parentKey?: string;
  classify?: string;
  key?: string;
  name?: string;
  state?: boolean;
  remark?: string;
  sortValue?: number;
  icon?: string;
  cssStyle?: string;
  cssClass?: string;
}

export interface DefDictItemSaveVO {
  parentId: string;
  parentKey: string;
  classify: string;
  key: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
  icon: string;
  cssStyle: string;
  cssClass: string;
}

export interface DefDictItemUpdateVO {
  id: string;
  parentId: string;
  parentKey: string;
  classify: string;
  key: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
  icon: string;
  cssStyle: string;
  cssClass: string;
}

export interface DefDictItemResultVO {
  parentId?: string;
  parentKey?: string;
  classify?: string;
  key?: string;
  name?: string;
  state?: boolean;
  remark?: string;
  sortValue?: number;
  icon?: string;
  cssStyle?: string;
  cssClass?: string;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}
