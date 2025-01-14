interface GroupItem {
  title: string;
  icon: string;
  color: string;
  desc: string;
  date: string;
  group: string;
}

interface NavItem {
  title: string;
  icon: string;
  color: string;
  href: string;
}

interface DynamicInfoItem {
  percent: number;
  name: string;
  date: string;
  desc: string;
}

export const navItems: NavItem[] = [
  {
    title: '数据源模式',
    icon: 'ion:home-outline',
    color: '#1fdaca',
    href: 'https://datasource.tangyh.top',
  },
  {
    title: '字段模式',
    icon: 'ion:grid-outline',
    color: '#bf0c2c',
    href: 'https://column.tangyh.top',
  },
  {
    title: '非租户模式',
    icon: 'ion:layers-outline',
    color: '#e18525',
    href: 'https://none.tangyh.top',
  },
  {
    title: '官网',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
    href: 'https://tangyh.top',
  },
  {
    title: '5.x文档',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
    href: 'https://tangyh.top/doc/%E7%AE%80%E4%BB%8B.html',
  },
  {
    title: 'vben文档',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
    href: 'https://doc.vvbin.cn/',
  },
];

export const dynamicInfoItems: DynamicInfoItem[] = [
  {
    percent: 100,
    name: '5.0.3发布, 菜单数据支持国际化',
    date: '2024年12月10日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/324163/lamp-cloud-5-0-3-released">菜单数据支持国际化</a>`,
  },
  {
    percent: 100,
    name: '5.0.2发布,bug修复',
    date: '2024年11月12日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/324163/lamp-cloud-5-0-2-released">代码生成器适配5.0版本</a>`,
  },
  {
    percent: 100,
    name: '5.0.1发布,',
    date: '2024年10月16日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/324163/lamp-cloud-5-0-1-released">代码生成器适配5.0版本</a>`,
  },
  {
    percent: 100,
    name: '5.0.0发布,单体版和微服务版合并',
    date: '2024年10月09日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/315448/lamp-cloud-5-0-0-released">单体版和微服务版融合</a>`,
  },
  {
    percent: 100,
    name: '4.22.0发布,',
    date: '2024年09月27日',
    desc: `<a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html">单体版和微服务版融合</a>`,
  },
  {
    percent: 100,
    name: '4.21.2发布，依赖升级',
    date: '2024年09月03日',
    desc: `<a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html">依赖升级</a>`,
  },
  {
    percent: 100,
    name: '4.21.1发布，bug修复',
    date: '2024年08月22日',
    desc: `<a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html">bug修复</a>`,
  },
  {
    percent: 100,
    name: '4.21.0发布，集成sa-token',
    date: '2024年08月12日',
    desc: `<a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html">集成sa-token</a>`,
  },
  {
    percent: 100,
    name: '4.20.0发布，依赖升级，excel导入导出集成',
    date: '2024年06月27日',
    desc: `<a target="_blank" href="https://soy-column.tangyh.top">依赖升级，excel导入导出集成</a>`,
  },
  {
    percent: 100,
    name: '4.19.1',
    date: '2024年06月04日',
    desc: `<a target="_blank" href="https://soy-column.tangyh.top">基于 soybean-admin、fast-crud 封装的全新前端正式发布</a>`,
  },
  {
    percent: 100,
    name: '4.19.0-java17-beta.1',
    date: '2024年06月05日00:35:45',
    desc: `<a target="_blank" href="https://soy-column.tangyh.top">发布，基于 soybean-admin、fast-crud 封装的全新前端，完成度90%</a>`,
  },
  {
    percent: 100,
    name: '4.18.0',
    date: '2024年03月01日21:47:53',
    desc: `<a target="_blank" href="https://soy-column.tangyh.top">全新后台UI，即将来袭...(账号密码与本系统相同)</a>`,
  },
  {
    percent: 100,
    name: '4.17.0-java17/4.17.0',
    date: '2024年3月1日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/281346">前端bug修复</a>`,
  },
  {
    percent: 100,
    name: '4.16.0-java17/4.16.0',
    date: '2024年1月15日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/275912">4.x系列基于jdk17的none模式开源，停止3.x版本新功能开发</a>`,
  },
  {
    percent: 100,
    name: '4.15.0-java17',
    date: '2023年12月28日',
    desc: `<a target="_blank" href="https://www.oschina.net/news/273069/lamp-cloud-4-15-0-java17-released">适配jdk17</a>`,
  },
  {
    percent: 100,
    name: '4.14.x 视频适配版已完结',
    date: '2023年11月17日',
    desc: `讲解视频第一版已完成，欢迎大家观看后提出意见，后续根据意见补录，<a target="_blank" href="https://gitee.com/dromara/lamp-cloud/issues/I6NT95">点我看视频</a>`,
  },
  {
    percent: 100,
    name: '4.14.3 已发布：',
    date: '2023年08月08日',
    desc: ` <a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html#_4-14-2-2023%E5%B9%B408%E6%9C%8818%E6%97%A511-11-08">新增 测试消息发送 页面</a>`,
  },
  {
    percent: 100,
    name: '4.14.2 已发布：',
    date: '2023年08月18日',
    desc: ` <a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html#_4-14-2-2023%E5%B9%B408%E6%9C%8818%E6%97%A511-11-08">新增 测试消息发送 页面</a>`,
  },
  {
    percent: 100,
    name: '4.14.1 已发布：',
    date: '2023年07月25日',
    desc: ` <a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html#_4-14-1-2023%E5%B9%B407%E6%9C%8825%E6%97%A508-52-46">重要修复bug</a>`,
  },
  {
    percent: 100,
    name: '4.14.0 已发布：',
    date: '2023年07月05日',
    desc: ` <a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html#_4-14-0-2023%E5%B9%B407%E6%9C%8805%E6%97%A523-48-12">主要组件依赖升级</a>`,
  },
  {
    percent: 100,
    name: '4.13.2 已发布：',
    date: '2023年06月25日',
    desc: ` <a target="_blank" href="https://tangyh.top/upgrade/4.x%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%E6%97%A5%E5%BF%97.html">文档编写完成</a>`,
  },
  {
    percent: 100,
    name: '4.13.1 已发布：',
    date: '2023年05月15日',
    desc: ` <a target="_blank" href="https://mp.weixin.qq.com/s/VTLEB4pniUfOe3KHxgB_aQ">优化功能、修复bug</a>`,
  },
  {
    percent: 100,
    name: '4.13.0 已发布：',
    date: '2023年04月20日',
    desc: ` <a target="_blank" href="https://mp.weixin.qq.com/s?__biz=MzAxMDY2NDMxNA==&mid=2649866410&idx=1&sn=e9a986b6a6c222d6f0c72c10b32e2ff6&chksm=834980bfb43e09a972117d94925c3a0455014d03f464c3347a0c5c867e77762ab044478ba80b#rd">优化功能（前端首次启动加载慢）、修复bug</a>`,
  },
  {
    percent: 100,
    name: '4.12.5 已发布：',
    date: '2022-11-16',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/220558">《灯灯》4.12.5 已发布，升级Spring Boot 2.7.6</a>`,
  },
  {
    percent: 100,
    name: '4.12.4 已发布：',
    date: '2022-11-16',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/218618">《灯灯》4.12.4 已发布，调整 cloud 版本，lamp-oauth-userinfo 模块依赖关系 </a>`,
  },
  {
    percent: 100,
    name: '4.12.3 已发布：',
    date: '2022-11-16',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/217926/lamp-4-12-3-released">《灯灯》4.12.3 已发布，增加经常使用接口的缓存、按阿里代码规范、FindBug规范扫描代码，并修复beta版本的bug</a>`,
  },
  {
    percent: 100,
    name: '4.12.3-beta 已发布：',
    date: '2022-11-07',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/216724/lamp-cloud-4-12-3-beta-released">《灯灯》4.12.3-beta 已发布，增加缓存、按阿里代码规范、FindBug规范扫描代码</a>`,
  },
  {
    percent: 100,
    name: '4.12.2 已发布：',
    date: '2022-10-17',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/213894/lamp-cloud-4-12-2-released">《灯灯》4.12.2 已发布，资源维护优化、代码优化</a>`,
  },
  {
    percent: 100,
    name: '4.12.1-beta 已发布：',
    date: '2022-10-08',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/212811">《灯灯》4.12.1-beta已发布，认证服务重构 & 前端项目优化</a>`,
  },
  {
    percent: 100,
    name: '4.12.0-beta 已发布：',
    date: '2022-09-28',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/211947">《灯灯》4.12.0-beta已发布，前端项目优化</a>`,
  },
  {
    percent: 100,
    name: '4.11.0 已发布：',
    date: '2022-09-21',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/211083/lamp-cloud-4-11-0-released">《灯灯》4.11.0已发布，DATASOURCE_COLUMN模式中的COLUMN部分</a>`,
  },
  {
    percent: 100,
    name: '4.10.0 已发布：',
    date: '2022-08-16',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/206683">《灯灯》4.10.0发布，适配Oracle、SQL Server</a>`,
  },
  {
    percent: 100,
    name: '4.10.0-beta.0 已发布：',
    date: '2022-08-09',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/205869">《灯灯》4.10.0-beta.0发布，适配SQL Server</a>`,
  },
  {
    percent: 100,
    name: '4.9.0 已发布：',
    date: '2022-08-01',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/204848">《灯灯》4.9.0 正式版发布，消息中心全新上线，支持解析Groovy脚本、动态替换Freemarker格式的消息模板、提供消息发送接口</a>`,
  },
  {
    percent: 100,
    name: '4.9.0-beta.0 已发布：',
    date: '2022-07-21',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/203648/lamp-cloud-4-9-0-beta0-released">《灯灯》4.9.0-beta.0发布，消息中心重构，支持发送短信、邮件、站内信</a>`,
  },
  {
    percent: 100,
    name: '4.8.0 已发布：',
    date: '2022-06-28',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/201000">《灯灯》4.8.0发布，Activiti 工作流首次发布(仅none、column模式)</a>`,
  },
  {
    percent: 100,
    name: '4.7.0 已发布：',
    date: '2022-06-17',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/199859">《灯灯》4.7.0发布，代码生成器支持批量生成、预览、下载、修改；支持下载项目结构;</a>`,
  },
  {
    percent: 100,
    name: '4.6.1 已发布：',
    date: '2022-05-24',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/197090">《灯灯》4.6.1发布，修复fastjson安全漏洞！</a>`,
  },
  {
    percent: 100,
    name: '4.6.0 已发布：',
    date: '2022-05-10',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/195073">代码生成器适配3种模式、6个项目，column、none模式首次发布！</a>`,
  },
  {
    percent: 100,
    name: '4.5.2 已发布：',
    date: '2022-04-12',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/190798">spring boot 2.6.6、代码生成器支持生成项目、集成vxe-table、升级ant-design-vue3.1.1</a>`,
  },
  {
    percent: 100,
    name: '4.5.1 已发布：',
    date: '2022-03-29',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/188721">资源维护页面显示优化、资源维护页面配置接口功能优化、通过接口获取真实的后台存活接口数据、配置代码生成器功能相关的菜单、uri、按钮等资源</a>`,
  },
  {
    percent: 100,
    name: '4.5.0 已发布：',
    date: '2022-03-28',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/188560/lamp-cloud-4-5-released">可视化代码生成器</a>`,
  },
  {
    percent: 100,
    name: '4.4.1 已发布：',
    date: '2022-03-07',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/185326">修复 spring cloud gateway 漏洞</a>`,
  },
  {
    percent: 100,
    name: '4.4.0 已发布：',
    date: '2022-02-22',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/183551/lamp-cloud-4-4-released">COLUMN模式上线，以租户ID字段隔离租户数据</a>`,
  },
  {
    percent: 100,
    name: '4.3.0 已发布：',
    date: '2022-01-17',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/178821">新增完整的数据权限配置、控制、鉴权、拦截流程</a> `,
  },
  {
    percent: 100,
    name: '4.2.0 已发布：',
    date: '2021-12-29',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/176035">spring boot单体版首发、4.x版本文档首发</a> `,
  },
  {
    percent: 100,
    name: '4.1.0 已发布：',
    date: '2021-12-16',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/173976/lamp-cloud-pro-4-1-released">服务合并、租户库合并、URI权限校验等近百余项更新</a> `,
  },
  {
    percent: 100,
    name: '4.0.0 已发布：',
    date: '2021-11-18',
    desc: ` <a target="_blank" href="https://www.oschina.net/news/169502/lamp-cloud-pro-4-0-released">全新的租户体系、应用体系、权限体系</a>`,
  },
];

export const groupItems: GroupItem[] = [
  {
    title: '基础平台',
    icon: 'carbon:logo-github',
    color: '',
    desc: '不要等待机会，而要创造机会。',
    group: '有效',
    date: '2021-04-01',
  },
  {
    title: '运营系统',
    icon: 'ion:logo-vue',
    color: '#3fb27f',
    desc: '现在的你决定将来的你。',
    group: '已过期',
    date: '2021-04-01',
  },
  {
    title: 'Html5',
    icon: 'ion:logo-html5',
    color: '#e18525',
    desc: '没有什么才能比努力更重要。',
    group: '上班摸鱼',
    date: '2021-04-01',
  },
  {
    title: 'Angular',
    icon: 'ion:logo-angular',
    color: '#bf0c2c',
    desc: '热情和欲望可以突破一切难关。',
    group: 'UI',
    date: '2021-04-01',
  },
  {
    title: 'React',
    icon: 'bx:bxl-react',
    color: '#00d8ff',
    desc: '健康的身体是实目标的基石。',
    group: '技术牛',
    date: '2021-04-01',
  },
  // {
  //   title: 'Js',
  //   icon: 'ion:logo-javascript',
  //   color: '#4daf1bc9',
  //   desc: '路是走出来的，而不是空想出来的。',
  //   group: '架构组',
  //   date: '2021-04-01',
  // },
];
