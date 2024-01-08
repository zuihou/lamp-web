export enum RoleEnum {
  // super admin
  SUPER = 'super',

  // tester
  TEST = 'test',

  // 运营系统
  // 数据源维护
  TENANT_DATASOURCE_CONFIG_ADD = 'tenant:tenant:datasourceConfig:add',
  TENANT_DATASOURCE_CONFIG_EDIT = 'tenant:tenant:datasourceConfig:edit',
  TENANT_DATASOURCE_CONFIG_DELETE = 'tenant:tenant:datasourceConfig:delete',
  TENANT_DATASOURCE_CONFIG_VIEW = 'tenant:tenant:datasourceConfig:view',
  TENANT_DATASOURCE_CONFIG_DEBUG = 'tenant:tenant:datasourceConfig:test',

  // 租户维护
  TENANT_TENANT_ADD = 'tenant:tenant:tenant:add',
  TENANT_TENANT_EDIT = 'tenant:tenant:tenant:edit',
  TENANT_TENANT_DELETE = 'tenant:tenant:tenant:delete',
  TENANT_TENANT_VIEW = 'tenant:tenant:tenant:view',
  TENANT_TENANT_INIT_DATA = 'tenant:tenant:tenant:initData',
  TENANT_TENANT_INIT_DATA_SOURCE = 'tenant:tenant:tenant:initDataSource',
  TENANT_TENANT_BIND_USER = 'tenant:tenant:tenant:bindUser',
  TENANT_TENANT_TO_EXAMINE = 'tenant:tenant:tenant:toExamine',
  TENANT_TENANT_VIEW_UNBIND = 'tenant:tenant:tenant:view:unBind',

  // 用户维护
  TENANT_USER_ADD = 'tenant:tenant:user:add',
  TENANT_USER_EDIT = 'tenant:tenant:user:edit',
  TENANT_USER_DELETE = 'tenant:tenant:user:delete',
  TENANT_USER_VIEW = 'tenant:tenant:user:view',
  TENANT_USER_RESET_PWD = 'tenant:tenant:user:reset:password',

  // 应用
  APPLICATION_ADD = 'tenant:application:application:add',
  APPLICATION_DELETE = 'tenant:application:application:delete',
  APPLICATION_EDIT = 'tenant:application:application:edit',
  APPLICATION_COPY = 'tenant:application:application:copy',
  APPLICATION_RESOURCE = 'tenant:application:application:resource',
  APPLICATION_IS_VISIBLE = 'tenant:application:application:isVisible',
  // 应用资源
  APPLICATION_RESOURCE_ADD = 'tenant:application:application:resource:add',
  APPLICATION_RESOURCE_MOVE = 'tenant:application:application:resource:move',
  APPLICATION_RESOURCE_EDIT = 'tenant:application:application:resource:edit',
  APPLICATION_RESOURCE_DELETE = 'tenant:application:application:resource:delete',
  // 资源
  RESOURCE_MOVE = 'tenant:application:resource:move',
  RESOURCE_ADD = 'tenant:application:resource:add',
  RESOURCE_EDIT = 'tenant:application:resource:edit',
  RESOURCE_DELETE = 'tenant:application:resource:delete',
  // 应用授权
  APPLICATION_AUTHORIZE_GRANT = 'tenant:application:authorize:grant',
  APPLICATION_AUTHORIZE_RENEWAL = 'tenant:application:authorize:renewal',
  APPLICATION_AUTHORIZE_CANCEL = 'tenant:application:authorize:cancel',

  // 字典
  SYSTEM_DICT_ADD = 'tenant:system:dict:add',
  SYSTEM_DICT_EDIT = 'tenant:system:dict:edit',
  SYSTEM_DICT_DELETE = 'tenant:system:dict:delete',
  SYSTEM_DICT_ADD_ITEM = 'tenant:system:dict:addItem',
  SYSTEM_DICT_EDIT_ITEM = 'tenant:system:dict:editItem',
  SYSTEM_DICT_DELETE_ITEM = 'tenant:system:dict:deleteItem',
  // 参数维护
  SYSTEM_PARAM_ADD = 'tenant:system:param:add',
  SYSTEM_PARAM_EDIT = 'tenant:system:param:edit',
  SYSTEM_PARAM_DELETE = 'tenant:system:param:delete',
  SYSTEM_PARAM_VIEW = 'tenant:system:param:view',
  // 地区维护
  SYSTEM_AREA_ADD = 'tenant:system:area:add',
  SYSTEM_AREA_EDIT = 'tenant:system:area:edit',
  SYSTEM_AREA_DELETE = 'tenant:system:area:delete',
  // 客户端维护
  SYSTEM_CLIENT_ADD = 'tenant:system:client:add',
  SYSTEM_CLIENT_EDIT = 'tenant:system:client:edit',
  SYSTEM_CLIENT_DELETE = 'tenant:system:client:delete',
  SYSTEM_CLIENT_VIEW = 'tenant:system:client:view',
  // 客户端维护
  SYSTEM_LOGIN_LOG_DELETE = 'tenant:system:loginLog:delete',
  SYSTEM_LOGIN_LOG_VIEW = 'tenant:system:loginLog:view',

  // 代码生成
  TENANT_DEVELOPER_TOOLS_GENERATOR_EDIT = 'tenant:developer:tools:generator:edit',
  TENANT_DEVELOPER_TOOLS_GENERATOR_IMPORT = 'tenant:developer:tools:generator:import',
  TENANT_DEVELOPER_TOOLS_GENERATOR_SYNC = 'tenant:developer:tools:generator:sync',
  TENANT_DEVELOPER_TOOLS_GENERATOR_DELETE = 'tenant:developer:tools:generator:delete',
  TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW = 'tenant:developer:tools:generator:preview',
  TENANT_DEVELOPER_TOOLS_GENERATOR_EDIT_DELETE = 'tenant:developer:tools:generator:edit:delete',
  TENANT_DEVELOPER_TOOLS_GENERATOR_EDIT_EDIT = 'tenant:developer:tools:generator:edit:edit',
  TENANT_DEVELOPER_TOOLS_GENERATOR_EDIT_SYNC = 'tenant:developer:tools:generator:edit:sync',

  // 运维平台-接口管理
  TENANT_OPS_INTERFACES_ADD = 'tenant:ops:interfaces:add',
  TENANT_OPS_INTERFACES_EDIT = 'tenant:ops:interfaces:edit',
  TENANT_OPS_INTERFACES_DELETE = 'tenant:ops:interfaces:delete',
  TENANT_OPS_INTERFACES_VIEW = 'tenant:ops:interfaces:view',
  TENANT_OPS_INTERFACES_PROPERTY = 'tenant:ops:interfaces:property',
  // 运维平台-模板管理
  TENANT_OPS_TEMPLATE_ADD = 'tenant:ops:template:add',
  TENANT_OPS_TEMPLATE_EDIT = 'tenant:ops:template:edit',
  TENANT_OPS_TEMPLATE_DELETE = 'tenant:ops:template:delete',
  TENANT_OPS_TEMPLATE_VIEW = 'tenant:ops:template:view',
  // 运维平台-接口日志
  TENANT_OPS_INTERFACES_LOG_DELETE = 'tenant:ops:interfaces:log:delete',
  TENANT_OPS_INTERFACES_LOG_LOGGING = 'tenant:ops:interfaces:log:logging',
  TENANT_OPS_INTERFACES_LOG_LOGGING_DELETE = 'tenant:ops:interfaces:log:logging:delete',

  // 附件管理
  TENANT_SYSTEM_FILE_UPLOAD = 'tenant:system:file:upload',
  TENANT_SYSTEM_FILE_DEBUG_UPLOAD = 'tenant:system:file:debug:upload',
  TENANT_SYSTEM_FILE_DOWNLOAD = 'tenant:system:file:download',
  TENANT_SYSTEM_FILE_DELETE = 'tenant:system:file:delete',

  // 基础平台
  // 消息中心-消息管理
  BASIC_MSG_MSG_ADD = 'basic:msg:msg:add',
  BASIC_MSG_MSG_EDIT = 'basic:msg:msg:edit',
  BASIC_MSG_MSG_DELETE = 'basic:msg:msg:delete',
  BASIC_MSG_MSG_VIEW = 'basic:msg:msg:view',

  // 消息中心-个性模板
  BASIC_MSG_TEMPLATE_IMPORT = 'basic:msg:template:import',
  BASIC_MSG_TEMPLATE_EDIT = 'basic:msg:template:edit',
  BASIC_MSG_TEMPLATE_DELETE = 'basic:msg:template:delete',
  BASIC_MSG_TEMPLATE_VIEW = 'basic:msg:template:view',

  // 消息中心-我的消息
  BASIC_MSG_NOTICE_DELETE = 'basic:msg:myMsg:delete',
  BASIC_MSG_NOTICE_VIEW = 'basic:msg:myMsg:edit',

  // 员工维护
  EMPLOYEE_ADD = 'basic:user:employee:add',
  EMPLOYEE_REST_PWD = 'basic:user:employee:rest:pwd',
  EMPLOYEE_EDIT = 'basic:user:employee:edit',
  EMPLOYEE_DELETE = 'basic:user:employee:delete',
  EMPLOYEE_VIEW = 'basic:user:employee:view',
  EMPLOYEE_BIND_ROLE = 'basic:user:employee:bindRole',
  INVITATION_USER = 'basic:user:employee:invitation',

  // 机构维护
  ORG_ADD = 'basic:user:org:add',
  ORG_EDIT = 'basic:user:org:edit',
  ORG_DELETE = 'basic:user:org:delete',
  ORG_SWITCH = 'basic:user:org:switch',
  ORG_BIND_ROLE = 'basic:user:org:bind',

  // 岗位维护
  POSITION_ADD = 'basic:user:position:add',
  POSITION_EDIT = 'basic:user:position:edit',
  POSITION_DELETE = 'basic:user:position:delete',
  POSITION_VIEW = 'basic:user:position:view',

  // 个性字典
  BASIC_DICT_IMPORT = 'basic:base:dict:import',
  BASIC_DICT_EDIT = 'basic:base:dict:edit',
  BASIC_DICT_DELETE = 'basic:base:dict:delete',
  BASIC_DICT_VIEW = 'basic:base:dict:view',
  BASIC_DICT_ITEM_ADD = 'basic:base:dict:addItem',
  BASIC_DICT_ITEM_EDIT = 'basic:base:dict:editItem',
  BASIC_DICT_ITEM_DELETE = 'basic:base:dict:deleteItem',

  // 个性参数
  PARAMETER_ADD = 'basic:base:parameter:add',
  PARAMETER_EDIT = 'basic:base:parameter:edit',
  PARAMETER_DELETE = 'basic:base:parameter:delete',
  PARAMETER_VIEW = 'basic:base:parameter:view',

  // 角色权限维护
  ROLE_ADD = 'basic:system:role:add',
  ROLE_EDIT = 'basic:system:role:edit',
  ROLE_DELETE = 'basic:system:role:delete',
  ROLE_BING_USER = 'basic:system:role:bindUser',
  ROLE_BIND_RESOURCE = 'basic:system:role:bindResource',

  // 附件管理
  SYSTEM_APPENDIX_UPLOAD = 'basic:system:appendix:upload',
  SYSTEM_APPENDIX_DEBUG_UPLOAD = 'basic:system:appendix:debug:upload',
  SYSTEM_APPENDIX_DOWNLOAD = 'basic:system:appendix:download',
  SYSTEM_APPENDIX_DELETE = 'basic:system:appendix:delete',

  // 操作日志
  SYSTEM_WEB_LOG_DELETE = 'basic:system:webLog:delete',
  SYSTEM_WEB_LOG_VIEW = 'basic:system:webLog:view',
  // 登录日志
  BASIC_SYSTEM_LOGIN_LOG_DELETE = 'basic:system:loginLog:delete',
  BASIC_SYSTEM_LOGIN_LOG_VIEW = 'basic:system:loginLog:view',
  // 工作流-流程管理
  BASIC_FLOW_ACTIVITI_DEPLOYMENT_UPLOAD = 'basic:flow:activiti:deployment:upload',
  BASIC_FLOW_ACTIVITI_DEPLOYMENT_TRAN = 'basic:flow:activiti:deployment:tran',
  BASIC_FLOW_ACTIVITI_DEPLOYMENT_STATE = 'basic:flow:activiti:deployment:state',
  BASIC_FLOW_ACTIVITI_DEPLOYMENT_DRAW = 'basic:flow:activiti:deployment:draw',
  BASIC_FLOW_ACTIVITI_DEPLOYMENT_XML = 'basic:flow:activiti:deployment:xml',
  BASIC_FLOW_ACTIVITI_DEPLOYMENT_DELETE = 'basic:flow:activiti:deployment:delete',
  // 工作流-模型管理
  BASIC_FLOW_ACTIVITI_MODEL_ADD = 'basic:flow:activiti:model:add',
  BASIC_FLOW_ACTIVITI_MODEL_EDIT = 'basic:flow:activiti:model:edit',
  BASIC_FLOW_ACTIVITI_MODEL_PUBLISH = 'basic:flow:activiti:model:publish',
  BASIC_FLOW_ACTIVITI_MODEL_DOWNLOAD = 'basic:flow:activiti:model:download',
  BASIC_FLOW_ACTIVITI_MODEL_DELETE = 'basic:flow:activiti:model:delete',
}

export enum PermModeEnum {
  // 拥有所有
  Has = 'Has',
  // 拥有任意一个
  HasAny = 'HasAny',
  // 没有所有
  Without = 'Without',
  // 没有任意一个
  WithoutAny = 'WithoutAny',
}
