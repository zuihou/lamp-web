import { useI18n } from '/@/hooks/web/useI18n';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { enumComponentProps } from '/@/utils/lamp/common';
import { EnumEnum } from '/@/enums/commonEnum';

const { t } = useI18n();

export const columnColumns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.developer.defGenTableColumn.name'),
      dataIndex: 'name',
      fixed: 'left',
      // width: 180,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.type'),
      dataIndex: 'type',
      fixed: 'left',
    },
    {
      title: t('devOperation.developer.defGenTableColumn.comment'),
      dataIndex: 'comment',
      // width: 180,
      editRow: true,
      editRule: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.swaggerComment'),
      dataIndex: 'swaggerComment',
      // width: 180,
      editRow: true,
      editRule: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.javaType'),
      dataIndex: 'javaType',
      // width: 180,
      editRow: true,
      editRule: true,
      editComponent: 'AutoComplete',
      editComponentProps: {
        allowClear: true,
        getPopupContainer: () => document.body,
        filterOption: (input: string, option) => {
          return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
        options: [
          { value: 'String' },
          { value: 'Long' },
          { value: 'Integer' },
          { value: 'Boolean' },
          { value: 'Double' },
          { value: 'BigDecimal' },
          { value: 'LocalDateTime' },
          { value: 'LocalDate' },
          { value: 'LocalTime' },
        ],
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.javaField'),
      dataIndex: 'javaField',
      editRule: true,
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.tsType'),
      dataIndex: 'tsType',
      // width: 180,
      editRow: true,
      editRule: true,
      editComponent: 'AutoComplete',
      editComponentProps: {
        allowClear: true,
        getPopupContainer: () => document.body,
        filterOption: (input: string, option) => {
          return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
        options: [
          { value: 'string' },
          { value: 'number' },
          { value: 'boolean' },
          { value: 'string[]' },
          { value: 'number[]' },
          { value: 'any' },
          { value: 'tuple' },
          { value: 'enum' },
        ],
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.size'),
      dataIndex: 'size',
      width: 100,
      editRow: true,
      editComponent: 'InputNumber',
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isPk'),
      dataIndex: 'isPk',
      width: 60,
      editRow: true,
      editComponent: 'Checkbox',
      key: 'isPk',
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isRequired'),
      dataIndex: 'isRequired',
      width: 60,
      editRow: true,
      editComponent: 'Checkbox',
      key: 'isRequired',
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
      editComponentProps: {
        onChange: (a, b) => {
          console.log(a);
          console.log(b);
        },
      },
    },

    {
      title: t('devOperation.developer.defGenTableColumn.isLogicDeleteField'),
      dataIndex: 'isLogicDeleteField',
      width: 80,
      editRow: true,
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
      editComponent: 'Checkbox',
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isVersionField'),
      dataIndex: 'isVersionField',
      width: 60,
      editRow: true,
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
      editComponent: 'Checkbox',
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isIncrement'),
      dataIndex: 'isIncrement',
      width: 60,
      editRow: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.fill'),
      dataIndex: 'fill',
      // width: 180,
      editRow: true,
      editComponent: 'AutoComplete',
      editComponentProps: {
        allowClear: true,
        getPopupContainer: () => document.body,
        filterOption: (input: string, option) => {
          return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
        options: [
          { value: 'DEFAULT' },
          { value: 'INSERT' },
          { value: 'UPDATE' },
          { value: 'INSERT_UPDATE' },
        ],
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isEdit'),
      dataIndex: 'isEdit',
      width: 60,
      editRow: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isList'),
      dataIndex: 'isList',
      width: 60,
      editRow: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.isQuery'),
      dataIndex: 'isQuery',
      width: 60,
      editRow: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? t('lamp.common.yes') : t('lamp.common.no');
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.width'),
      dataIndex: 'width',
      width: 100,
      editRow: true,
      editComponent: 'InputNumber',
    },
    {
      title: t('devOperation.developer.defGenTableColumn.queryType'),
      dataIndex: 'queryType',
      // width: 180,
      editRow: true,
      editComponent: 'AutoComplete',
      editComponentProps: {
        allowClear: true,
        getPopupContainer: () => document.body,
        filterOption: (input: string, option) => {
          return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
        options: [
          { value: 'EQUAL' },
          { value: 'NOT_EQUAL' },
          { value: 'LIKE' },
          { value: 'ORACLE_LIKE' },
          { value: 'LIKE_LEFT' },
          { value: 'LIKE_RIGHT' },
        ],
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.component'),
      dataIndex: 'component',
      // width: 180,
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        ...enumComponentProps(EnumEnum.ComponentEnum),
      },
    },
    {
      title: t('devOperation.developer.defGenTableColumn.dictType'),
      dataIndex: 'dictType',
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.echoStr'),
      dataIndex: 'echoStr',
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.enumStr'),
      dataIndex: 'enumStr',
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.editDefValue'),
      dataIndex: 'editDefValue',
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.editHelpMessage'),
      dataIndex: 'editHelpMessage',
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.indexHelpMessage'),
      dataIndex: 'indexHelpMessage',
      // width: 180,
      editRow: true,
    },
    {
      title: t('devOperation.developer.defGenTableColumn.sortValue'),
      dataIndex: 'sortValue',
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

export const searchColumnFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'name',
      label: t('devOperation.developer.defGenTableColumn.name'),
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'comment',
      label: t('devOperation.developer.defGenTableColumn.comment'),
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
