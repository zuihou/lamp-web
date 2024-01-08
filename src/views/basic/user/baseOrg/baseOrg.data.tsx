import { h, Ref } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { categoryMap } from '/@/enums/biz/base';
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
      label: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      field: 'parentName',
      defaultValue: '根节点',
      label: t('basic.user.baseOrg.parentId'),
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('basic.user.baseOrg.name'),
      field: 'name',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.user.baseOrg.type'),
      field: 'type',
      component: 'ApiRadioGroup',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      defaultValue: '20',
      componentProps: {
        ...dictComponentProps(DictEnum.ORG_TYPE),
        isBtn: true,
      },
    },
    {
      label: t('basic.user.baseOrg.shortName'),
      field: 'shortName',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.user.baseOrg.state'),
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
    {
      label: t('basic.user.baseOrg.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.user.baseOrg.remarks'),
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

// 机构-角色列表字段
export const orgRoleColumns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.system.baseRole.code'),
      dataIndex: 'code',
    },
    {
      title: t('basic.system.baseRole.name'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('basic.system.baseRole.category'),
      dataIndex: ['echoMap', 'category'],
      width: 180,
      ellipsis: true,
      customRender: ({ record }) => {
        if (record.echoMap.category) {
          return h(Tag, { color: categoryMap.get(record.category) }, () => record.echoMap.category);
        } else {
          return '-';
        }
      },
    },
    {
      title: t('basic.system.baseRole.state'),
      dataIndex: 'state',
      width: 100,
      customRender: ({ record }) => {
        const text = record.state ? t('lamp.common.enable') : t('lamp.common.disable');
        const color = record.state ? 'success' : 'error';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];
};
// 机构-角色搜索字段
export const orgRoleSearchFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'code',
      label: t('basic.system.baseRole.code'),
      component: 'Input',
    },
    {
      field: 'name',
      label: t('basic.system.baseRole.name'),
      component: 'Input',
    },
    {
      field: 'scope',
      label: '范围',
      component: 'RadioButtonGroup',
      componentProps: {
        options: [
          { label: '全部', value: '-1' },
          { label: '已绑定', value: '1' },
          { label: '未绑定', value: '2' },
        ],
      },
      defaultValue: '-1',
    },
  ];
};
