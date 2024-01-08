export interface ProcessDefinitionDO {
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  name: string;
  key: string;
  version: string;
  category: string;
  description: string;
  deploymentId: string;
  deploymentName: string;
  deploymentTime: string;
  diagramResourceName: string;
  resourceName: string;
  suspensionState: string;
  suspensionStateName: string;
}

export interface DefinitionUploadVO {
  name?: string;
  // file name
  file: File | Blob;
}
