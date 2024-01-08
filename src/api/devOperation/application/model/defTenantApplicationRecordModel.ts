export interface DefTenantApplicationRecordPageQuery {
  tenantId?: string;
  applicationId?: string;
  applicationName?: string;
  tenantName?: string;
  operateByName?: string;
  grantType?: string;
}

export interface DefTenantApplicationRecordResultVO {
  tenantId?: string;
  applicationId?: string;
  applicationName?: string;
  tenantName?: string;
  operateByName?: string;
  grantType?: string;
  id?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  echoMap?: any;
}
