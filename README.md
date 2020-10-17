### zuihou-ui

zuihou-ui 是[zuihou-admin-cloud](https://github.com/zuihou/zuihou-admin-cloud)微服务权限系统的 `租户后台`，基于[vue element admin](https://panjiachen.github.io/vue-element-admin-site/zh/)构建。

所谓`租户后台`，即是给租户（客户）使用，而`开发&运营后台`则是给使用此框架的公司内部人员维护项目使用。

## 如果您觉得有帮助，请点右上角 "Star" 支持一下，谢谢!!

## 详细文档: https://www.kancloud.cn/zuihou/zuihou-admin-cloud

## 交流群： 63202894
    加群前请先将下方项目点star，支持下群主，谢谢😘

## 项目代码地址

微服务后端 代码：

| 项目          | gitee                                          | github                                       |
| ------------- | ---------------------------------------------- | -------------------------------------------- |
| 微服务项目    | https://gitee.com/zuihou111/zuihou-admin-cloud | https://github.com/zuihou/zuihou-admin-cloud |
| 单体项目      | https://gitee.com/zuihou111/zuihou-admin-boot  | https://github.com/zuihou/zuihou-admin-boot  |
| 租户后台      | https://gitee.com/zuihou111/zuihou-ui          | https://github.com/zuihou/zuihou-ui          |
| 开发&运营后台 | https://gitee.com/zuihou111/zuihou-admin-ui    | https://github.com/zuihou/zuihou-admin-ui    |
| 代码生成器    | 无                                             | https://github.com/zuihou/zuihou-generator   |

## 演示地址

| 项目          | 演示地址                               | 管理员账号       | 普通账号   |
| ------------- | -------------------------------------- | ---------------- | ---------- |
| 租户后台      | http://tangyh.top:10000/zuihou-ui/     | zuihou/zuihou    | test/zuiou |
| 开发&运营后台 | http://tangyh.top:180/zuihou-admin-ui/ | demoAdmin/zuihou | 无         |

> 演示环境中内置租户没有写入权限，若要在演示环境测试增删改，请到`开发&运营后台`自行创建租户后测试

```
租户后台 和 开发&运营后台 2者之间的关系是什么？
A公司 使用这套SaaS脚手架二次开发了一个OA或者商城， B和C公司想使用A公司开发的这套系统，但土豪公司B有钱想要个性化功能，C公司是个穷逼，不愿意多花钱>
于是，A公司就在 zuihou-admin-ui（开发&运营后台） 上新建了 租户B 和租户C， 并各自新建了账号b1和账号c1， 分别给B公司和C公司 试用，
B公司和C公司分别拿着账号， 在 zuihou-ui(租户后台) 上试用， 试用很满意，但土豪B公司先要定制功能， 就跟A公司签了一个500W的定制大单，并要求独立部署在他们自己的服务器
穷逼C公司没钱， 就花了20W使用A公司部署的云环境， 服务器和数据等都存在A公司的云服务器上。
```

## 项目截图：

| 预览                                                   | 预览                                                   |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![SBA监控.png](image/项目相关/开发%26运营后台预览.png) | ![SBA监控.png](image/项目相关/租户后台预览.png)        |
| ![SBA监控.png](image/监控界面/sba.png)                 | ![SBA监控.png](image/监控界面/zipkin.png)              |
| ![swagger.png](image/项目相关/swagger获取token.jpg)    | ![admin-api.png](image/项目相关/admin-api.png)         |
| ![SBA监控.png](image/1000star.png)                     | ![定时任务.png](image/项目相关/zuihou-jobs-server.png) |

## 功能介绍：
0. 租户管理：运营后台（zuihou-admin-ui）管理所有的租户创建
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

由于本项目为了同时支持 zuihou-admin-cloud 和 zuihou-admin-boot 2 个项目，但前者由于多了一个网关服务，所以在请求 URI 上比后者多了一段 网关的 URI，
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
      // zuihou-admin-cloud 项目 请使用以下的配置
      ['^' + proxyUrl]: proxyUrl

      // zuihou-admin-boot 项目 请使用以下的配置
      // ['^/api/oauth']: '/',
      // ['^/api/authority']: '/',
      // ['^/api/file']: '/',
      // ['^/api/msgs']: '/',
      // ['^/api/gateway']: '/gateway',
      // ['^/api/gate']: '/',
    }
  }
}
```

2. .env.development
```
# 后端为 zuihou-admin-cloud 项目： http://127.0.0.1:8760 表示zuihou-gateway-server服务的访问地址，非本机访问，请配置内网ip
# 后端为 zuihou-admin-boot 项目： http://127.0.0.1:8760 表示zuihou-authority-server服务的访问地址，非本机访问，请配置内网ip
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
本人感激不尽，并赠送后端文档（https://kancloud.cn/zuihou/zuihou-admin-cloud）一份，且提供zuihou-admin-cloud项目的任何支持（启动运行，报错，二次开发，部署等）。
