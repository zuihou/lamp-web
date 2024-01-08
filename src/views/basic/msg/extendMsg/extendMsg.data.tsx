import { h, Ref } from 'vue';
import { dateUtil } from '/@/utils/dateUtil';
import { dictComponentProps, enumAllComponentProps } from '/@/utils/lamp/common';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { Tinymce } from '/@/components/Tinymce/index';
import {
  ActionEnum,
  DictEnum,
  EnumEnum,
  FileBizTypeEnum,
  FileBucketEnum,
} from '/@/enums/commonEnum';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { MsgTemplateTypeEnum, SourceTypeEnum } from '/@/enums/biz/base';
import { query as queryUser } from '/@/api/basic/user/baseEmployee';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.msg.extendMsg.remindMode'),
      dataIndex: ['echoMap', 'remindMode'],
      key: 'status',
      width: 120,
    },
    {
      title: t('basic.msg.extendMsg.status'),
      dataIndex: ['echoMap', 'status'],
      key: 'status',
      width: 120,
    },
    {
      title: t('basic.msg.extendMsg.title'),
      dataIndex: 'title',
    },
    {
      title: t('basic.msg.extendMsg.author'),
      dataIndex: 'author',
    },
    {
      title: t('basic.msg.extendMsg.sendTime'),
      dataIndex: 'sendTime',
      width: 180,
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
      label: t('basic.msg.extendMsg.title'),
      field: 'title',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendMsg.author'),
      field: 'author',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      field: 'createTimeRange',
      label: t('lamp.common.createdTime'),
      component: 'RangePicker',
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendMsg.status'),
      field: 'status',
      component: 'ApiRadioGroup',
      componentProps: {
        isBtn: true,
        ...enumAllComponentProps(EnumEnum.TaskStatus),
      },
      colProps: { span: 16 },
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
      label: t('basic.msg.extendMsg.channel'),
      field: 'channel',
      component: 'Input',
      show: false,
      defaultValue: SourceTypeEnum.APP,
    },
    {
      label: t('basic.msg.extendMsg.type'),
      field: 'type',
      component: 'Input',
      show: false,
      defaultValue: MsgTemplateTypeEnum.NOTICE,
    },
    {
      label: t('basic.msg.extendMsg.title'),
      field: 'title',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('basic.msg.extendMsg.author'),
      field: 'author',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('basic.msg.extendMsg.remindMode'),
      field: 'remindMode',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.EchoDictType_Base_NOTICE_REMIND_MODE),
      },
      colProps: { span: 12 },
    },
    {
      label: '接收人',
      field: 'recipientList',
      component: 'ApiSelect',
      componentProps: {
        api: queryUser,
        labelField: 'realName',
        valueField: 'id',
        showSearch: true,
        mode: 'multiple',
      },
      colProps: { span: 12 },
    },
    {
      label: t('basic.msg.extendMsg.content'),
      field: 'content',
      component: 'Input',
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          options: {
            readonly: [ActionEnum.VIEW].includes(type.value),
          },
          onChange: (value: string) => {
            model[field] = value;
          },
          uploadParams: {
            bizType: FileBizTypeEnum.EXTEND_MSG_CONTENT,
            bucket: FileBucketEnum.public,
          },
        });
      },
    },
    {
      label: t('basic.msg.extendMsg.sendTime'),
      field: 'sendTime',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'title',
      type: RuleType.append,
      rules: [{ trigger: 'blur', required: true }],
    },
    {
      field: 'content',
      type: RuleType.append,
      rules: [{ trigger: 'blur', required: true }],
    },
    {
      field: 'remindMode',
      type: RuleType.append,
      rules: [{ trigger: 'blur', required: true }],
    },
  ];
};
