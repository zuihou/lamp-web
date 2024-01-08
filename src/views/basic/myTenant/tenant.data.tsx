import { Ref } from 'vue';
import { dateUtil } from '/@/utils/dateUtil';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum, FileBizTypeEnum } from '/@/enums/commonEnum';
import { TenantStatusEnum } from '/@/enums/biz/tenant';
import { Tag, Badge } from 'ant-design-vue';
import { RuleType, FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import cities from '/@/utils/lamp/cities.json';

const { t } = useI18n();

// 列表页字段
export const columns: BasicColumn[] = [
  {
    title: t('devOperation.tenant.defTenant.name'),
    dataIndex: 'name',
  },
  {
    title: t('devOperation.tenant.defTenant.registerType'),
    dataIndex: ['echoMap', 'registerType'],
    width: 100,
  },
  {
    title: t('devOperation.tenant.defTenant.state'),
    dataIndex: 'state',
    width: 80,
    customRender: ({ record }) => {
      const text = record.state ? t('lamp.common.enable') : t('lamp.common.disable');
      const color = record.state ? 'success' : 'error';
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: t('devOperation.tenant.defTenant.status'),
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      let status: 'success' | 'processing' | 'error' | 'default' | 'warning' = 'success';
      switch (record.status) {
        case TenantStatusEnum.NORMAL: // 正常
          status = 'success';
          break;
        case TenantStatusEnum.WAIT_INIT_SCHEMA: //待初始化表结构和数据
          status = 'processing';
          break;
        case TenantStatusEnum.WAIT_INIT_DATASOURCE: //待初始化数据源
          status = 'processing';
          break;
        case TenantStatusEnum.WITHDRAW: // 已撤回
          status = 'default';
          break;
        case TenantStatusEnum.WAITING: // 待审核
          status = 'processing';
          break;
        case TenantStatusEnum.REFUSE: // 拒绝
          status = 'error';
          break;
        case TenantStatusEnum.AGREED: // 已删除
          status = 'warning';
          break;
        default:
          status = 'success';
          break;
      }
      return <Badge status={status} text={record.echoMap?.status} />;
    },
  },
  {
    title: t('devOperation.tenant.defTenant.expirationTime'),
    dataIndex: 'expirationTime',
    width: 150,
    customRender: ({ record }) => {
      // 永久有效 已过期， 还剩2天到期  xxxx
      if (record.expirationTime) {
        if (dateUtil(record.expirationTime).isBefore(Date.now())) {
          return <Tag color="error">已过期</Tag>;
        } else if (dateUtil(record.expirationTime).isBefore(dateUtil().add(30, 'days'))) {
          const duration = dateUtil.duration(dateUtil(record.expirationTime).diff(Date.now()));
          if (duration.days() > 0) {
            return <Tag color="warning">{duration.days() + 1}天后到期</Tag>;
          } else {
            return <Tag color="warning">{duration.hours()}小时后到期</Tag>;
          }
        } else {
          return <Tag color="processing">{record.expirationTime}</Tag>;
        }
      } else {
        if (record.status === TenantStatusEnum.NORMAL) {
          return <Tag color="success">永久有效</Tag>;
        } else {
          return '-';
        }
      }
    },
  },
  {
    title: t('lamp.common.createdTime'),
    dataIndex: 'createdTime',
    sorter: true,
    width: 180,
  },
];

// 列表页搜索表单字段
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('devOperation.tenant.defTenant.name'),
    component: 'Input',
  },
  {
    field: 'createTimeRange',
    label: t('lamp.common.createdTime'),
    component: 'RangePicker',
  },
];

// 新增、编辑、查看页面表单字段
export const editFormSchema = (_: Ref<ActionEnum>): FormSchema[] => {
  return [
    {
      field: 'divider-selects1',
      component: 'Divider',
      label: '基础信息',
    },
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      required: false,
      show: false,
    },
    {
      field: 'name',
      label: t('devOperation.tenant.defTenant.name'),
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'abbreviation',
      label: t('devOperation.tenant.defTenant.abbreviation'),
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'logos',
      label: t('devOperation.tenant.defTenant.logo'),
      component: 'Upload',
      componentProps: {
        uploadParams: {
          bizType: FileBizTypeEnum.DEF_TENANT_LOGO,
        },
        multiple: false,
        maxNumber: 1,
        accept: ['image/*', '.xlsx', 'docx'],
        isDef: true,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'divider-selects2',
      component: 'Divider',
      label: '联系人信息',
    },
    {
      field: 'contactPerson',
      label: t('devOperation.tenant.defTenant.contactPerson'),
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'contactPhone',
      label: t('devOperation.tenant.defTenant.contactPhone'),
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'contactEmail',
      label: t('devOperation.tenant.defTenant.contactEmail'),
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'divider-selects3',
      component: 'Divider',
      label: '地区信息',
    },
    {
      field: 'area',
      label: '地区',
      // component: 'ApiCascader',
      // componentProps: {
      //   api: lazyList,
      //   asyncFetchParamKey: 'parentId',
      //   dataField: '',
      //   labelField: 'name',
      //   valueField: 'id',
      //   initFetchParams: {
      //     parentId: '0',
      //   },
      //   isLeaf: (record: Recordable) => {
      //     return !(record.treeGrade < 2);
      //   },
      // },
      component: 'Cascader',
      componentProps: {
        options: cities,
      },
    },
    {
      field: 'address',
      label: t('devOperation.tenant.defTenant.address'),
      component: 'Input',
    },
    {
      field: 'divider-selects4',
      component: 'Divider',
      label: '其他信息',
    },
    {
      field: 'creditCode',
      label: t('devOperation.tenant.defTenant.creditCode'),
      component: 'Input',
    },
    {
      field: 'describe',
      label: t('devOperation.tenant.defTenant.describe'),
      component: 'InputTextArea',
    },
  ];
};

// 额外的新增、编辑表单验证规则
export const customFormSchemaRules = (_: Ref<ActionEnum>): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'logos',
      rules: [
        {
          validator(_, value) {
            if (value) {
              if (value.length > 1) {
                return Promise.reject('只能上传一个文件');
              } else {
                return Promise.resolve();
              }
            } else {
              return Promise.resolve();
            }
          },
        },
      ],
      type: RuleType.cover,
    },
  ];
};
