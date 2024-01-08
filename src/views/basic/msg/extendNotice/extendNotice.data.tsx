import { h, Ref } from 'vue';
import { ActionEnum, DictEnum, FileBizTypeEnum, FileBucketEnum } from '/@/enums/commonEnum';
import {
  dictAllComponentProps,
  dictComponentProps,
  yesNoComponentProps,
} from '/@/utils/lamp/common';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { MsgTemplateTypeEnum, SourceTypeEnum } from '/@/enums/biz/base';
import { Tinymce } from '/@/components/Tinymce';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.msg.extendNotice.remindMode'),
      dataIndex: ['echoMap', 'remindMode'],
      key: 'remindMode',
      width: 120,
    },
    {
      title: t('basic.msg.extendNotice.isRead'),
      dataIndex: 'isRead',
      width: 100,
      format: (text) => {
        return text ? t('lamp.common.yes') : t('lamp.common.no');
      },
    },
    {
      title: t('basic.msg.extendNotice.title'),
      dataIndex: 'title',
    },
    {
      title: t('basic.msg.extendNotice.author'),
      dataIndex: 'author',
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
      label: t('basic.msg.extendNotice.title'),
      field: 'title',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendNotice.author'),
      field: 'author',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendNotice.remindMode'),
      field: 'remindMode',
      component: 'ApiSelect',
      componentProps: {
        ...dictAllComponentProps(DictEnum.EchoDictType_Base_NOTICE_REMIND_MODE),
      },
      colProps: { span: 8 },
    },
    {
      label: t('basic.msg.extendNotice.isRead'),
      field: 'isRead',
      component: 'RadioButtonGroup',
      componentProps: {
        ...yesNoComponentProps(true),
      },
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
      label: t('basic.msg.extendNotice.channel'),
      field: 'channel',
      component: 'Input',
      show: false,
      defaultValue: SourceTypeEnum.APP,
    },
    {
      label: t('basic.msg.extendNotice.type'),
      field: 'type',
      component: 'Input',
      show: false,
      defaultValue: MsgTemplateTypeEnum.NOTICE,
    },
    {
      label: t('basic.msg.extendNotice.title'),
      field: 'title',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('basic.msg.extendNotice.author'),
      field: 'author',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('basic.msg.extendNotice.remindMode'),
      field: 'remindMode',
      component: 'ApiSelect',
      componentProps: {
        ...dictComponentProps(DictEnum.EchoDictType_Base_NOTICE_REMIND_MODE),
      },
      colProps: { span: 12 },
    },
    {
      label: t('basic.msg.extendNotice.content'),
      field: 'content',
      component: 'Input',
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          options: {
            readonly: true,
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
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
