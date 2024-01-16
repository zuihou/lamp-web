import { h, Ref, unref } from 'vue';
import { Switch } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import {
  dictComponentProps,
  stateComponentProps,
  stateFilters,
  yesNoComponentProps,
} from '/@/utils/lamp/common';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import {
  checkEmail,
  checkIdCard,
  checkMobile,
  checkUsername,
  updateState,
} from '/@/api/devOperation/tenant/defUser';

const { t } = useI18n();
const { createMessage } = useMessage();

// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.tenant.defUser.username'),
      dataIndex: 'username',
      width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.nickName'),
      dataIndex: 'nickName',
      width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.email'),
      dataIndex: 'email',
      // width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.mobile'),
      dataIndex: 'mobile',
      // width: 180,
    },
    {
      title: t('devOperation.tenant.defUser.sex'),
      dataIndex: ['echoMap', 'sex'],
      width: 80,
    },
    {
      title: t('devOperation.tenant.defUser.state'),
      dataIndex: 'state',
      width: 80,
      filters: [...stateFilters()],
      filterMultiple: false,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'pendingStatus')) {
          record.pendingStatus = false;
        }
        return h(Switch, {
          checked: record.state,
          checkedChildren: t('lamp.common.enable'),
          unCheckedChildren: t('lamp.common.disable'),
          loading: record.pendingStatus,
          onChange(checked: boolean) {
            record.pendingStatus = true;
            const newState = checked;
            updateState(record.id, newState)
              .then(() => {
                record.state = newState;
                createMessage.success(t(`common.tips.editSuccess`));
              })
              .catch(() => {
                createMessage.success(t(`common.tips.editFail`));
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
        });
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

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('devOperation.tenant.defUser.username'),
      field: 'username',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.nickName'),
      field: 'nickName',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.email'),
      field: 'email',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.tenant.defUser.idCard'),
      field: 'idCard',
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
      field: 'divider-selects1',
      component: 'Divider',
      label: '登录信息',
      helpMessage: ['登录信息 均可可用于登录，初始密码为：123456'],
    },
    {
      label: t('devOperation.tenant.defUser.username'),
      field: 'username',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.email'),
      field: 'email',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.mobile'),
      field: 'mobile',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.tenant.defUser.idCard'),
      field: 'idCard',
      component: 'Input',
      dynamicDisabled: () => {
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
      },
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
        return [ActionEnum.VIEW, ActionEnum.EDIT].includes(type.value);
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

      ifShow: () => {
        return type.value === ActionEnum.VIEW;
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
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            const model = await getFieldsValue();
            if (value !== model.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (type: Ref<ActionEnum>): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'username',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (unref(type) === ActionEnum.EDIT) {
              return Promise.resolve();
            }
            if (value && (await checkUsername(value))) {
              return Promise.reject('账号已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'email',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (unref(type) === ActionEnum.EDIT) {
              return Promise.resolve();
            }
            if (value && (await checkEmail(value))) {
              return Promise.reject('邮箱已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'idCard',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (unref(type) === ActionEnum.EDIT) {
              return Promise.resolve();
            }
            if (value && (await checkIdCard(value))) {
              return Promise.reject('身份证已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'mobile',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
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
