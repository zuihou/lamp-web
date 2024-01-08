export interface DefGenTestTreePageQuery {
  name?: string; // 名称
  stock?: number; // 库存
  type?: string; // 商品类型
  type2?: string; // 商品类型2
  type3?: string; // 学历
  state?: boolean; // 状态
  test4?: number; // 测试
  test5?: string; // 时间
  test6?: string; // 日期
  test7?: string; // 字符字典
  test12?: number; // 整形字典
  userId?: string; // 用户
  orgId?: string; // 组织
  test8?: string; // 小数
  test9?: number; // 浮点2
  test10?: number; // 浮点
  test11?: string; // xiao树
  parentId?: string;
  sortValue?: number;
}

export interface DefGenTestTreeSaveVO {
  name?: string; // 名称
  stock?: number; // 库存
  type?: string; // 商品类型
  type2?: string; // 商品类型2
  type3?: string; // 学历
  state?: boolean; // 状态
  test4?: number; // 测试
  test5?: string; // 时间
  test6?: string; // 日期
  test7?: string; // 字符字典
  test12?: number; // 整形字典
  userId?: string; // 用户
  orgId?: string; // 组织
  test8?: string; // 小数
  test9?: number; // 浮点2
  test10?: number; // 浮点
  test11?: string; // xiao树
  parentId?: string;
  sortValue?: number;
}

export interface DefGenTestTreeUpdateVO {
  id: string;
  name?: string; // 名称
  stock?: number; // 库存
  type?: string; // 商品类型
  type2?: string; // 商品类型2
  type3?: string; // 学历
  state?: boolean; // 状态
  test4?: number; // 测试
  test5?: string; // 时间
  test6?: string; // 日期
  test7?: string; // 字符字典
  test12?: number; // 整形字典
  userId?: string; // 用户
  orgId?: string; // 组织
  test8?: string; // 小数
  test9?: number; // 浮点2
  test10?: number; // 浮点
  test11?: string; // xiao树
  parentId?: string;
  sortValue?: number;
}

export interface DefGenTestTreeResultVO {
  echoMap?: any;
  id?: string; // ID
  parentId?: string; // 父id
  sortValue?: number; // 排序
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人
  updatedTime?: string; // 修改时间
  updatedBy?: string; // 修改人
  label?: string; // 名称
  name?: string; // 名称
  stock?: number; // 库存
  type?: string; // 商品类型
  type2?: string; // 商品类型2
  type3?: string; // 学历
  state?: boolean; // 状态
  test4?: number; // 测试
  test5?: string; // 时间
  test6?: string; // 日期
  test7?: string; // 字符字典
  test12?: number; // 整形字典
  userId?: string; // 用户
  orgId?: string; // 组织
  test8?: string; // 小数
  test9?: number; // 浮点2
  test10?: number; // 浮点
  test11?: string; // xiao树
}
