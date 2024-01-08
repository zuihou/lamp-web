export interface ExtendInterfacePropertyPageQuery {
  interfaceId?: string; // 接口ID
  name?: string; // 参数名称
  key?: string; // 参数键
  value?: string; // 参数值
  sortValue?: number; // 顺序号
  remarks?: string; // 备注
}

export interface ExtendInterfacePropertyBatchSaveVO {
  insertRecords?: ExtendInterfacePropertySaveVO[];
  updateRecords?: ExtendInterfacePropertySaveVO[];
  removeRecords?: ExtendInterfacePropertySaveVO[];
  pendingRecords?: ExtendInterfacePropertySaveVO[];
}

export interface ExtendInterfacePropertySaveVO {
  interfaceId?: string; // 接口ID
  name?: string; // 参数名称
  key?: string; // 参数键
  value?: string; // 参数值
  sortValue?: number; // 顺序号
  remarks?: string; // 备注
}

export interface ExtendInterfacePropertyUpdateVO {
  id: string;
  interfaceId?: string; // 接口ID
  name?: string; // 参数名称
  key?: string; // 参数键
  value?: string; // 参数值
  sortValue?: number; // 顺序号
  remarks?: string; // 备注
}

export interface ExtendInterfacePropertyResultVO {
  echoMap?: any;
  id?: string; // ID
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人
  updatedTime?: string; // 修改时间
  updatedBy?: string; // 修改人
  interfaceId?: string; // 接口ID
  name?: string; // 参数名称
  key?: string; // 参数键
  value?: string; // 参数值
  sortValue?: number; // 顺序号
  remarks?: string; // 备注
}
