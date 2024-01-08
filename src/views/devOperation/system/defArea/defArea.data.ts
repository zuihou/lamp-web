import { Ref } from 'vue';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { dictComponentProps, stateComponentProps } from '/@/utils/lamp/common';

const { t } = useI18n();

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
      field: 'parentId',
      defaultValue: 0,
      label: t('devOperation.system.defArea.parentId'),
      component: 'Input',
      show: false,
    },
    {
      field: 'parentName',
      defaultValue: '根节点',
      label: t('devOperation.system.defArea.parentId'),
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('devOperation.system.defArea.code'),
      field: 'code',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defArea.name'),
      field: 'name',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defArea.fullName'),
      field: 'fullName',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defArea.level'),
      field: 'level',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      component: 'ApiRadioGroup',
      defaultValue: '10',
      componentProps: {
        ...dictComponentProps(DictEnum.AREA_LEVEL),
        isBtn: true,
      },
    },
    {
      label: t('devOperation.system.defArea.source'),
      field: 'source',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      component: 'ApiRadioGroup',
      defaultValue: '10',
      componentProps: {
        ...dictComponentProps(DictEnum.AREA_SOURCE),
        isBtn: true,
      },
    },
    {
      label: t('devOperation.system.defArea.longitude'),
      field: 'longitude',
      component: 'Input',
      colProps: {
        span: 12,
      },
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defArea.latitude'),
      field: 'latitude',
      component: 'Input',
      colProps: {
        span: 12,
      },
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defArea.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      componentProps: {
        ...stateComponentProps(),
      },
      colProps: {
        span: 12,
      },
      defaultValue: true,
    },
    {
      label: t('devOperation.system.defArea.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
