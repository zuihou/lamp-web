import { Badge } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { DictEnum, EnumEnum } from '/@/enums/commonEnum';
import { DropMenu } from '/@/components/Dropdown/src/typing';

import { LoginStatusEnum } from '/@/enums/biz/tenant';
import { dictComponentProps, enumComponentProps } from '/@/utils/lamp/common';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    // {
    //   title: t('devOperation.system.defLoginLog.tenantId'),
    //   dataIndex: 'tenantId',
    //   // width: 180,
    // },
    // {
    //   title: t('devOperation.system.defLoginLog.employeeId'),
    //   dataIndex: 'employeeId',
    //   // width: 180,
    // },
    // {
    //   title: t('devOperation.system.defLoginLog.userId'),
    //   dataIndex: 'userId',
    //   // width: 180,
    // },
    {
      title: t('devOperation.system.defLoginLog.requestIp'),
      dataIndex: 'requestIp',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.nickName'),
      dataIndex: 'nickName',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.username'),
      dataIndex: 'username',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.description'),
      dataIndex: 'description',
      // width: 180,
      customRender: ({ record }) => {
        const status = LoginStatusEnum.SUCCESS === record.status ? 'success' : 'error';
        return <Badge status={status} text={record.description} />;
      },
    },
    {
      title: t('devOperation.system.defLoginLog.loginDate'),
      dataIndex: 'loginDate',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.browser'),
      dataIndex: 'browser',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.browserVersion'),
      dataIndex: 'browserVersion',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.operatingSystem'),
      dataIndex: 'operatingSystem',
      // width: 180,
    },
    {
      title: t('devOperation.system.defLoginLog.location'),
      dataIndex: 'location',
      // width: 180,
    },
    {
      title: t('lamp.common.createdTime'),
      dataIndex: 'createdTime',
      sorter: true,
      width: 180,
    },
  ];
};

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('devOperation.system.defLoginLog.status'),
      field: 'status',
      component: 'ApiSelect',
      componentProps: {
        ...enumComponentProps(EnumEnum.LoginStatusEnum),
      },
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.system.defLoginLog.requestIp'),
      field: 'requestIp',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.system.defLoginLog.username'),
      field: 'username',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.system.defLoginLog.nickName'),
      field: 'nickName',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.system.defLoginLog.description'),
      field: 'description',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      field: 'createTimeRange',
      label: t('lamp.common.createdTime'),
      component: 'RangePicker',
      colProps: { span: 8 },
    },
  ];
};

// 编辑页字段
export const editFormSchema = (_): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    // {
    //   label: t('devOperation.system.defLoginLog.tenantId'),
    //   field: 'tenantId',
    //   component: 'Input',
    //   dynamicDisabled: () => {
    //     return [ActionEnum.VIEW].includes(type.value);
    //   },
    // },
    // {
    //   label: t('devOperation.system.defLoginLog.employeeId'),
    //   field: 'employeeId',
    //   component: 'Input',
    //   dynamicDisabled: () => {
    //     return [ActionEnum.VIEW].includes(type.value);
    //   },
    // },
    // {
    //   label: t('devOperation.system.defLoginLog.userId'),
    //   field: 'userId',
    //   component: 'Input',
    //   dynamicDisabled: () => {
    //     return [ActionEnum.VIEW].includes(type.value);
    //   },
    // },
    {
      label: t('devOperation.system.defLoginLog.requestIp'),
      field: 'requestIp',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.nickName'),
      field: 'nickName',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.username'),
      field: 'username',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.status'),
      field: 'status',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.TENANT_LOGIN_STATUS),
      },
    },
    {
      label: t('devOperation.system.defLoginLog.description'),
      field: 'description',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.loginDate'),
      field: 'loginDate',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.ua'),
      field: 'ua',
      component: 'InputTextArea',
    },
    {
      label: t('devOperation.system.defLoginLog.browser'),
      field: 'browser',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.browserVersion'),
      field: 'browserVersion',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.operatingSystem'),
      field: 'operatingSystem',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defLoginLog.location'),
      field: 'location',
      component: 'Input',
    },
  ];
};

export const clearList: DropMenu[] = [
  {
    text: '保留1个月',
    event: '1',
  },
  {
    text: '保留三个月',
    event: '2',
  },
  {
    text: '保留六个月',
    event: '3',
  },
  {
    text: '保留一年',
    event: '4',
  },
  {
    text: '保留一千条',
    event: '5',
  },
  {
    text: '保留一万条',
    event: '6',
  },
  {
    text: '保留三万条',
    event: '7',
  },
  {
    text: '保留十万条',
    event: '8',
  },
  {
    text: '清空所有',
    event: '9',
  },
];
