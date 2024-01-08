// 资源接口 表格
import { BasicColumn, FormSchema } from '/@/components/Table';
import { findOnlineService } from '/@/api/devOperation/tenant/tenant';
import { enumComponentProps } from '/@/utils/lamp/common';
import { EnumEnum } from '/@/enums/commonEnum';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const resourceApiColumns: BasicColumn[] = [
  {
    title: 'resourceId',
    dataIndex: 'resourceId',
    ifShow: false,
  },
  // {
  //   title: t('devOperation.application.defResourceApi.springApplicationName'),
  //   dataIndex: 'springApplicationName',
  //   width: 150,
  // },
  // {
  //   title: t('devOperation.application.defResourceApi.controller'),
  //   dataIndex: 'controller',
  // },
  {
    title: t('devOperation.application.defResourceApi.name'),
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: t('devOperation.application.defResourceApi.uri'),
    dataIndex: 'uri',
    ellipsis: true,
    align: 'left',
  },
];

// 资源接口 编辑表单
export const editResourceApiFormSchema = (): FormSchema[] => {
  return [
    {
      label: '是否手动录入',
      field: 'isInput',
      component: 'RadioGroup',
      show: false,
    },
    {
      label: '临时id',
      field: 'tempId',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.application.defResourceApi.springApplicationName'),
      field: 'springApplicationName',
      component: 'ApiSelect',
      helpMessage: [
        'lamp-cloud: 自动查询后台已经正常启动并注册到nacos中的服务',
        'lamp-boot: 后台写死lamp-boot-server返回即可',
      ],
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
          api: findOnlineService,
        };
      },
      required: true,
    },
    {
      label: t('devOperation.application.defResourceApi.controller'),
      field: 'controller',
      component: 'Input',
      required: true,
    },
    {
      label: t('devOperation.application.defResourceApi.uri'),
      field: 'uri',
      component: 'Input',
      required: true,
    },
    {
      label: t('devOperation.application.defResourceApi.requestMethod'),
      field: 'requestMethod',
      component: 'ApiSelect',
      required: true,
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
          ...enumComponentProps(EnumEnum.HttpMethod),
          // options: [
          //   { value: 'ALL', label: '所有' },
          //   { value: 'GET', label: 'GET' },
          //   { value: 'POST', label: 'POST' },
          //   { value: 'PUT', label: 'PUT' },
          //   { value: 'DELETE', label: 'DELETE' },
          // ],
        };
      },
    },
    {
      label: t('devOperation.application.defResourceApi.name'),
      field: 'name',
      component: 'Input',
      required: true,
    },
  ];
};

// 资源接口 选择表单
export const selectResourceApiFormSchema = (
  handleServiceChange: Fn,
  handleControllerChange: Fn,
  handleUriChange: Fn,
  handleUriDeselect: Fn,
): FormSchema[] => {
  return [
    {
      label: t('devOperation.application.defResourceApi.springApplicationName'),
      field: 'service',
      component: 'ApiSelect',
      helpMessage: [
        'lamp-cloud: 自动查询后台已经正常启动并注册到nacos中的服务',
        'lamp-boot: 后台写死lamp-boot-server返回即可',
      ],
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
          onChange: handleServiceChange,
          showSearch: true,
          api: findOnlineService,
          // resultField: 'list',
          // labelField: 'name',
          // valueField: 'id',
          // options: [
          //   // 后端有几个服务，就写几个
          //   { value: 'base', label: '基础服务' },
          //   { value: 'oauth', label: '认证服务' },
          //   { value: 'system', label: '系统服务' },
          //   { value: 'gateway', label: '网关服务' },
          // ],
        };
      },
    },
    {
      label: t('devOperation.application.defResourceApi.controller'),
      field: 'controller',
      component: 'Select',
      componentProps: {
        getPopupContainer: () => document.body,
        onChange: handleControllerChange,
        showSearch: true,
      },
    },
    {
      label: t('devOperation.application.defResourceApi.uri'),
      field: 'uri',
      component: 'Select',
      componentProps: {
        onChange: handleUriChange,
        onDeselect: handleUriDeselect,
        mode: 'multiple',
        'option-label-prop': 'label',
        getPopupContainer: () => document.body,
      },
    },
  ];
};
