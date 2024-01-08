import { h, Ref, unref } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { tree } from '/@/api/basic/user/baseOrg';
import { query } from '/@/api/basic/user/basePosition';
import { dictComponentProps, stateComponentProps, yesNoComponentProps } from '/@/utils/lamp/common';
import { checkMobile } from '/@/api/devOperation/tenant/defUser';
import { categoryMap } from '/@/enums/biz/base';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.user.baseEmployee.realName'),
      dataIndex: 'realName',
      // width: 180,
    },
    {
      title: t('basic.user.baseEmployee.positionId'),
      dataIndex: ['echoMap', 'positionId'],
      // width: 180,
    },
    {
      title: '所属部门',
      dataIndex: 'orgNameList',
    },
    {
      title: t('basic.user.baseEmployee.positionStatus'),
      dataIndex: ['echoMap', 'positionStatus'],
      width: 100,
    },
    {
      title: t('basic.user.baseEmployee.state'),
      dataIndex: 'state',
      width: 50,
      format: (text) => {
        return text ? t('lamp.common.enable') : t('lamp.common.disable');
      },
    },
    {
      title: t('lamp.common.createdTime'),
      dataIndex: 'createdTime',
      sorter: true,
      width: 180,
    },
  ];
};

// 员工表格搜索栏
export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('basic.user.baseEmployee.realName'),
      field: 'realName',
      component: 'Input',
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
    },
    {
      label: t('devOperation.tenant.defUser.username'),
      field: 'username',
      component: 'Input',
    },
    {
      label: t('devOperation.tenant.defUser.email'),
      field: 'email',
      component: 'Input',
    },
    {
      label: t('devOperation.tenant.defUser.idCard'),
      field: 'idCard',
      component: 'Input',
    },

    {
      field: 'createTimeRange',
      label: t('lamp.common.createdTime'),
      component: 'RangePicker',
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
      field: 'divider-selects1',
      component: 'Divider',
      label: '基础信息',
    },
    {
      label: t('basic.user.baseEmployee.username'),
      field: 'username',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      show: () => {
        return [ActionEnum.ADD, ActionEnum.COPY].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('basic.user.baseEmployee.realName'),
      field: 'realName',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('basic.user.baseEmployee.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'divider-selects2',
      component: 'Divider',
      label: '用户信息',
      show: () => {
        return [ActionEnum.ADD, ActionEnum.COPY].includes(type.value);
      },
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
      colProps: {
        span: 12,
      },
      show: () => {
        return [ActionEnum.ADD, ActionEnum.COPY].includes(type.value);
      },
    },
    {
      label: t('devOperation.tenant.defUser.sex'),
      field: 'sex',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.GLOBAL_SEX),
      },
      defaultValue: 'M',
      colProps: {
        span: 12,
      },
      show: () => {
        return [ActionEnum.ADD, ActionEnum.COPY].includes(type.value);
      },
    },
    {
      label: t('devOperation.tenant.defUser.nation'),
      field: 'nation',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.NATION),
      },
      show: () => {
        return [ActionEnum.ADD, ActionEnum.COPY].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.education'),
      field: 'education',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.EDUCATION),
      },
      show: () => {
        return [ActionEnum.ADD, ActionEnum.COPY].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'divider-selects3',
      component: 'Divider',
      label: '职位信息',
    },
    {
      label: '所属部门',
      field: 'orgIdList',
      component: 'ApiTreeSelect',
      componentProps: {
        api: tree,
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
        multiple: true,
        filterTreeNode: (input: string, treeNode: any) => {
          return treeNode.name.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        },
      },
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('basic.user.baseEmployee.positionId'),
      field: 'positionId',
      component: 'ApiSelect',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      componentProps: {
        api: query,
        labelField: 'name',
        valueField: 'id',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('basic.user.baseEmployee.positionStatus'),
      field: 'positionStatus',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.POSITION_STATUS),
      },
      dynamicDisabled: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
  ];
};

// 用户信息字段
export const userEditFormSchema = (type: Ref<ActionEnum>): FormSchema[] => {
  return [
    {
      label: t('devOperation.tenant.defUser.username'),
      field: 'username',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.email'),
      field: 'email',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.idCard'),
      field: 'idCard',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.wxOpenId'),
      field: 'wxOpenId',
      component: 'Input',
      dynamicDisabled: true,
      ifShow: () => {
        return [ActionEnum.VIEW].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.ddOpenId'),
      field: 'ddOpenId',
      component: 'Input',
      dynamicDisabled: true,
      ifShow: () => {
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'divider-selects2',
      component: 'Divider',
      label: '基础信息',
    },
    {
      label: t('devOperation.tenant.defUser.nickName'),
      field: 'nickName',
      component: 'Input',
    },
    {
      label: t('devOperation.tenant.defUser.sex'),
      field: 'sex',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.GLOBAL_SEX),
      },
      defaultValue: 'M',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.nation'),
      field: 'nation',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.NATION),
      },

      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.education'),
      field: 'education',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.EDUCATION),
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.workDescribe'),
      field: 'workDescribe',
      component: 'InputTextArea',
    },
    {
      field: 'divider-selects3',
      component: 'Divider',
      label: '额外信息',
      ifShow: () => {
        return type.value === ActionEnum.VIEW;
      },
    },
    {
      label: t('devOperation.tenant.defUser.passwordErrorLastTime'),
      field: 'passwordErrorLastTime',
      component: 'Input',
      colProps: {
        span: 12,
      },
      dynamicDisabled: true,
      ifShow: () => {
        return type.value === ActionEnum.VIEW;
      },
    },
    {
      label: t('devOperation.tenant.defUser.passwordErrorNum'),
      field: 'passwordErrorNum',
      component: 'Input',
      colProps: {
        span: 12,
      },
      dynamicDisabled: true,
      ifShow: () => {
        return type.value === ActionEnum.VIEW;
      },
    },
    {
      label: t('devOperation.tenant.defUser.passwordExpireTime'),
      field: 'passwordExpireTime',
      component: 'Input',
      colProps: {
        span: 12,
      },
      dynamicDisabled: true,
      ifShow: () => {
        return type.value === ActionEnum.VIEW;
      },
    },
    {
      label: t('devOperation.tenant.defUser.lastLoginTime'),
      field: 'lastLoginTime',
      component: 'Input',
      colProps: {
        span: 12,
      },
      dynamicDisabled: true,
      ifShow: () => {
        return type.value === ActionEnum.VIEW;
      },
    },
    {
      label: t('devOperation.tenant.defUser.locked'),
      field: 'locked',
      colProps: {
        span: 12,
      },
      component: 'RadioButtonGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      dynamicDisabled: true,
      ifShow: () => {
        return type.value === ActionEnum.VIEW;
      },
    },
  ];
};

// 员工编辑页 前端自定义表单验证规则
export const customFormSchemaRules = (type: Ref<ActionEnum>): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'mobile',
      type: RuleType.append,
      rules: [
        {
          trigger: 'blur',
          async validator(_, value) {
            if (unref(type) === ActionEnum.EDIT) {
              return Promise.resolve();
            }
            if (value && (await checkMobile(value))) {
              return Promise.reject('手机号已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};

// 员工-角色列表字段
export const employeeRoleColumns = (): BasicColumn[] => {
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
// 角色-员工搜索字段
export const employeeRoleSearchFormSchema = (): FormSchema[] => {
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

// 邀请用户表单
export const invitationUserFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.username'),
      field: 'username',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.email'),
      field: 'email',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.idCard'),
      field: 'idCard',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
  ];
};

// 重置密码
export const restPasswordFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: '使用系统内置密码',
      field: 'isUseSystemPassword',
      component: 'RadioButtonGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
    },
    {
      label: t('devOperation.tenant.defUser.password'),
      field: 'password',
      component: 'InputPassword',
      componentProps: {
        autocomplete: 'off',
        placeholder: '当前密码',
      },
      ifShow: ({ values }) => {
        return !values.isUseSystemPassword;
      },
    },
    {
      label: '确认密码',
      field: 'confirmPassword',
      component: 'InputPassword',
      componentProps: {
        autocomplete: 'off',
        placeholder: '当前密码',
      },
      ifShow: ({ values }) => {
        return !values.isUseSystemPassword;
      },
    },
  ];
};

export const restPasswordFormSchemaRules = (
  getFieldsValue: () => Recordable,
): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'confirmPassword',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            if (value !== getFieldsValue().password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
