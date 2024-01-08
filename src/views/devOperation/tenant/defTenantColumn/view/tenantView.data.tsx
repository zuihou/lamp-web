import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { query as queryApplication } from '/@/api/devOperation/application/defApplication';
import { stateFilters } from '/@/utils/lamp/common';

const { t } = useI18n();

// 列表页字段
export const userListColumns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.tenant.defUser.username'),
      dataIndex: 'username',
      width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.nickName'),
      dataIndex: 'nickName',
      width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.email'),
      dataIndex: 'email',
      // width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.mobile'),
      dataIndex: 'mobile',
      // width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.sex'),
      dataIndex: ['echoMap', 'sex'],
      width: 80,
    },
    {
      title: t('devOperation.tenant.defUser.state'),
      dataIndex: 'state',
      width: 80,
      filters: [...stateFilters()],
      filterMultiple: false,
      format: (text) => {
        return text ? t('lamp.common.enable') : t('lamp.common.disable');
      },
    },
    {
      title: t('lamp.common.createdTime'),
      dataIndex: 'createdTime',
      sorter: true,
      width: 180,
    },
  ];
};

export const userListSearchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('devOperation.tenant.defUser.username'),
      field: 'username',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.nickName'),
      field: 'nickName',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.email'),
      field: 'email',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.idCard'),
      field: 'idCard',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'createTimeRange',
      label: t('lamp.common.createdTime'),
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
};

// 列表页字段
export const applicationColumns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.application.defTenantApplicationRel.tenantId'),
      dataIndex: ['echoMap', 'tenantId'],
      // width: 180,
    },
    {
      title: t('devOperation.application.defTenantApplicationRel.applicationId'),
      dataIndex: ['echoMap', 'applicationId'],
      // width: 180,
    },
    {
      title: t('devOperation.application.defTenantApplicationRel.expirationTime'),
      dataIndex: 'expirationTime',
      width: 180,
      sorter: true,
    },
    {
      title: t('devOperation.application.defTenantApplicationRel.expired'),
      dataIndex: 'expired',
      width: 80,
    },
    {
      title: t('devOperation.application.defTenantApplicationRel.authorizationTime'),
      dataIndex: 'createdTime',
      sorter: true,
      width: 180,
    },
  ];
};

export const applicationSearchFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'applicationId',
      label: t('devOperation.application.defTenantApplicationRel.applicationId'),
      component: 'ApiSelect',
      componentProps: {
        api: queryApplication,
        labelField: 'name',
        valueField: 'id',
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
      },
      colProps: { span: 6 },
    },
    {
      field: 'createTimeRange',
      label: t('lamp.common.createdTime'),
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
};
