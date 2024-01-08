export interface DefUserAvatarUpdateVO {
  id: string;
  appendixAvatar: any;
}

export interface DefUserPasswordUpdateVO {
  id: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface DefUserMobileUpdateVO {
  mobile: string;
  code: string;
  templateCode: string;
}

export interface DefUserEmailUpdateVO {
  email: string;
  code: string;
  templateCode: string;
}

export interface DefUserBaseInfoUpdateVO {
  id: string;
  nickName: string;
  sex: string;
  nation: string;
  education: string;
  workDescribe: string;
}
