// Used to configure the general configuration of some components without modifying the components

import type { SorterResult } from '../components/Table';

export const SORT_FIELD = 'sort';
export const ORDER_FIELD = 'order';

export default {
  // 表格配置
  table: {
    // 表格接口请求通用配置，可在组件prop覆盖
    // 支持 xxx.xxx.xxx格式
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'current',
      // 传给后台的每页显示多少条的字段
      sizeField: 'size',
      // 接口返回表格数据的字段
      listField: 'records',
      // 接口返回表格总数的字段
      totalField: 'total',
      // 传给后台用于排序的字段
      sortField: SORT_FIELD,
      // 传给后台用于排序指定asc/desc的字段
      orderField: ORDER_FIELD,
    },
    // 可选的分页选项
    pageSizeOptions: ['5', '10', '20', '50', '80', '100'],
    // 默认每页显示多少条
    defaultPageSize: 20,
    // Default Size
    defaultSize: 'middle',
    // 默认排序方法
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order } = sortInfo;
      if (field && order) {
        return {
          // 排序字段
          [SORT_FIELD]: field,
          // 排序方式 asc/desc
          [ORDER_FIELD]: order,
        };
      } else {
        return {};
      }
    },
    // 自定义过滤方法
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data;
    },
  },
  // 滚动组件配置
  vxeTable: {
    table: {
      border: true,
      stripe: true,
      columnConfig: {
        resizable: true,
        isCurrent: true,
        isHover: true,
      },
      rowConfig: {
        isCurrent: true,
        isHover: true,
      },
      emptyRender: {
        name: 'AEmpty',
      },
      printConfig: {},
      exportConfig: {},
      customConfig: {
        storage: true,
      },
    },
    grid: {
      toolbarConfig: {
        enabled: true,
        export: true,
        zoom: true,
        print: true,
        refresh: true,
        custom: true,
      },
      pagerConfig: {
        pageSizes: [20, 50, 100, 500],
        pageSize: 20,
        autoHidden: true,
      },
      proxyConfig: {
        form: true,
        props: {
          result: 'items',
          total: 'total',
        },
      },
      zoomConfig: {},
    },
  },
  // scrollbar setting
  scrollbar: {
    // 是否使用原生滚动样式
    // 开启后，菜单，弹窗，抽屉会使用原生滚动条组件
    native: false,
  },
};
