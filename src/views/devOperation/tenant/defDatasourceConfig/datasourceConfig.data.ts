import { useI18n } from '/@/hooks/web/useI18n';
import { BasicColumn, FormSchema } from '/@/components/Table';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('devOperation.tenant.defDatasourceConfig.name'),
    dataIndex: 'name',
    width: 120,
  },
  {
    title: t('devOperation.tenant.defDatasourceConfig.username'),
    dataIndex: 'username',
    width: 120,
  },
  {
    title: t('devOperation.tenant.defDatasourceConfig.password'),
    dataIndex: 'password',
    width: 120,
    format: (_) => {
      return '***';
    },
  },
  {
    title: t('devOperation.tenant.defDatasourceConfig.driverClassName'),
    dataIndex: 'driverClassName',
    width: 120,
  },
  {
    title: t('devOperation.tenant.defDatasourceConfig.url'),
    dataIndex: 'url',
  },
  {
    title: t('lamp.common.createdTime'),
    dataIndex: 'createdTime',
    sorter: true,
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('devOperation.tenant.defDatasourceConfig.name'),
    component: 'Input',
  },
  {
    field: 'username',
    label: t('devOperation.tenant.defDatasourceConfig.username'),
    component: 'Input',
  },
  {
    field: 'url',
    label: t('devOperation.tenant.defDatasourceConfig.url'),
    component: 'Input',
  },
  {
    field: 'createTimeRange',
    label: t('lamp.common.createdTime'),
    component: 'RangePicker',
  },
];

export const editFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    required: false,
    show: false,
  },
  {
    field: 'name',
    label: t('devOperation.tenant.defDatasourceConfig.name'),
    component: 'Input',
  },
  {
    field: 'username',
    label: t('devOperation.tenant.defDatasourceConfig.username'),
    component: 'Input',
    defaultValue: 'root',
  },
  {
    field: 'password',
    label: t('devOperation.tenant.defDatasourceConfig.password'),
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'off',
    },
  },
  {
    field: 'url',
    label: t('devOperation.tenant.defDatasourceConfig.url'),
    component: 'Input',
    defaultValue:
      'jdbc:mysql://127.0.0.1:3306/lamp_base_1111?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&nullCatalogMeansCurrent=true',
  },
  {
    field: 'driverClassName',
    label: t('devOperation.tenant.defDatasourceConfig.driverClassName'),
    component: 'Select',
    defaultValue: 'com.mysql.cj.jdbc.Driver',
    componentProps: {
      options: [
        {
          label: 'mysql6',
          value: 'com.mysql.cj.jdbc.Driver',
          key: 'mysql6',
        },
        {
          label: 'mysql5',
          value: 'com.mysql.jdbc.Driver',
          key: 'mysql5',
        },
        {
          label: 'oracle',
          value: 'oracle.jdbc.driver.OracleDriver',
          key: 'oracle',
        },
        {
          label: 'sqlserver',
          value: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
          key: 'sqlserver',
        },
      ],
    },
  },
];
