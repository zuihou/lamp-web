export default {
  route: {
    dashboard: '系统主页',
    profile: '个人中心'
  },
  navbar: {
    setting: '系统设置',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    docs: '项目文档',
    theme: '换肤',
    size: '布局大小',
    deleteCache: '清除缓存'
  },
  login: {
    title: 'FEBS 系统登录',
    logIn: '立即登录',
    username: '账号',
    password: '密码',
    code: '验证码',
    ortherLoginType: '其他登录方式',
    chooseToSignIn: '选择以下账号登录：',
    type: {
      up: '账号密码登录',
      social: '第三方账号登录'
    }
  },
  documentation: {
    documentation: '项目文档',
    github: '项目地址'
  },
  table: {
    user: {
      username: '用户名',
      password: '密码',
      sex: '性别',
      email: '邮箱',
      dept: '部门',
      role: '角色',
      mobile: '电话',
      status: '状态',
      createTime: '创建时间',
      modifyTime: '修改时间',
      lastLoginTime: '最后登录时间',
      desc: '个人描述',
      oldPassword: '旧密码',
      newPassword: '新密码',
      confirmPassword: '再次确认',
      social: '第三方账号'
    },
    role: {
      roleName: '角色名称',
      remark: '角色描述',
      createTime: '创建时间',
      perms: '角色权限'
    },
    menu: {
      parentId: '上级ID',
      menuName: '名称',
      type: '类型',
      icon: '图标',
      component: '组件',
      path: 'URL',
      orderNum: '排序',
      perms: '权限'
    },
    dept: {
      deptName: '部门名称',
      parentId: '上级ID',
      orderNum: '排序'
    },
    systemLog: {
      username: '操作人',
      operation: '操作描述',
      createTime: '操作时间',
      time: '耗时',
      method: '操作方法',
      params: '方法参数',
      ip: 'IP',
      location: '操作地点'
    },
    loginLog: {
      username: '用户名',
      loginTime: '登录时间',
      ip: 'IP',
      location: '登录地点',
      system: '登录系统',
      browser: '浏览器'
    },
    gen: {
      config: {
        author: '作者名称',
        basePackage: '基础包名',
        entityPackage: 'entity包名',
        mapperPackage: 'mapper包名',
        mapperXmlPackage: 'mapperXml包名',
        servicePackage: 'service包名',
        serviceImplPackage: 'serviceImpl包名',
        controllerPackage: 'controller包名',
        isTrim: '是否去除表前缀',
        trimValue: '表前缀'
      },
      generate: {
        tableName: '表名',
        remark: '备注',
        dataRows: '数据量（行）',
        createTime: '创建时间',
        updateTime: '更新时间'
      }
    },
    eximport: {
      field1: '字段1',
      field2: '字段2',
      field3: '字段3',
      createTime: '导入时间'
    },
    refresh: '刷新',
    operation: '操作',
    search: '搜索',
    reset: '重置',
    more: '更多操作',
    add: '添加',
    export: '导出',
    import: '导入',
    templateDownload: '模板下载',
    delete: '删除',
    resetPassword: '密码重置',
    openInNewPage: '新页面打开'
  },
  tagsView: {
    refresh: '刷新当前',
    close: '关闭当前',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  system: {
    title: 'FEBS 权限系统'
  },
  tips: {
    usernameShouldNotBeEmpty: '用户名不能为空',
    passwordShouldNotBeEmpty: '密码不能为空',
    switchLanguageSuccess: '切换语言成功',
    loginSuccess: '登录成功',
    loginFail: '登录失败',
    defaultPassword: '用户的默认密码为1234qwer',
    getDataFail: '获取数据失败',
    createSuccess: '新增成功',
    updateSuccess: '修改成功',
    deleteSuccess: '删除成功',
    noDataSelected: '请先选择需要操作的数据',
    confirmDelete: '选中数据将被永久删除, 是否继续？',
    confirmDeleteCache: '是否立即清除用户权限缓存？',
    containCurrentUser: '包含当前登录用户，操作已取消',
    neverLogin: '从未登录过系统',
    nothing: '这家伙很懒，什么都没留下',
    topId: '值为0时表示顶级节点',
    choose: '已选择：',
    chooseNothing: '尚未选择任何图标',
    onlyChooseOne: '只能选择一个节点作为父节点',
    noNodeSelected: '请先选择节点',
    confirmDeleteNode: '选中节点及其子结点将被永久删除, 是否继续？',
    iframeGrant: '用户名：FEBS 密码：123456',
    notEqual: '两次输入不一致',
    oldPasswordIncorrect: '原密码不正确',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    onlySupportXlsx: '只支持Xlsx类型文件',
    updating: '修改中',
    updateFailed: '修改失败',
    noPermission: '无权限',
    confirmRestPassword: '确定重置所选用户密码？',
    resetPasswordSuccess: '所选用户密码重置已被重置为1234qwer',
    getCodeImageFailed: '获取图形验证码失败',
    tooManyRequest: '获取验证码过于频繁，请1分钟后再试',
    clientOriginSecret: '该客户端原始密码为：'
  },
  rules: {
    require: '不能为空',
    range2to10: '长度在 2 到 10 个字符',
    range3to10: '长度在 3 到 10 个字符',
    range3to20: '长度在 3 到 20 个字符',
    range4to10: '长度在 4 到 10 个字符',
    range6to20: '长度在 6 到 20 个字符',
    email: '请输入正确的邮箱地址',
    mobile: '请输入合法的手机号',
    usernameExist: '该用户名已存在',
    clientIdExist: '该Client ID已存在',
    roleNameExist: '该角色名称已存在',
    noMoreThan10: '长度不能超过10个字符',
    noMoreThan11: '长度不能超过11个字符',
    noMoreThan20: '长度不能超过20个字符',
    noMoreThan50: '长度不能超过50个字符',
    noMoreThan100: '长度不能超过100个字符',
    invalidInteger: '请输入大于零的整数',
    invalidURL: '不是有效的URL'
  },
  common: {
    system: '分布式微服务权限系统',
    desc: {
      a: '基于Spring Boot 2.1.8 & Spring Cloud Greenwich.SR3',
      b: '使用Spring Cloud OAuth2统一认证',
      c: '认证服务器资源服务器分离，方便拓展',
      d: '前后端分离架构，提高软件开发效率',
      e: '集成多种监控，为微服务保驾护航',
      f: '提供详细的文档，手把手教你从零搭建到部署'
    },
    view: '查看',
    tips: '提示',
    clear: '清除',
    confirm: '确定',
    cancel: '取消',
    add: '新增',
    edit: '修改',
    yes: '是',
    no: '否',
    sex: {
      male: '男性',
      female: '女性',
      secret: '保密'
    },
    status: {
      valid: '有效',
      invalid: '禁用'
    },
    menu: {
      menu: '菜单',
      button: '按钮'
    },
    tab: {
      common: '通用类',
      directivity: '指向性',
      solid: '填充类',
      food: '食品类'
    },
    aboutMe: '关于我',
    changeAvatar: '更换头像',
    lastLoginTime: '上次登录时间',
    goodMorning: '早上好',
    goodAfternoon: '下午好',
    goodEvening: '晚上好',
    randomMessage: {
      a: '喝杯咖啡休息下吧☕',
      b: '要不要和朋友打局LOL',
      c: '今天又写了几个Bug🐞呢',
      d: '今天在群里吹水了吗',
      e: '今天吃了什么好吃的呢',
      f: '今天您微笑了吗😊',
      g: '今天帮别人解决问题了吗',
      h: '准备吃些什么呢',
      i: '周末要不要去看电影？'
    },
    allProject: '所有项目',
    noDept: '暂无部门',
    noRole: '暂无角色',
    firstLogin: '第一次登录系统',
    todayIp: '今日IP',
    todayVisit: '今日访问',
    TotalVisit: '总访问量',
    you: '您',
    total: '总数',
    visitTitle: '近十天系统访问记录',
    timeline: '登录时间',
    account: '账号信息',
    password: '个人密码',
    importResult: '导入结果',
    hthz: '后田花子',
    al: '阿里系',
    lm: '脸萌',
    ctc: '点击选择',
    pleaseInputUrl: '请输入URL',
    bind: '绑定',
    unbind: '解绑',
    confirmUnbind: '确定解绑该第三方账号？',
    unbindSuccess: '解绑成功',
    bindSuccess: '绑定成功',
    bindLogin: '绑定并登录',
    signLogin: '注册并登录',
    current: '当前',
    socialAccount: '账号',
    socialTips: '尚未绑定任何系统账户，您可以绑定系统账户或者注册一个新的账户并绑定。'
  }
}
