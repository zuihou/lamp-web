export interface DefMsgTemplatePageQuery {
  type?: string // 消息类型
  code?: string // 模板标识
  name?: string // 模板名称
  title?: string // 标题
  sign?: string // 签名
  content?: string // 模板内容
  script?: string // 脚本
  param?: string // 模板参数
  remarks?: string // 备注
  target?: string // 打开方式
  autoRead?: boolean // 自动已读
  remindMode?: string // 提醒方式
  url?: string // 跳转地址
}

export interface DefMsgTemplateSaveVO {
  type?: string // 消息类型
  code?: string // 模板标识
  name?: string // 模板名称
  title?: string // 标题
  sign?: string // 签名
  content?: string // 模板内容
  script?: string // 脚本
  param?: string // 模板参数
  remarks?: string // 备注
  target?: string // 打开方式
  autoRead?: boolean // 自动已读
  remindMode?: string // 提醒方式
  url?: string // 跳转地址
}

export interface DefMsgTemplateUpdateVO {
  id: string
  type?: string // 消息类型
  code?: string // 模板标识
  name?: string // 模板名称
  title?: string // 标题
  sign?: string // 签名
  content?: string // 模板内容
  script?: string // 脚本
  param?: string // 模板参数
  remarks?: string // 备注
  target?: string // 打开方式
  autoRead?: boolean // 自动已读
  remindMode?: string // 提醒方式
  url?: string // 跳转地址
}

export interface DefMsgTemplateResultVO {
  echoMap?: any
  id?: string // 模板ID
  createdBy?: string // 创建人ID
  createdTime?: string // 创建时间
  updatedBy?: string // 最后修改人
  updatedTime?: string // 最后修改时间
  type?: string // 消息类型
  code: string // 模板标识
  name?: string // 模板名称
  title?: string // 标题
  sign?: string // 签名
  content?: string // 模板内容
  script?: string // 脚本
  param?: string // 模板参数
  remarks?: string // 备注
  target?: string // 打开方式
  autoRead?: boolean // 自动已读
  remindMode?: string // 提醒方式
  url?: string // 跳转地址
  templateCode: string //短信模板
  paramList: string[]
}
