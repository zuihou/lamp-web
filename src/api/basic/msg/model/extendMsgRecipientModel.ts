export interface ExtendMsgRecipientPageQuery {
  msgId?: string; // 任务ID
  recipient?: string; // 接收人
}

export interface ExtendMsgRecipientSaveVO {
  msgId?: string; // 任务ID
  recipient?: string; // 接收人
}

export interface ExtendMsgRecipientUpdateVO {
  id: string;
  msgId?: string; // 任务ID
  recipient?: string; // 接收人
}

export interface ExtendMsgRecipientResultVO {
  echoMap?: any;
  id?: string; // ID
  createdBy?: string; // 创建人
  createdTime?: string; // 创建时间
  updatedBy?: string; // 最后修改人
  updatedTime?: string; // 最后修改时间
  msgId?: string; // 任务ID
  recipient?: string; // 接收人
}
