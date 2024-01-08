import { Ref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { stateFilters, stateComponentProps, dictComponentProps } from '/@/utils/lamp/common';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { check } from '/@/api/basic/base/baseDictItem';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.base.baseDictItem.key'),
      dataIndex: 'key',
    },
    {
      title: t('basic.base.baseDictItem.name'),
      dataIndex: 'name',
    },
    {
      title: t('basic.base.baseDictItem.classify'),
      dataIndex: ['echoMap', 'classify'],
      width: 120,
    },
    {
      title: t('basic.base.baseDict.state'),
      dataIndex: 'state',
      width: 80,
      filters: [...stateFilters()],
    },
    {
      title: t('basic.base.baseDictItem.sortValue'),
      dataIndex: 'sortValue',
      sorter: true,
      width: 80,
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
      label: t('basic.base.baseDictItem.classify'),
      field: 'classify',
      component: 'ApiSelect',
      colProps: { span: 12 },
      componentProps: {
        ...dictComponentProps(DictEnum.DICT_CLASSIFY),
        mode: 'multiple',
      },
    },
    {
      label: t('basic.base.baseDictItem.key'),
      field: 'key',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('basic.base.baseDictItem.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 12 },
    },
  ];
};

// 编辑页字段
export const editFormSchema = (type: Ref<ActionEnum>): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('basic.base.baseDictItem.parentId'),
      field: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      label: t('basic.base.baseDictItem.parentKey'),
      field: 'parentKey',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('basic.base.baseDictItem.name'),
      field: 'parentName',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('basic.base.baseDictItem.key'),
      field: 'key',
      component: 'Input',
      dynamicDisabled: () => {
        return type.value === ActionEnum.EDIT;
      },
    },
    {
      label: t('basic.base.baseDictItem.name'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('basic.base.baseDictItem.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
    },
    {
      label: t('basic.base.baseDictItem.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: t('basic.base.baseDictItem.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
    },
    {
      label: t('basic.base.baseDictItem.icon'),
      field: 'icon',
      component: 'IconPicker',
    },
    {
      label: t('basic.base.baseDictItem.cssStyle'),
      field: 'cssStyle',
      component: 'Input',
    },
    {
      label: t('basic.base.baseDictItem.cssClass'),
      field: 'cssClass',
      component: 'Input',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (
  type: Ref<ActionEnum>,
  getFieldsValue: () => Recordable,
): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'key',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (type.value === ActionEnum.EDIT) {
              return Promise.resolve();
            }
            if (value && (await check(value, getFieldsValue()?.parentId, getFieldsValue()?.id))) {
              return Promise.reject(t('basic.base.baseDict.key') + '已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
