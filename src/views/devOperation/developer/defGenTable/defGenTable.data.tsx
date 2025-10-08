import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { query } from '/@/api/devOperation/tenant/datasourceConfig';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.developer.defGenTable.tableName'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('devOperation.developer.defGenTable.tableComment'),
      dataIndex: 'comment',
      // width: 180,
    },
    {
      title: t('devOperation.developer.defGenTable.className'),
      dataIndex: 'entityName',
      // width: 180,
    },
    {
      title: t('devOperation.developer.defGenTable.author'),
      dataIndex: 'author',
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
      field: 'name',
      label: t('devOperation.developer.defGenTable.tableName'),
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'comment',
      label: t('devOperation.developer.defGenTable.tableComment'),
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'author',
      label: t('devOperation.developer.defGenTable.author'),
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
export const importColumns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.developer.defGenTable.tableName'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('devOperation.developer.defGenTable.tableComment'),
      dataIndex: 'comment',
      // width: 180,
    },
  ];
};

export const importSearchFormSchema = (dsChange: Fn, setFieldsValue): FormSchema[] => {
  return [
    {
      field: 'dsId',
      label: t('devOperation.developer.defGenTable.dataSource'),
      component: 'ApiSelect',
      itemProps: {
        extra: t('devOperation.developer.defGenTable.extra'),
      },
      helpMessage: [t('devOperation.developer.defGenTable.helpMessage')],
      componentProps: {
        api: query,
        afterFetch: (options) => {
          if (options && options.length > 0) {
            setFieldsValue({ dsId: options[0]?.id });
            dsChange(options[0]?.id);
          }
        },
        labelField: 'name',
        valueField: 'id',
        showSearch: true,
        allowClear: false,
        onChange: dsChange,
        filterOption: (input: string, option: any) => {
          return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
      },
      defaultValue: '2',
      colProps: { span: 6 },
    },
    // {
    //   field: 'name',
    //   label: t('devOperation.developer.defGenTable.tableName'),
    //   component: 'Input',
    //   colProps: { span: 6 },
    // },
    // {
    //   field: 'comment',
    //   label: t('devOperation.developer.defGenTable.tableComment'),
    //   component: 'Input',
    //   colProps: { span: 6 },
    // },
    // {
    //   field: 'createTimeRange',
    //   label: t('lamp.common.createdTime'),
    //   component: 'RangePicker',
    //   colProps: { span: 6 },
    // },
  ];
};
