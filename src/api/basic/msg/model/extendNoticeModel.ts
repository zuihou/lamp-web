import { PageResult } from '/@/api/model/baseModel';

export interface ExtendNoticePageQuery {
  bizId?: string; // 业务ID
  bizType?: string; // 业务类型
  recipientId?: string; // 接收人
  remindMode?: string; // 提醒方式
  title?: string; // 标题
  content?: string; // 内容
  author?: string; // 发布人
  url?: string; // 处理地址
  target?: string; // 打开方式
  autoRead?: boolean; // 自动已读
  handleTime?: string; // 处理时间
  readTime?: string; // 读取时间
  isRead?: boolean; // 是否已读
  isHandle?: boolean; // 是否处理
  createdOrgId?: string; // 所属组织
}

export interface ExtendNoticeSaveVO {
  bizId?: string; // 业务ID
  bizType?: string; // 业务类型
  recipientId?: string; // 接收人
  remindMode?: string; // 提醒方式
  title?: string; // 标题
  content?: string; // 内容
  author?: string; // 发布人
  url?: string; // 处理地址
  target?: string; // 打开方式
  autoRead?: boolean; // 自动已读
  handleTime?: string; // 处理时间
  readTime?: string; // 读取时间
  isRead?: boolean; // 是否已读
  isHandle?: boolean; // 是否处理
  createdOrgId?: string; // 所属组织
}

export interface ExtendNoticeUpdateVO {
  id: string;
  bizId?: string; // 业务ID
  bizType?: string; // 业务类型
  recipientId?: string; // 接收人
  remindMode?: string; // 提醒方式
  title?: string; // 标题
  content?: string; // 内容
  author?: string; // 发布人
  url?: string; // 处理地址
  target?: string; // 打开方式
  autoRead?: boolean; // 自动已读
  handleTime?: string; // 处理时间
  readTime?: string; // 读取时间
  isRead?: boolean; // 是否已读
  isHandle?: boolean; // 是否处理
  createdOrgId?: string; // 所属组织
}

export interface ExtendNoticeResultVO {
  echoMap?: any;
  id: string; // ID
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人id
  updatedTime?: string; // 最后修改时间
  updatedBy?: string; // 最后修改人
  bizId?: string; // 业务ID
  bizType?: string; // 业务类型
  recipientId?: string; // 接收人
  remindMode?: string; // 提醒方式
  title?: string; // 标题
  content?: string; // 内容
  author?: string; // 发布人
  url?: string; // 处理地址
  target?: string; // 打开方式
  autoRead?: boolean; // 自动已读
  handleTime?: string; // 处理时间
  readTime?: string; // 读取时间
  isRead?: boolean; // 是否已读
  isHandle?: boolean; // 是否处理
  createdOrgId?: string; // 所属组织
}

export interface MyNoticeResult {
  todoList: PageResult<ExtendNoticeResultVO>;
  noticeList: PageResult<ExtendNoticeResultVO>;
  earlyWarningList: PageResult<ExtendNoticeResultVO>;
}
