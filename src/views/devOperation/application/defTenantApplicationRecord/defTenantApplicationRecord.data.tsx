import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { query as queryApplication } from '/@/api/devOperation/application/defApplication';
import { query as queryTenant } from '/@/api/devOperation/tenant/tenant';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { ApplicationGrantTypeEnum, TenantStatusEnum } from '/@/enums/biz/tenant';

const { t } = useI18n();
const grantTypeMap = new Map();
grantTypeMap.set(ApplicationGrantTypeEnum.GRANT, 'success');
grantTypeMap.set(ApplicationGrantTypeEnum.RENEWAL, 'processing');
grantTypeMap.set(ApplicationGrantTypeEnum.CANCEL, 'warning');

// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.application.defTenantApplicationRecord.tenantName'),
      dataIndex: 'tenantName',
      // width: 180,
    },
    {
      title: t('devOperation.application.defTenantApplicationRecord.applicationName'),
      dataIndex: 'applicationName',
      // width: 180,
    },
    {
      title: t('devOperation.application.defTenantApplicationRecord.operateByName'),
      dataIndex: 'operateByName',
      // width: 180,
    },
    {
      title: t('devOperation.application.defTenantApplicationRecord.grantType'),
      dataIndex: ['echoMap', 'grantType'],
      width: 100,
      customRender: ({ record }) => {
        const color = grantTypeMap.get(record.grantType);
        return <Tag color={color}>{record.echoMap?.grantType}</Tag>;
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

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'tenantId',
      label: t('devOperation.application.defTenantApplicationRel.tenantId'),
      component: 'ApiSelect',
      componentProps: ({ tableAction }) => {
        return {
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
          onChange: (value) => {
            const { reload } = tableAction;
            reload({ searchInfo: { tenantId: value } });
          },
        };
      },
      colProps: { span: 6 },
    },
    {
      field: 'applicationId',
      label: t('devOperation.application.defTenantApplicationRel.applicationId'),
      component: 'ApiSelect',
      componentProps: ({ tableAction }) => {
        return {
          api: queryApplication,
          labelField: 'name',
          valueField: 'id',
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
          },
          onChange: (value) => {
            const { reload } = tableAction;
            reload({ searchInfo: { applicationId: value } });
          },
        };
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
      label: t('devOperation.application.defTenantApplicationRecord.tenantId'),
      field: 'tenantId',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defTenantApplicationRecord.applicationId'),
      field: 'applicationId',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defTenantApplicationRecord.applicationName'),
      field: 'applicationName',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defTenantApplicationRecord.tenantName'),
      field: 'tenantName',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defTenantApplicationRecord.operateByName'),
      field: 'operateByName',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defTenantApplicationRecord.grantType'),
      field: 'grantType',
      component: 'Input',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
