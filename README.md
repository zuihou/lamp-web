### lamp-web

lamp-web 是[lamp-cloud](https://github.com/zuihou/lamp-cloud)微服务权限系统的 `租户后台`，基于[vue element admin](https://panjiachen.github.io/vue-element-admin-site/zh/)构建。

所谓`租户后台`，即是给租户（客户）使用，而`开发&运营后台`则是给使用此框架的公司内部人员维护项目使用。

## 如果您觉得有帮助，请点右上角 "Star" 支持一下，谢谢!!

## 详细文档: https://www.kancloud.cn/zuihou/lamp-cloud

## 交流群： 63202894
    加群前请先将下方项目点star，支持下群主，谢谢😘

## 项目代码地址

微服务后端 代码：

| 项目          | gitee                                          | github                                       |
| ------------- | ---------------------------------------------- | -------------------------------------------- |
| 微服务项目    | https://gitee.com/zuihou111/lamp-cloud | https://github.com/zuihou/lamp-cloud |
| 单体项目      | https://gitee.com/zuihou111/lamp-boot  | https://github.com/zuihou/lamp-boot  |
| 租户后台      | https://gitee.com/zuihou111/zuihou-web | https://github.com/zuihou/lamp-web         |
| 代码生成器    | https://gitee.com/zuihou111/lamp-generator | https://github.com/zuihou/lamp-generator   |

## 演示地址

> 演示环境中内置租户没有写入权限，若要在演示环境测试增删改，请到`开发&运营后台`自行创建租户后测试


## 项目截图：

| 预览                                                   | 预览                                                   |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![SBA监控.png](image/项目相关/开发%26运营后台预览.png) | ![SBA监控.png](image/项目相关/租户后台预览.png)        |
| ![SBA监控.png](image/监控界面/sba.png)                 | ![SBA监控.png](image/监控界面/zipkin.png)              |
| ![swagger.png](image/项目相关/swagger获取token.jpg)    | ![admin-api.png](image/项目相关/admin-api.png)         |
| ![SBA监控.png](image/1000star.png)                     | ![定时任务.png](image/项目相关/zuihou-jobs-server.png) |

## 功能介绍：
0. 租户管理：运营管理所有的租户创建
1. 用户中心：组织、岗位、用户数据维护、重置用户密码等
2. 权限管理：菜单、资源配置、角色管理、给角色绑定用户、给角色授权菜单和资源
3. 基础配置：字典、地区、系统参数等信息维护
4. 开发者管理：应用管理、数据库监控、操作日志、登录日志、swagger接口文档、注册中心、各种监控
5. 消息中心：本站消息发送和查看
6. 短信中心：各大运营商的短信基本信息配置，配置后，系统即有发送短信的能力
7. 文件中心：提供了系统附件上传和存储能力，内置支持本地存储、FastDFS存储、阿里云存储，通过配置只有切换
8. 网关管理：限流能力、阻止访问能力（即hei名单）
9. 流程管理：工作流常用功能（模型管理、流程部署等）

## 技术栈

- Vue
- ES6
- Webpack
- Vue-cli
- Vue-router
- Vuex
- Axios
- Element-UI
- ECharts


## 适当修改配置

由于本项目为了同时支持 lamp-cloud 和 lamp-boot 2 个项目，但前者由于多了一个网关服务，所以在请求 URI 上比后者多了一段 网关的 URI，
（比如，同样是获取验证码的接口， 在者的地址：/api/authority/anno/captcha， 后者：/anno/captcha）
所以想要前端项目尽可能少的改动代码，需要通过 nginx 或者 vue 的 uri 代理功能（但 uri 代理只能在开发环境使用）

- 使用 nginx 请在群公告下载后直接使用
- 使用 vue 自带的代理功能需要修改一下 前端项目的配置文件

1. vue.config.js

```
proxy: {
  [proxyUrl]: {
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      // lamp-cloud 项目 请使用以下的配置
      ['^' + proxyUrl]: proxyUrl

      // lamp-boot 项目 请使用以下的配置
      // ['^/api/oauth']: '/',
      // ['^/api/authority']: '/',
      // ['^/api/file']: '/',
      // ['^/api/msg']: '/',
      // ['^/api/gateway']: '/gateway',
      // ['^/api/gate']: '/',
    }
  }
}
```

2. .env.development
```
# 后端为 lamp-cloud 项目： http://127.0.0.1:8760 表示lamp-gateway-server服务的访问地址，非本机访问，请配置内网ip
# 后端为 lamp-boot 项目： http://127.0.0.1:8760 表示lamp-authority-server服务的访问地址，非本机访问，请配置内网ip
VUE_APP_DEV_REQUEST_DOMAIN_PREFIX = 'http://127.0.0.1:8760'
```

## 安装

```
npm install --registry=https://registry.npm.taobao.org

上面的命令报错？就逐个试试以下命令：

npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

git config --global url."https://".insteadOf git://

npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver

cnpm install core-js@2.6.9 

还不行？ 就用淘宝镜像吧...

# 安装cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org


cnpm install --registry=https://registry.npm.taobao.org
```

### 本地开发环境运行

```
npm run dev
```

### 访问：http://localhost:8080/

### 生产环境运行
```
npm run build:prod
```

## 求助：

由于本人前端技能特别水，在做这 2 个前端项目时，都是边学边写，所以前端的 bug 较多，代码写的也不规范，导致 eslint 报了很多警告，
若你会前端（vue）的或者知道怎么设置 vscode 的格式化规则或者知道怎么设置.eslint 配置的规则，欢迎提交 pr 或者进 qq 群指导一下群主。
必有重谢。
