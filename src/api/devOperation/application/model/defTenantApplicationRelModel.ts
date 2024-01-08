import { DefResourceResultVO } from './defResourceModel';

export interface DefTenantApplicationRelPageQuery {
  tenantId?: string;
  applicationId?: string;
  expirationTime?: string;
}

export interface DefTenantApplicationRelSaveVO {
  tenantId: string;
  applicationId: string;
  expirationTime: string;
}

export interface DefTenantApplicationRelUpdateVO {
  id: string;
  tenantId: string;
  applicationId: string;
  expirationTime: string;
}

export interface DefTenantApplicationRelResultVO {
  tenantId?: string;
  applicationId?: string;
  expirationTime?: string;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
  expired?: boolean;
  resourceList?: DefResourceResultVO[];
  checkedList?: string[];
}
