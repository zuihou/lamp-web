export enum DictClassifyEnum {
  SYSTEM = '10',
  BUSINESS = '20',
}

export enum LogTypeEnum {
  OPT = 'OPT',
  EX = 'EX',
}

export enum DataTypeEnum {
  SYSTEM = '10',
  BUSINESS = '20',
}

export enum OrgTypeEnum {
  COMPANY = '10',
  DEPT = '20',
}

// 角色类别
export enum RoleCategoryEnum {
  FUNCTION = '10',
  DESKTOP = '20',
  DATA_SCOPE = '30',
}

// 绑定范围类型
export enum ScopeTypeEnum {
  EMPLOYEE = '1',
  ORG = '2',
}

export const categoryMap = new Map();
categoryMap.set(RoleCategoryEnum.FUNCTION, 'success');
categoryMap.set(RoleCategoryEnum.DATA_SCOPE, 'error');
categoryMap.set(RoleCategoryEnum.DESKTOP, 'processing');

// 项目类型
export enum ProjectTypeEnum {
  CLOUD = 'CLOUD',
  BOOT = 'BOOT',
}

export enum InterfaceExecModeEnum {
  IMPL_CLASS = '01',
  SCRIPT = '02',
}

export enum MsgTemplateTypeEnum {
  SMS = '01',
  EMAIL = '02',
  NOTICE = '03',
}

//[01-待办 02-预警 03-提醒]
export enum NoticeRemindModeEnum {
  TO_DO = '01',
  EARLY_WARNING = '02',
  NOTICE = '03',
}

//发送渠道
export enum SourceTypeEnum {
  // 应用
  APP = 'APP',
  // 服务
  SERVICE = 'SERVICE',
}

// 执行日志状态 [01-初始化 02-成功 03-失败]
export enum MsgInterfaceLoggingStatusEnum {
  INIT = '01',
  SUCCESS = '02',
  FAIL = '03',
}

//执行状态
export enum TaskStatusEnum {
  //草稿
  DRAFT = 'DRAFT',
  //等待执行
  WAITING = 'WAITING',
  //执行成功
  SUCCESS = 'SUCCESS',
  //执行失败
  FAIL = 'FAIL',
}
