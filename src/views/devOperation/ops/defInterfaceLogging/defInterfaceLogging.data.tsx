import { h, Ref } from 'vue';
import { Tag } from 'ant-design-vue';
import { dateUtil } from '/@/utils/dateUtil';
import { dictAllComponentProps, dictComponentProps } from '/@/utils/lamp/common';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, DictEnum } from '/@/enums/commonEnum';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { JsonPreview } from '/@/components/CodeEditor';
import { MsgInterfaceLoggingStatusEnum } from '/@/enums/biz/base';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.msg.extendInterfaceLogging.execTime'),
      dataIndex: 'execTime',
      width: 180,
    },
    {
      title: t('basic.msg.extendInterfaceLogging.status'),
      dataIndex: ['echoMap', 'status'],
      key: 'status',
      width: 100,
      customRender: ({ record }) => {
        const text = record.echoMap?.status;
        const color = record.status === MsgInterfaceLoggingStatusEnum.SUCCESS ? 'success' : 'error';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t('basic.msg.extendInterfaceLogging.params'),
      dataIndex: 'params',
    },
    {
      title: t('basic.msg.extendInterfaceLogging.result'),
      dataIndex: 'result',
    },
    {
      title: t('basic.msg.extendInterfaceLogging.errorMsg'),
      dataIndex: 'errorMsg',
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
      label: t('basic.msg.extendInterfaceLogging.execTime'),
      field: 'execTime',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
      colProps: { span: 6 },
    },
    {
      label: t('basic.msg.extendInterfaceLogging.status'),
      field: 'status',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictAllComponentProps(DictEnum.EchoDictType_Base_MSG_INTERFACE_LOGGING_STATUS),
      },
      colProps: { span: 6 },
    },
    {
      label: t('basic.msg.extendInterfaceLogging.bizId'),
      field: 'bizId',
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
export const editFormSchema = (_type: Ref<ActionEnum>): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('basic.msg.extendInterfaceLogging.execTime'),
      field: 'execTime',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
    {
      label: t('basic.msg.extendInterfaceLogging.status'),
      field: 'status',
      component: 'ApiRadioGroup',
      defaultValue: '01',
      componentProps: {
        ...dictComponentProps(DictEnum.EchoDictType_Base_MSG_INTERFACE_LOGGING_STATUS),
      },
    },
    {
      label: t('basic.msg.extendInterfaceLogging.params'),
      field: 'params',
      component: 'Input',
      render: ({ model, field }) => {
        try {
          const obj = JSON.parse(model[field]);
          if (obj) {
            return h(JsonPreview, { data: obj });
          } else {
            return h('div', model[field]);
          }
        } catch (e) {
          return h('div', model[field]);
        }
      },
    },
    {
      label: t('basic.msg.extendInterfaceLogging.result'),
      field: 'result',
      component: 'Input',
      render: ({ model, field }) => {
        try {
          const obj = JSON.parse(model[field]);
          if (obj) {
            return h(JsonPreview, { data: obj });
          } else {
            return h('div', model[field]);
          }
        } catch (e) {
          return h('div', model[field]);
        }
      },
    },
    {
      label: t('basic.msg.extendInterfaceLogging.errorMsg'),
      field: 'errorMsg',
      component: 'Input',
      slot: 'errorMsg',
    },
    {
      label: t('basic.msg.extendInterfaceLogging.bizId'),
      field: 'bizId',
      component: 'Input',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
