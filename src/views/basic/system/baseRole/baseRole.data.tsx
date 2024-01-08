import { Ref, h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { dictComponentProps, stateComponentProps } from '/@/utils/lamp/common';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { tree } from '/@/api/basic/user/baseOrg';
import { DataTypeEnum, categoryMap } from '/@/enums/biz/base';
import { RoleCategoryEnum } from '/@/enums/biz/base';

const { t } = useI18n();

// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.system.baseRole.name'),
      dataIndex: 'name',
      // width: 180,
      ellipsis: true,
      align: 'left',
      customRender: ({ record }) => {
        if (record.echoMap.category) {
          return h(
            'div',
            {
              title: record.name,
              class: 'ant-table-cell-ellipsis',
            },
            [
              h(Tag, { color: categoryMap.get(record.category) }, () => record.echoMap.category),
              record.name,
            ],
          );
        } else {
          return record.name;
        }
      },
    },
    {
      title: t('basic.system.baseRole.state'),
      dataIndex: 'state',
      width: 60,
      customRender: ({ record }) => {
        return h(
          Tag,
          {
            color: record.state ? 'processing' : 'error',
          },
          () => (record.state ? t('lamp.common.enable') : t('lamp.common.disable')),
        );
      },
    },
  ];
};

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'name',
      label: t('basic.system.baseRole.name'),
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      field: 'category',
      label: t('basic.system.baseRole.category'),
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.ROLE_CATEGORY),
      },
      colProps: { span: 12 },
    },
    {
      field: 'state',
      label: t('basic.system.baseRole.state'),
      component: 'Select',
      componentProps: {
        ...stateComponentProps(true),
      },
      defaultValue: null,
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
      field: 'type',
      label: 'type',
      component: 'Input',
      show: false,
    },
    {
      label: t('basic.system.baseRole.code'),
      field: 'code',
      component: 'Input',
      dynamicDisabled: ({ model }) => {
        return DataTypeEnum.SYSTEM === model.type || [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.system.baseRole.name'),
      field: 'name',
      component: 'Input',
      dynamicDisabled: ({ model }) => {
        return DataTypeEnum.SYSTEM === model.type || [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.system.baseRole.category'),
      field: 'category',
      component: 'ApiRadioGroup',
      defaultValue: RoleCategoryEnum.FUNCTION,
      componentProps: {
        ...dictComponentProps(DictEnum.ROLE_CATEGORY),
      },
      helpMessage: [
        '功能角色：不同的角色，拥有不同的菜单、视图、按钮、URI权限',
        '桌面角色：不同的角色，拥有不同的首页桌面（待开发）',
        '数据角色：不同的角色，拥有不同数据权限',
      ],
      dynamicDisabled: ({ model }) => {
        return DataTypeEnum.SYSTEM === model.type || [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.system.baseRole.remarks'),
      field: 'remarks',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
    },
    {
      label: t('basic.system.baseRole.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};

// 角色-员工列表字段
export const roleEmployeeColumns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.tenant.defUser.username'),
      dataIndex: ['defUser', 'username'],
      // width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.mobile'),
      dataIndex: ['defUser', 'mobile'],
      // width: 180,
    },
    {
      title: t('basic.user.baseEmployee.realName'),
      dataIndex: 'realName',
      // width: 180,
    },
  ];
};
// 角色-员工搜索字段
export const roleEmployeeSearchFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'username',
      label: t('devOperation.tenant.defUser.username'),
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      field: 'mobile',
      label: t('devOperation.tenant.defUser.mobile'),
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      field: 'realName',
      label: t('basic.user.baseEmployee.realName'),
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      field: 'orgIdList',
      label: '所在部门',
      component: 'ApiTreeSelect',
      componentProps: {
        api: tree,
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
        multiple: true,
      },
      colProps: { span: 8 },
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
      colProps: { span: 8 },
    },
  ];
};
