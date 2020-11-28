import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './utils/error-log' // error log
import request from '@/utils/request'

import * as filters from './filters' // global filters
import {hasAnyPermission, hasNoPermission, hasPermission, hasAnyRole, hasNoRole, hasRole} from './utils/permissionDirect'
import uploader from 'vue-simple-uploader'

import "e-icon-picker/dist/symbol.js"; //基本彩色图标库
import 'e-icon-picker/dist/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
import iconfont from "./styles/iconfont.json"; //自己的图标信息
import "./styles/iconfont.css"; //自己的图标样式
import eIconPicker, {analyzingIconForIconfont, iconList} from 'e-icon-picker';
import svgIcons from 'e-icon-picker/dist/getSvg';

let forIconfont = analyzingIconForIconfont(iconfont);
//全局删除增加图标
Vue.use(eIconPicker, {
  FontAwesome: true,
  ElementUI: true,
  eIcon: true,//自带的图标，来自阿里妈妈
  eIconSymbol: true,//是否开启彩色图标
  addIconList: forIconfont.list,
  removeIconList: []
});

iconList.addIcon(svgIcons);
// iconList.removeIcon(["el-icon-s-ticket"]);


const Plugins = [
  hasPermission,
  hasNoPermission,
  hasAnyPermission,
  hasAnyRole, hasNoRole, hasRole
]

Plugins.map((plugin) => {
  Vue.use(plugin)
})

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(uploader)

Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$login = request.login

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
