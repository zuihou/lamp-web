import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();
// 列表页字段
export const columns: BasicColumn[] = [
  {
    title: '流程名称',
    dataIndex: 'name',
    // width: 180,
  },
  {
    title: '部署名称',
    dataIndex: 'deploymentName',
    // width: 180,
  },
  {
    title: '流程标识',
    dataIndex: 'key',
    width: 150,
  },
  {
    title: '流程版本',
    dataIndex: 'version',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'suspensionStateName',
    width: 80,
  },
  {
    title: t('lamp.common.createdTime'),
    dataIndex: 'deploymentTime',
    sorter: true,
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '流程名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'key',
    label: '流程标识',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const uploadFormSchema: FormSchema[] = [
  {
    label: '部署名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '流程文件',
    field: 'file',
    component: 'Input',
    slot: 'file',
  },
];

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
