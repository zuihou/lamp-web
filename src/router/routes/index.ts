import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '/@/router/constant';

// import.meta.glob('*', { eager: true }) 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

/**
 * 拼接在后端路由之前的前端路由
 */
export const BeforeRoutes: AppRouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: LAYOUT,
    redirect: '/home/welcome',
    meta: {
      icon: 'bx:bx-home',
      hideMenu: true,
      title: t('routes.dashboard.welcome'),
    },
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('/@/views/lamp/home/index.vue'),
        meta: {
          title: t('routes.dashboard.welcome'),
          affix: true,
          icon: 'bx:bx-home',
        },
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    component: LAYOUT,
    redirect: '/profile/index',
    meta: {
      title: '个人中心',
      hideMenu: true,
    },
    children: [
      {
        path: 'index',
        name: 'profileIndex',
        component: () => import('/@/views/lamp/profile/index.vue'),
        meta: {
          title: '个人中心',
          hideMenu: true,
        },
      },
    ],
  },
];

export const AfterVbenRoutes: AppRouteModule[] = [];
// 后台动态路由之后的路由
export const AfterRoutes: AppRouteModule[] = [];

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
