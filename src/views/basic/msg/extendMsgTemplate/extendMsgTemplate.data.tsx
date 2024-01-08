import { Ref } from 'vue';
import { Tag } from 'ant-design-vue';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import {
  dictAllComponentProps,
  dictComponentProps,
  stateComponentProps,
  yesNoComponentProps,
} from '/@/utils/lamp/common';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { MsgTemplateTypeEnum } from '/@/enums/biz/base';
import { check } from '/@/api/basic/msg/extendMsgTemplate';
import { query } from '/@/api/devOperation/ops/defInterface';
import { Rule } from '/@/components/Form';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.msg.extendMsgTemplate.type'),
      dataIndex: ['echoMap', 'type'],
      key: 'type',
      width: 100,
    },
    {
      title: t('basic.msg.extendMsgTemplate.state'),
      dataIndex: 'state',
      width: 80,
      customRender: ({ record }) => {
        const text = record.state ? t('lamp.common.enable') : t('lamp.common.disable');
        const color = record.state ? 'success' : 'error';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t('basic.msg.extendMsgTemplate.code'),
      dataIndex: 'code',
    },
    {
      title: t('basic.msg.extendMsgTemplate.name'),
      dataIndex: 'name',
    },
    {
      title: t('basic.msg.extendMsgTemplate.title'),
      dataIndex: 'title',
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
      label: t('basic.msg.extendMsgTemplate.type'),
      field: 'type',
      component: 'ApiSelect',
      componentProps: {
        ...dictAllComponentProps(DictEnum.EchoDictType_Base_MSG_TEMPLATE_TYPE),
      },
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendMsgTemplate.code'),
      field: 'code',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendMsgTemplate.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendMsgTemplate.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(true),
      },
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendMsgTemplate.title'),
      field: 'title',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      field: 'createTimeRange',
      label: t('lamp.common.createdTime'),
      component: 'RangePicker',
      colProps: { span: 8 },
    },
  ];
};

// 编辑页字段
export const editFormSchema = (_type: Ref<ActionEnum>): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('basic.msg.extendMsgTemplate.type'),
      field: 'type',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.EchoDictType_Base_MSG_TEMPLATE_TYPE),
      },
      dynamicDisabled: true,
    },
    {
      label: t('basic.msg.extendMsgTemplate.interfaceId'),
      field: 'interfaceId',
      component: 'ApiSelect',
      componentProps: {
        api: query,
        labelField: 'name',
        valueField: 'id',
      },
      dynamicDisabled: true,
    },
    {
      label: t('basic.msg.extendMsgTemplate.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
    },
    {
      label: t('basic.msg.extendMsgTemplate.code'),
      field: 'code',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('basic.msg.extendMsgTemplate.name'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('basic.msg.extendMsgTemplate.title'),
      field: 'title',
      component: 'Input',
    },
    {
      label: t('basic.msg.extendMsgTemplate.content'),
      field: 'content',
      component: 'Input',
      slot: 'content',
    },
    {
      label: t('basic.msg.extendMsgTemplate.script'),
      field: 'script',
      component: 'Input',
      slot: 'script',
    },
    // {
    //   label: t('basic.msg.extendMsgTemplate.param'),
    //   field: 'param',
    //   component: 'Input',
    // },
    {
      label: t('basic.msg.extendMsgTemplate.remarks'),
      field: 'remarks',
      component: 'InputTextArea',
    },
    {
      label: t('basic.msg.extendMsgTemplate.sign'),
      field: 'sign',
      component: 'Input',
      ifShow: ({ values }) => {
        return values.type === MsgTemplateTypeEnum.SMS;
      },
      dynamicRules: ({ values }) => {
        const rules: Rule[] = [];
        if (values.type === MsgTemplateTypeEnum.SMS) {
          rules.push({ required: true, message: '不能为空', ruleType: RuleType.append });
        }
        return rules;
      },
    },
    {
      label: t('basic.msg.extendMsgTemplate.templateCode'),
      field: 'templateCode',
      component: 'Input',
      ifShow: ({ values }) => {
        return values.type === MsgTemplateTypeEnum.SMS;
      },
      dynamicRules: ({ values }) => {
        const rules: Rule[] = [];
        if (values.type === MsgTemplateTypeEnum.SMS) {
          rules.push({ required: true, message: '不能为空', ruleType: RuleType.append });
        }
        return rules;
      },
    },
    {
      label: t('basic.msg.extendMsgTemplate.target'),
      field: 'target',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.EchoDictType_Base_NOTICE_TARGET),
      },
      ifShow: ({ values }) => {
        return values.type === MsgTemplateTypeEnum.NOTICE;
      },
    },
    {
      label: t('basic.msg.extendMsgTemplate.autoRead'),
      field: 'autoRead',
      component: 'RadioGroup',
      defaultValue: true,
      componentProps: {
        ...yesNoComponentProps(),
      },
      ifShow: ({ values }) => {
        return values.type === MsgTemplateTypeEnum.NOTICE;
      },
    },
    {
      label: t('basic.msg.extendMsgTemplate.remindMode'),
      field: 'remindMode',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.EchoDictType_Base_NOTICE_REMIND_MODE),
      },
      ifShow: ({ values }) => {
        return values.type === MsgTemplateTypeEnum.NOTICE;
      },
    },
    {
      label: t('basic.msg.extendMsgTemplate.url'),
      field: 'url',
      component: 'Input',
      ifShow: ({ values }) => {
        return values.type === MsgTemplateTypeEnum.NOTICE;
      },
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (
  _type: Ref<ActionEnum>,
  getFieldsValue: () => Recordable,
): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'code',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (value && (await check(value, getFieldsValue()?.id))) {
              return Promise.reject(t('basic.msg.extendMsgTemplate.code') + '已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
