import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();
// 列表页字段
export const columns: BasicColumn[] = [
  {
    title: '模型名称',
    dataIndex: 'name',
    // width: 180,
  },
  {
    title: '模型标识',
    dataIndex: 'key',
    // width: 180,
  },
  {
    title: '描述',
    dataIndex: 'description',
    // width: 150,
    format: (_, record: Recordable) => {
      return record.metaInfo ? JSON.parse(record.metaInfo).description : '';
    },
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    format: (_, record: Recordable) => {
      return record?.deploymentId ? '已发布' : '未发布';
    },
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastUpdateTime',
    sorter: true,
    width: 180,
  },
  {
    title: t('lamp.common.createdTime'),
    dataIndex: 'createTime',
    sorter: true,
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];

// 编辑页字段
export const editFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    label: '模型名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '模型KEY',
    field: 'key',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
];

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'name',
      type: RuleType.append,
      rules: [{ trigger: 'blur', required: true }],
    },
    {
      field: 'key',
      type: RuleType.append,
      rules: [{ trigger: 'blur', required: true }],
    },
  ];
};
