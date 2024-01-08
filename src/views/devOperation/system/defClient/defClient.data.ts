import { Ref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { stateFilters, dictComponentProps } from '/@/utils/lamp/common';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.system.defClient.clientId'),
      dataIndex: 'clientId',
      // width: 180,
    },
    {
      title: t('devOperation.system.defClient.name'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('devOperation.system.defClient.type'),
      dataIndex: ['echoMap', 'type'],
      // width: 180,
    },
    {
      title: t('devOperation.system.defClient.state'),
      dataIndex: 'state',
      width: 100,
      filters: [...stateFilters()],
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
      label: t('devOperation.system.defClient.clientId'),
      field: 'clientId',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.system.defClient.name'),
      field: 'name',
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
      label: t('devOperation.system.defClient.clientId'),
      field: 'clientId',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      ifShow: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defClient.clientSecret'),
      field: 'clientSecret',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
      },
      ifShow: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defClient.name'),
      field: 'name',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defClient.type'),
      field: 'type',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.CLIENT_TYPE),
      },
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('devOperation.system.defClient.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      componentProps: {
        options: [
          { label: t('lamp.common.enable'), value: true },
          { label: t('lamp.common.disable'), value: false },
        ],
      },
      defaultValue: true,
    },
    {
      label: t('devOperation.system.defClient.remarks'),
      field: 'remarks',
      component: 'InputTextArea',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
