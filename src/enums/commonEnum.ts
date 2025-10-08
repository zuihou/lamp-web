/**
 * 后端服务请求 前缀
 */
export enum ServicePrefixEnum {
  // 系统服务
  TENANT = '/system',
  // 文件服务
  FILE = '/base',
  // 消息服务
  MSG = '/base',
  // 网关
  GATEWAY = '/gateway',
  // 认证服务
  OAUTH = '/oauth',
  // 基础服务
  BASE = '/base',
  // 系统服务
  SYSTEM = '/system',
  // 代码生成器服务
  GENERATOR = '/generator',
  // 工作流
  ACTIVITI = '/activiti',
}

/**
 * 操作列 类型
 */
export enum ActionEnum {
  // 新增
  ADD = 'add',
  // 编辑
  EDIT = 'edit',
  // 复制
  COPY = 'copy',
  // 删除
  DELETE = 'delete',
  // 详情
  VIEW = 'view',
}

export const VALIDATE_API = {
  [ActionEnum.ADD]: 'Save',
  [ActionEnum.EDIT]: 'Update',
  [ActionEnum.COPY]: 'Save',
};

/**
 * 文件的业务 类型
 */
export enum FileBizTypeEnum {
  // 默认库 租户logo
  DEF_TENANT_LOGO = 'DEF__TENANT__LOGO',
  // 默认库 应用logo
  DEF_APPLICATION_LOGO = 'DEF__APPLICATION__LOGO',
  // 基础库 用户头像
  BASE_USER_AVATAR = 'DEF__USER__AVATAR',
  // 基础库 文件中心
  BASE_FILE = 'BASE__FILE',
  // 扩展库 消息内容附件
  EXTEND_MSG_CONTENT = 'EXTEND__MSG__CONTENT',
}

/**
 * 文件的 桶 （需要提前跟后端约定，并让后端配置到OSS中）
 */
export enum FileBucketEnum {
  // 需要自行在华为云或minio等第三方对象存储提前创建 公开读写的桶
  public = 'tt-public',
}

export enum DictEnum {
  APPLICATION_TYPE = 'TENANT_APPLICATION_TYPE',
  DictClassifyEnum = 'DictClassifyEnum',
  // authority
  ApplicationAppTypeEnum = 'ApplicationAppTypeEnum',
  ApplicationGrantTypeEnum = 'ApplicationGrantTypeEnum',
  AREA_LEVEL = 'GLOBAL_AREA_LEVEL',
  AREA_SOURCE = 'TENANT_AREA_SOURCE',
  AuditStatusEnum = 'AuditStatusEnum',
  AuthorizeType = 'AuthorizeType',
  BooleanEnum = 'BooleanEnum',
  CLIENT_TYPE = 'TENANT_CLIENT_TYPE',
  ComponentEnum = 'ComponentEnum',
  DataScopeEnum = 'DataScopeEnum',
  DataScopeType = 'DataScopeType',
  DATASOURCE_CONFIG_DRIVER = 'DATASOURCE_CONFIG_DRIVER',
  DateType = 'DateType',
  DefGenTestSimpleType2Enum = 'DefGenTestSimpleType2Enum',
  DefGenTestTreeType2Enum = 'DefGenTestTreeType2Enum',
  DefTenantRegisterTypeEnum = 'DefTenantRegisterTypeEnum',
  DefTenantStatusEnum = 'DefTenantStatusEnum',
  DICT_GROUP = 'DICT_GROUP',
  DictDataTypeEnum = 'DictDataTypeEnum',
  EchoDictType_Base_NOTICE_TARGET = 'NOTICE_TARGET',

  EDUCATION = 'GLOBAL_EDUCATION',
  EntitySuperClassEnum = 'EntitySuperClassEnum',
  FileOverrideStrategyEnum = 'FileOverrideStrategyEnum',
  FileStorageType = 'FileStorageType',
  // file
  FileType = 'FileType',
  GenTypeEnum = 'GenTypeEnum',
  // 全局
  HttpMethod = 'HttpMethod',
  I18N_JSON = 'I18N_JSON',
  InterfaceExecModeEnum = 'InterfaceExecModeEnum',
  LoginStatusEnum = 'LoginStatusEnum',

  LogType = 'LogType',
  MsgInterfaceLoggingStatusEnum = 'MsgInterfaceLoggingStatusEnum',
  MsgTemplateTypeEnum = 'MsgTemplateTypeEnum',

  NATION = 'GLOBAL_NATION',
  NoticeRemindModeEnum = 'NoticeRemindModeEnum',
  OrgTypeEnum = 'OrgTypeEnum',
  PARAMETER_TYPE = 'TENANT_PARAMETER_TYPE',
  PopupTypeEnum = 'PopupTypeEnum',
  // base
  POSITION_STATUS = 'BASE_POSITION_STATUS',
  // test
  ProductType = 'ProductType',
  ProjectTypeEnum = 'ProjectTypeEnum',

  ProviderType = 'ProviderType',
  ResourceOpenWithEnum = 'ResourceOpenWithEnum',
  ResourceTypeEnum = 'ResourceTypeEnum',
  // tenant
  RoleCategoryEnum = 'RoleCategoryEnum',
  SendStatus = 'SendStatus',
  Sex = 'Sex',
  // 接口模式
  SOP_API_INFO_API_MODE = 'SOP_API_INFO_API_MODE',
  // 注册来源
  SOP_API_INFO_REG_SOURCE = 'SOP_API_INFO_REG_SOURCE',
  // 创建方式
  SOP_ISV_CREATION_METHOD = 'SOP_ISV_CREATION_METHOD',
  // 秘钥格式
  SOP_ISV_KEYS_KEY_FORMAT = 'SOP_ISV_KEYS_KEY_FORMAT',
  SourceType = 'SourceType',
  SqlConditionEnum = 'SqlConditionEnum',
  SuperClassEnum = 'SuperClassEnum',
  // msg
  TaskStatus = 'TaskStatus',
  TemplateEnum = 'TemplateEnum',

  // tenant
  TenantConnectTypeEnum = 'TenantConnectTypeEnum',
  TenantStatusEnum = 'TenantStatusEnum',
  TenantTypeEnum = 'TenantTypeEnum',

  TplEnum = 'TplEnum',
}

export enum MsgTemplateCodeEnum {
  // 注册短信
  REGISTER_SMS = 'REGISTER_SMS',
  // 注册邮件验证码
  REGISTER_EMAIL = 'REGISTER_EMAIL',
  //手机登录短信
  MOBILE_LOGIN = 'MOBILE_LOGIN',
  MOBILE_EDIT = 'MOBILE_EDIT',
  EMAIL_EDIT = 'EMAIL_EDIT',
}
