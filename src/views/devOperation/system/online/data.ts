import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.tenant.defUser.username'),
      dataIndex: 'username',
    },
    {
      title: t('devOperation.tenant.defUser.nickName'),
      dataIndex: 'nickName',
    },
    {
      title: '创建时间',
      dataIndex: 'sessionTime',
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'count',
      slots: { default: 'count' },
    },
  ];
};

export const searchFormSchema: FormSchema[] = [
  {
    field: 'nickName',
    label: t('devOperation.tenant.defUser.nickName'),
    component: 'Input',
  },
  {
    field: 'username',
    label: t('devOperation.tenant.defUser.username'),
    component: 'Input',
  },
];

export const tokenListColumns = (): BasicColumn[] => {
  return [
    {
      title: 'Token',
      dataIndex: 'tokenValue',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'sessionTime',
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
    },
  ];
};
