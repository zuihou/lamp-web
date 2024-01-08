import type { App } from 'vue';

//vexTable组件
import 'xe-utils';
import XEUtils from 'xe-utils';
import VXETable from 'vxe-table';
import VXETablePluginAntd from 'vxe-table-plugin-antd';
import 'vxe-table/lib/style.css';
import zhCN from 'vxe-table/es/locale/lang/zh-CN';
//vexTable(antd插件)
import 'vxe-table-plugin-antd/dist/style.css';
import './style/index.less';

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
  size: 'medium', // 全局尺寸 medium, small, mini
  // zIndex: 999, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡
  // version: 0, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
  table: {
    // showHeader: true,
    // 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
    keepSource: true,
    showOverflow: true, //设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）ellipsis（只显示省略号）,title（并且显示为原生 title）,tooltip（并且显示为 tooltip 提示）
    showHeaderOverflow: true, //设置表头所有内容过长时显示为省略号 ellipsis（只显示省略号）,title（并且显示为原生 title）,tooltip（并且显示为 tooltip 提示）
    // 斑马条纹
    stripe: true,
    border: true,
    rowConfig: {
      // 自定义行数据唯一主键的字段名（默认自动生成）
      keyField: 'id',
      // 当鼠标移到行时，是否要高亮当前行
      isHover: true,
    },
    // 列配置信息
    columnConfig: {
      // 每一列是否启用列宽调整
      resizable: true,
      minWidth: 100,
    },
    checkboxConfig: {
      // 复选框显示的字段名，可以直接显示在复选框中
      labelField: '序号',
      //是否保留勾选状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前选中的状态（需要有 row-config.keyField）
      reserve: true,
      //高亮勾选行
      highlight: true,
      //开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行）
      range: true,
      //触发方式（注：当多种功能重叠时，会同时触发） default（默认）, cell（点击单元格触发）, row（点击行触发）
      trigger: 'cell',
    },
    sortConfig: {
      remote: true, //所有列是否使用服务端排序，如果设置为 true 则不会对数据进行处理
      trigger: 'cell', //触发方式（注：当多种功能重叠时，会同时触发）default（点击按钮触发）, cell（点击表头触发）
      // 是否显示列头排序图标
      showIcon: true,
      // 自定义轮转顺序
      orders: ['asc', 'desc', null],
      // 全局排序方法，当触发排序时会调用该函数，返回排序后的列表
      // sortMethod: null,
      // 是否启用多列组合筛选
      // multiple: false,
      //只对 multiple 有效，是否按照先后触发顺序进行排序
      chronological: false,
      defaultSort: {
        field: 'createdTime',
        order: 'desc',
      },
    },
    filterConfig: {
      remote: true, //所有列是否使用服务端筛选，如果设置为 true 则不会对数据进行处理
      // filterMethod: null
    },
  },
  grid: {
    editConfig: {
      trigger: 'manual',
      mode: 'row',
      showStatus: true,
      autoClear: false,
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      custom: true,
    },
    formConfig: {
      titleWidth: 100,
      titleAlign: 'right',
      // 所有设置标题内容过长时显示为省略号
      // string | boolean
      // ellipsis（只显示省略号）, title（并且显示为原生 title）, tooltip（并且显示为 tooltip 提示）
      titleOverflow: 'tooltip',
    },
    // 分页配置项
    pagerConfig: {
      pageSize: 10,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
    },
    proxyConfig: {
      // 是否自动加载查询数据
      autoLoad: false,
      // 启用动态序号代理，每一页的序号会根据当前页数变化
      seq: true,
      // 启用排序代理，当点击排序时会自动触发 query 行为
      sort: true,
      // 启用筛选代理，当点击筛选时会自动触发 query 行为
      filter: true,
      // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
      form: true,
      //是否显示内置的消息提示（可以设为 false 关闭内置的消息提示）
      message: false,
      // 对应响应结果 { result: [], page: { total: 100 } }
      props: {
        result: 'records', // 配置响应结果列表字段
        total: 'total', // 配置响应结果总页数字段
        // 只对 pager-config 配置了有效，响应结果中获取提示消息的属性
        message: 'msg',
      },
    },
  },
  pager: {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 500, 1000, 5000],
    // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
  },
  // form: {
  //   preventSubmit: false
  //   validConfig: {
  //     autoPos: true
  //   },
  //   size: null,
  //   colon: false,
  //   titleAsterisk: true
  // },
  // input: {
  //   size: null,
  //   transfer: false
  //   parseFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
  //   labelFormat: '',
  //   valueFormat: '',
  //   startDay: 1,
  //   digits: 2,
  //   controls: true
  // },
  // textarea: {
  //   size: null
  //   autosize: {
  //     minRows: 1,
  //     maxRows: 10
  //   }
  // },
  // select: {
  //   size: null,
  //   transfer: false,
  //   multiCharOverflow: 8
  // },
  // toolbar: {
  //   size: null,
  //   import: {
  //     mode: 'covering'
  //   },
  //   export: {
  //     types: ['csv', 'html', 'xml', 'txt']
  //   },
  //   custom: {
  //     isFooter: true
  //   },
  //   buttons: [],
  //   tools: []
  // },
  // button: {
  //   size: null,
  //   transfer: false
  // },
  // radio: {
  //   size: null
  // },
  // checkbox: {
  //   size: null
  // },
  // switch: {
  //   size: null
  // },
  // modal: {
  //   // size: null,
  //   minWidth: 340,
  //   minHeight: 200,
  //   lockView: true,
  //   mask: true,
  //   duration: 3000,
  //   marginSize: 0,
  //   dblclickZoom: true,
  //   showTitleOverflow: true
  //   storage: false
  // },
  // list: {
  //   scrollY: {
  //     gt: 100
  //   }
  // }
});

export function registerJVxeTable(app: App) {
  // 注册插件
  VXETable.use(VXETablePluginAntd);
  app.use(VXETable);
}
