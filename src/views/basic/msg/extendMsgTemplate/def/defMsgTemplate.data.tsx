import { Tag } from 'ant-design-vue';
import { DictEnum } from '/@/enums/commonEnum';
import { dictAllComponentProps, stateComponentProps } from '/@/utils/lamp/common';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.ops.defMsgTemplate.type'),
      dataIndex: ['echoMap', 'type'],
      key: 'type',
      width: 100,
    },
    {
      title: t('devOperation.ops.defMsgTemplate.state'),
      dataIndex: 'state',
      width: 80,
      customRender: ({ record }) => {
        const text = record.state ? t('lamp.common.enable') : t('lamp.common.disable');
        const color = record.state ? 'success' : 'error';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t('devOperation.ops.defMsgTemplate.code'),
      dataIndex: 'code',
    },
    {
      title: t('devOperation.ops.defMsgTemplate.name'),
      dataIndex: 'name',
    },
    {
      title: t('devOperation.ops.defMsgTemplate.title'),
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
      label: t('devOperation.ops.defMsgTemplate.type'),
      field: 'type',
      component: 'ApiSelect',
      componentProps: {
        ...dictAllComponentProps(DictEnum.EchoDictType_Base_MSG_TEMPLATE_TYPE),
      },
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.ops.defMsgTemplate.code'),
      field: 'code',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.ops.defMsgTemplate.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.ops.defMsgTemplate.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(true),
      },
      colProps: { span: 8 },
    },
    {
      label: t('devOperation.ops.defMsgTemplate.title'),
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
