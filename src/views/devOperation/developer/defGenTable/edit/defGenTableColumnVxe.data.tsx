import { useI18n } from '/@/hooks/web/useI18n';
import { VxeGridPropTypes } from 'vxe-table';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();

const autoCompleteProps = () => {
  return {
    allowClear: true,
    getPopupContainer: () => document.body,
    filterOption: (input: string, option) => {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
  };
};

// @ts-ignore
const selectProps = () => {
  return {
    allowClear: true,
    showSearch: true,
    getPopupContainer: () => document.body,
    filterOption: (input: string, option) => {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
  };
};

const formatterYesNo = ({ cellValue }) => {
  return cellValue ? t('lamp.common.yes') : t('lamp.common.no');
};

export const formItems = () => {
  return [
    {
      field: 'name',
      title: t('devOperation.developer.defGenTableColumn.name'),
      span: 6,
      itemRender: { name: '$input', props: { placeholder: '请输入' } },
    },
    {
      field: 'comment',
      title: t('devOperation.developer.defGenTableColumn.comment'),
      span: 6,
      itemRender: { name: '$input', props: { placeholder: '请输入' } },
    },

    {
      span: 24,
      align: 'center',
      collapseNode: true,
      itemRender: {
        name: '$buttons',
        children: [
          {
            props: {
              type: 'submit',
              content: t('common.queryText'),
              status: 'primary',
            },
          },
          { props: { type: 'reset', content: t('common.resetText') } },
        ],
      },
    },
  ];
};

export const columns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { type: 'seq', width: 40, fixed: 'left' },
    {
      field: 'name',
      title: t('devOperation.developer.defGenTableColumn.name'),
      fixed: 'left',
    },
    {
      field: 'type',
      title: t('devOperation.developer.defGenTableColumn.type'),
      fixed: 'left',
    },
    {
      field: 'comment',
      title: t('devOperation.developer.defGenTableColumn.comment'),
      titleHelp: { message: 'comment必须填写！' },
      editRender: { name: 'input', attrs: { placeholder: '请输入comment' } },
    },
    {
      field: 'swaggerComment',
      title: t('devOperation.developer.defGenTableColumn.swaggerComment'),
      // titleHelp: { message: 'comment必须填写！' },
      editRender: { name: 'input', attrs: { placeholder: '请输入' } },
    },
    {
      field: 'javaType',
      title: t('devOperation.developer.defGenTableColumn.javaType'),
      editRender: {
        name: 'AAutoComplete',
        props: {
          ...autoCompleteProps(),
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
    },
    {
      field: 'javaField',
      title: t('devOperation.developer.defGenTableColumn.javaField'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'tsType',
      title: t('devOperation.developer.defGenTableColumn.tsType'),
      editRender: {
        name: 'AAutoComplete',
        props: {
          ...autoCompleteProps(),
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
    },
    {
      field: 'size',
      title: t('devOperation.developer.defGenTableColumn.size'),
      width: 100,
      editRender: { name: 'AInputNumber' },
    },
    {
      field: 'isPk',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isPk'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'isRequired',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isRequired'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'isLogicDeleteField',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isLogicDeleteField'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'isVersionField',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isVersionField'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'isIncrement',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isIncrement'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'fill',
      title: t('devOperation.developer.defGenTableColumn.fill'),
      width: 100,
      editRender: {
        name: 'AAutoComplete',
        props: {
          ...autoCompleteProps(),
          options: [
            { value: 'DEFAULT' },
            { value: 'INSERT' },
            { value: 'UPDATE' },
            { value: 'INSERT_UPDATE' },
          ],
        },
      },
    },
    {
      field: 'isEdit',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isEdit'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'isList',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isList'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'isQuery',
      width: 80,
      align: 'center',
      title: t('devOperation.developer.defGenTableColumn.isQuery'),
      editRender: { name: '$switch' },
      formatter: formatterYesNo,
    },
    {
      field: 'width',
      title: t('devOperation.developer.defGenTableColumn.width'),
      width: 100,
      editRender: { name: 'AInputNumber' },
    },
    {
      field: 'queryType',
      title: t('devOperation.developer.defGenTableColumn.queryType'),
      editRender: {
        name: 'AAutoComplete',
        props: {
          ...autoCompleteProps(),
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
    },
    {
      field: 'component',
      title: t('devOperation.developer.defGenTableColumn.component'),
      editRender: {
        name: '$input',
        // name: 'ASelect',
        // props: {
        //   ...selectProps(),
        //   options: [{ value: 'Input' }, { value: 'Select' }],
        // },
      },
    },
    {
      field: 'vxeComponent',
      title: t('devOperation.developer.defGenTableColumn.vxeComponent'),
      editRender: {
        name: '$input',
        // name: 'ASelect',
        props: {
          ...selectProps(),
          options: [{ value: '$input' }, { value: '$select' }],
        },
      },
    },
    {
      field: 'dictType',
      title: t('devOperation.developer.defGenTableColumn.dictType'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'echoStr',
      title: t('devOperation.developer.defGenTableColumn.echoStr'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'enumStr',
      title: t('devOperation.developer.defGenTableColumn.enumStr'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'editDefValue',
      title: t('devOperation.developer.defGenTableColumn.editDefValue'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'editHelpMessage',
      title: t('devOperation.developer.defGenTableColumn.editHelpMessage'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'indexHelpMessage',
      title: t('devOperation.developer.defGenTableColumn.indexHelpMessage'),
      editRender: {
        name: '$input',
      },
    },
    {
      field: 'sortValue',
      title: t('devOperation.developer.defGenTableColumn.sortValue'),
      sortable: true,
    },
    {
      field: 'createdTime',
      title: t('lamp.common.createdTime'),
      sortable: true,
      width: 180,
    },
    {
      title: t('common.column.action'),
      width: 160,
      fixed: 'right',
      slots: { default: 'operate' },
    },
  ];
};

export const customFormSchemaRules = (): Partial<FormSchemaExt>[] => {
  return [];
};
