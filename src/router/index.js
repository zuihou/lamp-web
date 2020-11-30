import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import db from '@/utils/localstorage'
import store from '@/store/index'
import loginApi from '@/api/Login.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const constRouter = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: resolve => require(['@/views/redirect/index'], resolve)
      }
    ]
  },
  {
    path: '/404',
    component: resolve => require(['@/views/error-page/404'], resolve),
    hidden: true
  },
  {
    path: '/login',
    name: '登录页',
    component: resolve => require(['@/views/login/index'], resolve)
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: resolve => require(['@/views/dashboard/index'], resolve),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'dashboard', affix: true}
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/profile/index'], resolve),
        name: 'Profile',
        meta: {title: 'profile', icon: 'user', noCache: true}
      },
    ]
  },
  {
    path: '/resources',
    component: Layout,
    redirect: '/resources/msg',
    hidden: true,
    alwaysShow: true,
    meta: {
      title: '资源中心', icon: '', noCache: true, breadcrumb: true
    },
    children: [
      {
        hidden: true,
        alwaysShow: false,
        path: '/resources/msg/edit',
        component: resolve => require(['@/views/lamp/resources/msg/edit'], resolve),
        name: '发送消息',
        meta: {
          title: '发送消息', icon: '', noCache: true, breadcrumb: true
        }
      },
      {
        hidden: true,
        path: '/resources/sms/edit',
        component: resolve => require(['@/views/lamp/resources/sms/edit'], resolve),
        name: 'smsEdit',
        meta: {
          title: '发送短信', icon: '', noCache: true
        }
      },
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '404',
        component: resolve => require(['@/views/error-page/404'], resolve),
        name: 'Page404',
        meta: {title: 'page404', noCache: true}
      }
    ]
  },
]

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constRouter
})

const whiteList = ['/login']

// 异步的路由信息， 同时，左侧菜单也会根据这个来显示
let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const token = db.get('TOKEN', '')
    const user = db.get('USER')
    const userRouter = db.get('USER_ROUTER', '') //缓存中的路由
    if (token && token.length && user) {
      if (!asyncRouter) {
        if (!userRouter) {
          loginApi.getRouter({}).then((response) => {
            const res = response.data
            asyncRouter = res.data

            if (!(asyncRouter && asyncRouter.length > 0)) {
              asyncRouter = []
            }
            asyncRouter.push({
              alwaysShow: false,
              component: "error-page/404",
              hidden: false,
              name: "404",
              path: "*"
            });

            store.commit('account/setRoutes', asyncRouter)

            go(to, next)
          })
        } else {
          asyncRouter = userRouter
          go(to, next)
        }
      } else {
        next()
      }
    } else {
      if (to.path === '/login') {
        next()
      } else {
        db.clear();
        next('/login')
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}

function filterAsyncRouter(routes, parent) {
  return routes.filter((route) => {
    const component = route.component
    if (component) {
      if (route.component === 'Layout') {
        if (route.children && route.children.length > 0 && parent) {
          route.component = (resolve) => {
            require(['@/components/RouterWrap/RouterWrap.vue'], resolve);
          }
        } else {
          route.component = Layout
        }
      } else if (typeof component === 'string') {
        route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, route)
      }
      return true
    }
  })
}

function view(path) {
  return function (resolve) {
    require([`@/views/${path}.vue`], resolve)
  }
}

export default router
