import { Ref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum } from '/@/enums/commonEnum';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { tree } from '/@/api/basic/user/baseOrg';
import { stateComponentProps } from '/@/utils/lamp/common';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.user.basePosition.name'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('basic.user.basePosition.orgId'),
      dataIndex: ['echoMap', 'orgId'],
      // width: 180,
    },
    {
      title: t('basic.user.basePosition.state'),
      dataIndex: 'state',
      width: 80,
      format: (text) => {
        return text ? t('lamp.common.enable') : t('lamp.common.disable');
      },
    },
    {
      title: t('basic.user.basePosition.remarks'),
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
      field: 'name',
      label: t('basic.user.basePosition.name'),
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
      label: t('basic.user.basePosition.name'),
      field: 'name',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.user.basePosition.orgId'),
      field: 'orgId',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      component: 'ApiTreeSelect',
      componentProps: {
        api: tree,
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
      },
    },
    {
      label: t('basic.user.basePosition.state'),
      field: 'state',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
    },
    {
      label: t('basic.user.basePosition.remarks'),
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
