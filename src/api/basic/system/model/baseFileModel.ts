export interface BaseFilePageQuery {
  bizType?: string;
  fileType?: string;
  storageType?: string;
  bucket?: string;
  path?: string;
  url?: string;
  uniqueFileName?: string;
  fileMd5?: string;
  originalFileName?: string;
  contentType?: string;
  suffix?: string;
  size?: string;
  createdOrgId?: string;
}

export interface BaseFileResultVO {
  bizType?: string;
  fileType?: string;
  storageType?: string;
  bucket?: string;
  path?: string;
  url?: string;
  uniqueFileName?: string;
  fileMd5?: string;
  originalFileName?: string;
  contentType?: string;
  suffix?: string;
  size?: string;
  createdOrgId?: string;
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  echoMap?: any;
}
