export interface DefAreaPageQuery {
  code?: string;
  fullName?: string;
  longitude?: string;
  latitude?: string;
  level?: string;
  source?: string;
  state?: boolean;
  grade?: number;
  path?: string;
  label?: string;
  parentId?: string;
  sortValue?: number;
}

export interface DefAreaSaveVO {
  code: string;
  fullName: string;
  longitude: string;
  latitude: string;
  level: string;
  source: string;
  state: boolean;
  grade: number;
  path: string;
  label: string;
  parentId: string;
  sortValue: number;
}

export interface DefAreaUpdateVO {
  id: string;
  code: string;
  fullName: string;
  longitude: string;
  latitude: string;
  level: string;
  source: string;
  state: boolean;
  grade: number;
  path: string;
  label: string;
  parentId: string;
  sortValue: number;
}

export interface DefAreaResultVO {
  code?: string;
  fullName?: string;
  longitude?: string;
  latitude?: string;
  level?: string;
  source?: string;
  state?: boolean;
  grade?: number;
  path?: string;
  id?: string;
  label?: string;
  sortValue?: number;
  parentId?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  echoMap?: any;
}
