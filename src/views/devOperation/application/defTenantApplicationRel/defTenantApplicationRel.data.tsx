import { Tag } from 'ant-design-vue';
import { dateUtil } from '/@/utils/dateUtil';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { query as queryApplication } from '/@/api/devOperation/application/defApplication';
import { query as queryTenant } from '/@/api/devOperation/tenant/tenant';
import { TenantStatusEnum } from '/@/enums/biz/tenant';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
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
      customRender: ({ record }) => {
        return (
          <Tag color={record.expired ? 'warning' : 'success'}>
            {record.expirationTime ?? '永久有效'}
          </Tag>
        );
      },
    },
    {
      title: t('devOperation.application.defTenantApplicationRel.authorizationTime'),
      dataIndex: 'createdTime',
      sorter: true,
      width: 180,
    },
  ];
};

export const getTenantColumns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.tenant.defTenant.name'),
      dataIndex: 'name',
      // width: 180,
    },
  ];
};

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'tenantId',
      label: t('devOperation.application.defTenantApplicationRel.tenantId'),
      component: 'ApiSelect',
      componentProps: {
        api: queryTenant,
        labelField: 'name',
        valueField: 'id',
        params: {
          status: TenantStatusEnum.NORMAL,
        },
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
      },
      colProps: { span: 6 },
    },
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

// 编辑页字段
export const editFormSchema = (_): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.application.defTenantApplicationRel.tenantId'),
      field: 'tenantId',
      component: 'ApiSelect',
      dynamicDisabled: true,
      componentProps: {
        api: queryTenant,
        labelField: 'name',
        valueField: 'id',
        params: {
          status: TenantStatusEnum.NORMAL,
        },
      },
    },
    {
      label: t('devOperation.application.defTenantApplicationRel.applicationId'),
      field: 'applicationId',
      component: 'ApiSelect',
      dynamicDisabled: true,
      componentProps: { api: queryApplication, labelField: 'name', valueField: 'id' },
    },
    {
      label: t('devOperation.application.defTenantApplicationRel.expirationTime'),
      field: 'expirationTime',
      component: 'DatePicker',
      componentProps: {
        style: { width: '100%' },
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
    {
      label: '分配的资源',
      field: 'resourceIdList',
      slot: 'resourceIdList',
      component: 'Input',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
