export interface DefInterfacePageQuery {
  code?: string; // 接口编码
  name?: string; // 接口名称
  execMode?: string; // 执行方式
  script?: string; // 实现脚本
  implClass?: string; // 实现类
  state?: boolean; // 状态
}

export interface DefInterfaceSaveVO {
  code?: string; // 接口编码
  name?: string; // 接口名称
  execMode?: string; // 执行方式
  script?: string; // 实现脚本
  implClass?: string; // 实现类
  state?: boolean; // 状态
}

export interface DefInterfaceUpdateVO {
  id: string;
  code?: string; // 接口编码
  name?: string; // 接口名称
  execMode?: string; // 执行方式
  script?: string; // 实现脚本
  implClass?: string; // 实现类
  state?: boolean; // 状态
}

export interface DefInterfaceResultVO {
  echoMap?: any;
  id?: string;
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人
  updatedTime?: string; // 修改时间
  updatedBy?: string; // 修改人
  code?: string; // 接口编码
  name?: string; // 接口名称
  execMode?: string; // 执行方式
  script?: string; // 实现脚本
  implClass?: string; // 实现类
  state?: boolean; // 状态
}
