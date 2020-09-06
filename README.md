### zuihou-ui

zuihou-ui 是[zuihou-admin-cloud](https://github.com/zuihou/zuihou-admin-cloud)微服务权限系统的 `租户后台`，基于[vue element admin](https://panjiachen.github.io/vue-element-admin-site/zh/)构建。

所谓`租户后台`，即是给租户（客户）使用，而`开发&运营后台`则是给使用此框架的公司内部人员维护项目使用。

## 如果您觉得有帮助，请点右上角 "Star" 支持一下，谢谢!!

## 详细文档: https://www.kancloud.cn/zuihou/zuihou-admin-cloud

http://doc.tangyh.top/zuihou-admin-cloud

    ps: gitee捐献 或者 二维码打赏（本页最下方）： 45元及以上 备注邮箱，可得开发文档一份（支持后续更新） （比看云的价格便宜哦）

## 交流群： 63202894

![qq群.png](image/qq群.png) <a target="_blank" href="http://shang.qq.com/wpa/qunwpa?idkey=489800b9d07d017fa0b5104608a4bf755f1f38276b79f0ac5e6225d0d9897efb"><img border="0" src="http://pub.idqqimg.com/wpa/images/group.png" alt="zuihou-admin-cloud 交流" title="zuihou-admin-cloud 交流"></a>

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

## zuihou-admin-boot 演示地址

| 项目          | 演示地址                                       | 管理员账号       | 普通账号   |
| ------------- | ---------------------------------------------- | ---------------- | ---------- |
| 租户后台      | http://42.202.130.216:10000/zuihou-ui          | zuihou/zuihou    | test/zuiou |
| 开发&运营后台 | http://42.202.130.216:10000/zuihou-admin-ui    | demoAdmin/zuihou | 无         |
| swagger 文档  | http://42.202.130.216:10000/api/gate/doc.html  | 无               | 无         |
| 定时任务      | http://42.202.130.216:10000/zuihou-jobs-server | zuihou/zuihou    | 无         |

## 项目截图：

| 预览                                                   | 预览                                                   |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![SBA监控.png](image/项目相关/开发%26运营后台预览.png) | ![SBA监控.png](image/项目相关/租户后台预览.png)        |
| ![SBA监控.png](image/监控界面/sba.png)                 | ![SBA监控.png](image/监控界面/zipkin.png)              |
| ![swagger.png](image/项目相关/swagger获取token.jpg)    | ![admin-api.png](image/项目相关/admin-api.png)         |
| ![SBA监控.png](image/1000star.png)                     | ![定时任务.png](image/项目相关/zuihou-jobs-server.png) |

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

## 功能点介绍:

- **服务注册&发现与调用：**

基于 Nacos 来实现的服务注册与发现，使用使用 Feign 来实现服务互调, 可以做到使用 HTTP 请求远程调用时能与调用本地方法一样的编码体验，开发者完全感知不到这是远程方法，更感知不到这是个 HTTP 请求。

- **服务鉴权:**

通过 JWT 的方式来加强服务之间调度的权限验证，保证内部服务的安全性。

- **负载均衡：**

将服务保留的 rest 进行代理和网关控制，除了平常经常使用的 node.js、nginx 外，Spring Cloud 系列的 zuul 和 rebbion，可以帮我们进行正常的网关管控和负载均衡。其中扩展和借鉴国外项目的扩展基于 JWT 的 Zuul 限流插件，方面进行限流。

- **熔断机制：**

因为采取了服务的分布，为了避免服务之间的调用“雪崩”，采用了 Hystrix 的作为熔断器，避免了服务之间的“雪崩”。

- **监控：**

利用 Spring Boot Admin 来监控各个独立 Service 的运行状态；利用 turbine 来实时查看接口的运行状态和调用频率；通过 Zipkin 来查看各个服务之间的调用链等。

- **数据权限**

利用基于 Mybatis 的 DataScopeInterceptor 拦截器实现了简单的数据权限

- **SaaS 的无感解决方案**

使用 Mybatis 拦截器实现对所有 SQL 的拦截，修改默认的 Schema，从而实现多租户数据隔离的目的。

- **二级缓存**

采用 J2Cache 操作缓存，第一级缓存使用内存(Caffeine)，第二级缓存使用 Redis。 由于大量的缓存读取会导致 L2 的网络成为整个系统的瓶颈，因此 L1 的目标是降低对 L2 的读取次数。
该缓存框架主要用于集群环境中。单机也可使用，用于避免应用重启导致的缓存冷启动后对后端业务的冲击。

- **优雅的 Bean 转换**

采用 Dozer 组件来对 DTO、DO、PO 等对象的优化转换

- **前后端统一表单验证**

严谨的表单验证通常需要 前端+后端同时验证， 但传统的项目，均只能前后端各做一次检验， 后期规则变更，又得前后端同时修改。
故在`hibernate-validator`的基础上封装了`zuihou-validator-starter`起步依赖，提供一个通用接口，可以获取需要校验表单的规则，然后前端使用后端返回的规则，
以后若规则改变，只需要后端修改即可。

- **防跨站脚本攻击（XSS）**
- **当前用户信息注入器**
- **在线 API**

由于原生 swagger-ui 某些功能支持不够友好，故采用了国内开源的`swagger-bootstrap-ui`，并制作了 stater，方便 springboot 用户使用。

- **代码生成器**

基于 Mybatis-plus-generator 自定义了一套代码生成器， 通过配置数据库字段的注释，自动生成枚举类、数据字典注解、SaveDTO、UpdateDTO、表单验证规则注解、Swagger 注解等。

- **定时任务调度器**：

基于 xxl-jobs 进行了功能增强。（如：指定时间发送任务、执行器和调度器合并项目、多数据源）

- **大文件/断点/分片续传**

前端采用 webupload.js、后端采用 NIO 实现了大文件断点分片续传，启动 Eureka、Zuul、File 服务后，直接打开 docs/chunkUploadDemo/demo.html 即可进行测试。
经测试，本地限制堆栈最大内存 128M 启动 File 服务,5 分钟内能成功上传 4.6G+的大文件，正式服耗时则会受到用户带宽和服务器带宽的影响，时间比较长。

- **分布式事务**  
  集成了阿里的分布式事务中间件：seata，以 **高效** 并且对业务 **0 侵入** 的方式，解决 微服务 场景下面临的分布式事务问题。

## 版本参考，

ps: 理论上： node 大于 8.10.x 就行，但最好当前比较新的稳定版 10.x.x 11.x.x 12.x.x

```
node -v
v10.16.3

npm -v
6.9.0

cnpm -v
cnpm@6.1.0 (/usr/local/lib/node_modules/cnpm/lib/parse_argv.js)
npm@6.11.3 (/usr/local/lib/node_modules/cnpm/node_modules/npm/lib/npm.js)
node@10.16.3 (/usr/local/bin/node)
npminstall@3.23.0 (/usr/local/lib/node_modules/cnpm/node_modules/npminstall/lib/index.js)
prefix=/usr/local
darwin x64 17.5.0
registry=https://r.npm.taobao.org

```

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

cnpm install core-js@2.6.9 --prefix G:\github\zuihou-ui

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

## 期待您的加入：

    1，前端  （求一个会前端的大神带飞，重构整个前端项目）
    2，土豪哥哥(求赞助服务器)

## 如何贡献代码

    1，Fork
    2，修改代码后提交pr
    3，等待合并
    4，合并超过5次的朋友，直接拉为项目开发者

## 求助：

由于本人前端技能特别水，在做这 2 个前端项目时，都是边学边写，所以前端的 bug 较多，代码写的也不规范，导致 eslint 报了很多警告，
若你会前端（vue）的或者知道怎么设置 vscode 的格式化规则或者知道怎么设置.eslint 配置的规则，欢迎提交 pr 或者进 qq 群指导一下群主。
本人感激不尽，并赠送后端文档（https://kancloud.cn/zuihou/zuihou-admin-cloud）一份，且提供zuihou-admin-cloud项目的任何支持（启动运行，报错，二次开发，部署等）。
