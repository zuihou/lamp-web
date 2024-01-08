export interface BaseDictItemPageQuery {
  parentId?: string;
  parentKey?: string;
  key?: string;
  classify?: string;
  name?: string;
  state?: boolean;
  remark?: string;
  sortValue?: number;
  icon?: string;
  cssStyle?: string;
  cssClass?: string;
}

export interface BaseDictItemSaveVO {
  parentId: string;
  parentKey: string;
  key: string;
  classify: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
  icon: string;
  cssStyle: string;
  cssClass: string;
}

export interface BaseDictItemUpdateVO {
  id: string;
  parentId: string;
  parentKey: string;
  key: string;
  classify: string;
  name: string;
  state: boolean;
  remark: string;
  sortValue: number;
  icon: string;
  cssStyle: string;
  cssClass: string;
}

export interface BaseDictItemResultVO {
  parentId?: string;
  parentKey?: string;
  key?: string;
  classify?: string;
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
