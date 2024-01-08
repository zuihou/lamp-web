export interface BaseOrgPageQuery {
  name?: string;
  type?: string;
  shortName?: string;
  treeGrade?: number;
  treePath?: string;
  state?: boolean;
  remarks?: string;
  label?: string;
  parentId?: string;
  sortValue?: number;
}

export interface BaseOrgSaveVO {
  name: string;
  type: string;
  shortName: string;
  treeGrade: number;
  treePath: string;
  state: boolean;
  remarks: string;
  label: string;
  parentId: string;
  sortValue: number;
}

export interface BaseOrgUpdateVO {
  id: string;
  name: string;
  type: string;
  shortName: string;
  treeGrade: number;
  treePath: string;
  state: boolean;
  remarks: string;
  label: string;
  parentId: string;
  sortValue: number;
}

export interface BaseOrgResultVO {
  name?: string;
  type?: string;
  shortName?: string;
  treeGrade?: number;
  treePath?: string;
  state?: boolean;
  remarks?: string;
  id: string;
  parentId?: string;
  sortValue?: number;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  echoMap?: any;
}

export interface BaseOrgRoleRelSaveVO {
  orgId: string;
  roleIdList: string[];
  flag: boolean;
}
