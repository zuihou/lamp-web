import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu interface
 */
export interface getMenuListByIdParams {
  userId?: number | string;
  group?: string;
  applicationId: string;
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

/**
 * @description: 获取用户的资源和角色
 */
export interface VisibleResourceVO {
  // 是否启用
  enabled: boolean;
  // 区分大小写
  caseSensitive: boolean;
  // 拥有的资源编码
  resourceList: string[];
  // 用用的角色编码
  roleList: string[];
}
