export interface OnlineUsersResultVO {
  id?: string;
  username?: string;
  nickName?: string;
  sessionTime?: string;
  sessionStr?: string;
  expireTime?: string;
  expireStr?: string;
}

export interface OnlineTokenResultVO {
  value?: string;
  device?: string;
  sessionTime?: string;
  sessionStr?: string;
  expireTime?: string;
  expireStr?: string;
}
