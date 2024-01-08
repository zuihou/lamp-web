import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { TenantStatusEnum } from '/@/enums/biz/tenant';
import { MultiTenantTypeEnum } from '/@/enums/biz/tenant';
import { useGlobSetting } from '/@/hooks/setting';

const globSetting = useGlobSetting();
const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('basic.msg.extendInterfaceLog.name'),
      dataIndex: 'name',
    },
    {
      title: t('basic.msg.extendInterfaceLog.successCount'),
      dataIndex: 'successCount',
    },
    {
      title: t('basic.msg.extendInterfaceLog.failCount'),
      dataIndex: 'failCount',
    },
    {
      title: t('basic.msg.extendInterfaceLog.lastExecTime'),
      dataIndex: 'lastExecTime',
      sorter: true,
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
      label: t('basic.msg.extendInterfaceLog.name'),
      field: 'name',
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
