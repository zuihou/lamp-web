import { BasicFetchResult } from '/@/api/model/baseModel';

export interface OptionsItem {
  label: string;
  remark: string;
  value: string;
  color: string;
}

/**
 * @description: Request list return value
 */
export type OptionsGetResultModel = BasicFetchResult<OptionsItem[]>;

export interface CodeQueryVO {
  type: string;
  excludes?: string | string[];
  extend?: OptionsItem;
  extendFirst: boolean;
}

export interface SystemApiVO {
  springApplicationName: string;
  controller: string;
  name: string;
  requestMethod: string;
  uri: string;
}

export interface AudioVO {
  id: string;
  auditStatus: number;
  reviewComments?: string;
}
export interface IdVO {
  id: string;
}

export interface StatusUpdateVO {
  id: string;
  status: number;
}
