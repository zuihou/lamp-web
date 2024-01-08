export interface BaseRolePageQuery {
  type?: string;
  name?: string;
  code?: string;
  remarks?: string;
  state?: boolean;
  readonly?: boolean;
  category?: string;
  createdOrgId?: string;
  orgId?: string;
  employeeId?: string;
  scope?: string;
  scopeType?: string;
}

export interface BaseRoleSaveVO {
  type: string;
  name: string;
  code: string;
  remarks: string;
  state: boolean;
  readonly: boolean;
  category?: string;
  createdOrgId: string;
}

export interface BaseRoleUpdateVO {
  id: string;
  type: string;
  name: string;
  code: string;
  remarks: string;
  state: boolean;
  readonly: boolean;
  category?: string;
  createdOrgId: string;
}

export interface BaseRoleResultVO {
  type?: string;
  name?: string;
  code?: string;
  remarks?: string;
  state?: boolean;
  readonly?: boolean;
  category?: string;
  createdOrgId?: string;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}

export interface RoleEmployeeSaveVO {
  flag: boolean;
  roleId: string;
  employeeIdList: string[];
}

export interface BaseRoleResourceRelSaveVO {
  roleId: string;
  applicationResourceMap: Recordable;
}
