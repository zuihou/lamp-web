import { useI18n } from '/@/hooks/web/useI18n';
import { VxeGridPropTypes } from 'vxe-table';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();

const formatterYesNo = ({ cellValue }) => {
  return cellValue ? t('lamp.common.enable') : t('lamp.common.disable');
};

export const formItems = (): any[] => {
  return [
    {
      field: 'key',
      title: t('devOperation.system.defDictItem.key'),
      span: 6,
      itemRender: { name: '$input', props: { placeholder: t('common.inputText') } },
    },
    {
      field: 'name',
      title: t('devOperation.system.defDictItem.name'),
      span: 6,
      itemRender: { name: '$input', props: { placeholder: t('common.inputText') } },
    },

    {
      span: 24,
      align: 'center',
      collapseNode: false,
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
      field: 'key',
      title: t('devOperation.system.defDictItem.key'),
      editRender: { name: '$input', attrs: { placeholder: t('common.inputText') } },
    },
    {
      field: 'name',
      title: t('devOperation.system.defDictItem.name'),
      editRender: { name: '$input', attrs: { placeholder: t('common.inputText') } },
    },
    {
      field: 'state',
      title: t('devOperation.system.defDict.state'),
      editRender: { name: '$switch', defaultValue: true },
      formatter: formatterYesNo,
    },
    {
      field: 'sortValue',
      title: t('devOperation.developer.defGenTableColumn.sortValue'),
      sortable: true,
      editRender: { name: '$input', attrs: { type: 'number', placeholder: t('common.inputText') } },
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
