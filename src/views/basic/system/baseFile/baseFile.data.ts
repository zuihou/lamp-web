import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

import { enumComponentProps, formatFileSize } from '/@/utils/lamp/common';
import { EnumEnum } from '/@/enums/commonEnum';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: '文件预览',
      dataIndex: 'path',
      // width: 120,
    },
    {
      title: t('basic.system.baseFile.originalFileName'),
      dataIndex: 'originalFileName',
      // width: 180,
    },
    {
      title: t('basic.system.baseFile.bucket'),
      dataIndex: 'bucket',
      width: 100,
    },
    {
      title: t('basic.system.baseFile.bizType'),
      dataIndex: 'bizType',
    },
    {
      title: t('basic.system.baseFile.storageType'),
      dataIndex: ['echoMap', 'storageType'],
      width: 100,
    },
    {
      title: t('basic.system.baseFile.fileType'),
      dataIndex: ['echoMap', 'fileType'],
      width: 100,
    },
    {
      title: t('basic.system.baseFile.contentType'),
      dataIndex: 'contentType',
      // width: 180,
    },
    {
      title: t('basic.system.baseFile.size'),
      dataIndex: 'size',
      width: 100,
      format: (text) => {
        return formatFileSize(text);
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
      label: t('basic.system.baseFile.originalFileName'),
      field: 'originalFileName',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('basic.system.baseFile.bucket'),
      field: 'bucket',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('basic.system.baseFile.storageType'),
      field: 'storageType',
      component: 'ApiSelect',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileStorageType),
      },
      colProps: { span: 6 },
    },
    {
      label: t('basic.system.baseFile.fileType'),
      field: 'fileType',
      component: 'ApiSelect',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileType),
      },
      colProps: { span: 6 },
    },
    {
      label: t('basic.system.baseFile.contentType'),
      field: 'contentType',
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
export const editFormSchema = (param): FormSchema[] => {
  return [
    {
      label: t('basic.system.baseFile.storageType'),
      field: 'storageType',
      component: 'ApiSelect',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileStorageType),
        onChange: (value: string) => {
          param.storageType = value;
        },
      },
      defaultValue: param.storageType,
    },
    {
      label: t('basic.system.baseFile.bucket'),
      field: 'bucket',
      component: 'Select',
      componentProps: {
        onChange: (value: string) => {
          param.bucket = value;
        },
        options: [
          {
            label: '私有资源',
            value: 'dev',
            key: 'dev',
          },
          {
            label: '公共资源',
            value: 'public',
            key: 'public',
          },
        ],
      },
      defaultValue: param.bucket,
    },
    {
      label: t('basic.system.baseFile.bizType'),
      field: 'bizType',
      component: 'Input',
      defaultValue: param.bizType,
      componentProps: {
        onChange: (e: InputEvent) => {
          param.bizType = (e?.target as HTMLInputElement)?.value;
        },
      },
      required: true,
    },
    {
      label: '文件',
      field: 'file',
      component: 'Upload',
      helpMessage:
        '上面的3个参数可以实时控制本组件传递到后台的对应的参数，此功能一般只开放给开发人员调试使用。',
      componentProps: {
        uploadParams: param,
        multiple: false,
        maxNumber: 1,
        isDef: false,
      },
    },
  ];
};
