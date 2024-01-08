import { Ref, unref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { stateComponentProps, stateFilters } from '/@/utils/lamp/common';
import { ActionEnum } from '/@/enums/commonEnum';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { check } from '/@/api/devOperation/system/defParameter';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.system.defParameter.name'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('devOperation.system.defParameter.key'),
      dataIndex: 'key',
      // width: 180,
    },
    {
      title: t('devOperation.system.defParameter.value'),
      dataIndex: 'value',
      // width: 180,
    },
    {
      title: t('devOperation.system.defParameter.state'),
      dataIndex: 'state',
      width: 100,
      filters: [...stateFilters()],
    },
    {
      title: t('devOperation.system.defParameter.remarks'),
      dataIndex: 'remarks',
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
      label: t('devOperation.system.defParameter.name'),
      field: 'name',
      colProps: { span: 6 },
      component: 'Input',
    },
    {
      label: t('devOperation.system.defParameter.key'),
      field: 'key',
      colProps: { span: 6 },
      component: 'Input',
    },
    {
      label: t('devOperation.system.defParameter.value'),
      field: 'value',
      colProps: { span: 6 },
      component: 'Input',
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
export const editFormSchema = (type: Ref<ActionEnum>): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.system.defParameter.name'),
      field: 'name',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defParameter.key'),
      field: 'key',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defParameter.value'),
      field: 'value',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defParameter.remarks'),
      field: 'remarks',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defParameter.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      defaultValue: true,
      componentProps: {
        ...stateComponentProps(),
      },
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (type: Ref<ActionEnum>): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'key',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if ([ActionEnum.EDIT, ActionEnum.VIEW].includes(unref(type))) {
              return Promise.resolve();
            }
            if (await check(value)) {
              return Promise.reject(t('devOperation.system.defParameter.key') + '已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
