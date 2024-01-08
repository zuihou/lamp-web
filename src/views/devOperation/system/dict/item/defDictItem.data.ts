import { Ref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum } from '/@/enums/commonEnum';
import { stateFilters, stateComponentProps } from '/@/utils/lamp/common';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { check } from '/@/api/devOperation/system/defDictItem';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.system.defDictItem.key'),
      dataIndex: 'key',
    },
    {
      title: t('devOperation.system.defDictItem.name'),
      dataIndex: 'name',
    },
    {
      title: t('devOperation.system.defDict.state'),
      dataIndex: 'state',
      width: 80,
      filters: [...stateFilters()],
    },
    {
      title: t('devOperation.system.defDictItem.sortValue'),
      dataIndex: 'sortValue',
      sorter: true,
      width: 80,
    },
    // {
    //   title: t('lamp.common.createdTime'),
    //   dataIndex: 'createdTime',
    //   sorter: true,
    //   width: 180,
    // },
  ];
};

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('devOperation.system.defDictItem.key'),
      field: 'key',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('devOperation.system.defDictItem.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 12 },
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
      label: t('devOperation.system.defDictItem.parentId'),
      field: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.system.defDictItem.parentKey'),
      field: 'parentKey',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('devOperation.system.defDictItem.label'),
      field: 'parentName',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('devOperation.system.defDictItem.key'),
      field: 'key',
      component: 'Input',
      // dynamicDisabled: () => {
      //   return type.value === ActionEnum.EDIT;
      // },
    },
    {
      label: t('devOperation.system.defDictItem.name'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defDictItem.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
    },
    {
      label: t('devOperation.system.defDictItem.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: t('devOperation.system.defDictItem.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
    },
    {
      label: t('devOperation.system.defDictItem.icon'),
      field: 'icon',
      component: 'IconPicker',
    },
    {
      label: t('devOperation.system.defDictItem.cssStyle'),
      field: 'cssStyle',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defDictItem.cssClass'),
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
            if (value && (await check(value, getFieldsValue()?.parentId))) {
              return Promise.reject(t('devOperation.system.defDict.key') + '已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
