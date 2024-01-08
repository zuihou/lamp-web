import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { FileBizTypeEnum } from '/@/enums/commonEnum';
import { Tag } from 'ant-design-vue';
import { dateUtil } from '/@/utils/dateUtil';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.application.defApplication.name'),
      dataIndex: 'name',
      // width: 180,
    },
    {
      title: t('devOperation.application.defApplication.version'),
      dataIndex: 'version',
      width: 100,
    },
    {
      title: '有效期',
      dataIndex: 'state',
      width: 150,
      customRender: ({ record }) => {
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
          return <Tag color="success">永久有效</Tag>;
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
};

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('devOperation.application.defApplication.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 8 },
    },
  ];
};

// 编辑页字段
export const editFormSchema = (_): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.application.defApplication.logo'),
      field: 'appendixIcon',
      component: 'CropperAvatar',
      componentProps: {
        isDef: true,
        showBtn: false,
        uploadParams: { bizType: FileBizTypeEnum.DEF_APPLICATION_LOGO },
      },
    },
    {
      label: t('devOperation.application.defApplication.name'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defApplication.version'),
      field: 'version',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defApplication.introduce'),
      field: 'introduce',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defApplication.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: t('devOperation.application.defApplication.url'),
      field: 'url',
      component: 'Input',
    },
    {
      label: t('devOperation.application.defApplication.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
    },
  ];
};
