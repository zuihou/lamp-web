import { BasicFetchResult } from '/@/api/model/baseModel';

export interface OptionsItem {
  label: string;
  text: string;
  value: string;
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
