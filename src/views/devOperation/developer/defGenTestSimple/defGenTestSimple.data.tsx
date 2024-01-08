import { Ref } from 'vue';
import { DictEnum } from '/@/enums/commonEnum';
import { EnumEnum } from '/@/enums/commonEnum';
import { dateUtil } from '/@/utils/dateUtil';
import { dictComponentProps } from '/@/utils/lamp/common';
import { enumComponentProps } from '/@/utils/lamp/common';
import { yesNoComponentProps } from '/@/utils/lamp/common';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum } from '/@/enums/commonEnum';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.developer.defGenTestSimple.name'),
      dataIndex: 'name',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.stock'),
      dataIndex: 'stock',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.type'),
      dataIndex: ['echoMap', 'type'],
      key: 'type',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.type2'),
      dataIndex: ['echoMap', 'type2'],
      key: 'type2',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.type3'),
      dataIndex: ['echoMap', 'type3'],
      key: 'type3',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.state'),
      dataIndex: 'state',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test4'),
      dataIndex: 'test4',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test5'),
      dataIndex: 'test5',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test6'),
      dataIndex: 'test6',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.parentId'),
      dataIndex: 'parentId',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.label'),
      dataIndex: 'label',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.sortValue'),
      dataIndex: 'sortValue',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test7'),
      dataIndex: ['echoMap', 'test7'],
      key: 'test7',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test12'),
      dataIndex: ['echoMap', 'test12'],
      key: 'test12',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.userId'),
      dataIndex: ['echoMap', 'userId'],
      key: 'userId',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.orgId'),
      dataIndex: ['echoMap', 'orgId'],
      key: 'orgId',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test8'),
      dataIndex: 'test8',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test9'),
      dataIndex: 'test9',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test10'),
      dataIndex: 'test10',
    },
    {
      title: t('devOperation.developer.defGenTestSimple.test11'),
      dataIndex: 'test11',
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
      label: t('devOperation.developer.defGenTestSimple.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.stock'),
      field: 'stock',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.type'),
      field: 'type',
      component: 'ApiRadioGroup',
      componentProps: {
        // 生成的 EnumEnum 常量不存在时，请自行在 EnumEnum 中添加
        ...enumComponentProps(EnumEnum.ProductType),
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.type2'),
      field: 'type2',
      component: 'ApiRadioGroup',
      componentProps: {
        // 生成的 EnumEnum 常量不存在时，请自行在 EnumEnum 中添加
        ...enumComponentProps(EnumEnum.DefGenTestSimpleType2Enum),
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.type3'),
      field: 'type3',
      component: 'ApiRadioGroup',
      componentProps: {
        // 生成的 DictEnum 常量不存在时，请自行在 DictEnum 中添加
        ...dictComponentProps(DictEnum.DictionaryType_Global_EDUCATION),
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.state'),
      field: 'state',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test4'),
      field: 'test4',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test5'),
      field: 'test5',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test6'),
      field: 'test6',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.parentId'),
      field: 'parentId',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.label'),
      field: 'label',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.sortValue'),
      field: 'sortValue',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test7'),
      field: 'test7',
      component: 'ApiRadioGroup',
      componentProps: {
        // 生成的 DictEnum 常量不存在时，请自行在 DictEnum 中添加
        ...dictComponentProps('GLOBAL_SEX'),
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test12'),
      field: 'test12',
      component: 'ApiRadioGroup',
      componentProps: {
        // 生成的 DictEnum 常量不存在时，请自行在 DictEnum 中添加
        ...dictComponentProps(DictEnum.DictionaryType_Global_DATA_TYPE),
      },
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.userId'),
      field: 'userId',
      component: 'ApiRadioGroup',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.orgId'),
      field: 'orgId',
      component: 'ApiRadioGroup',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test8'),
      field: 'test8',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test9'),
      field: 'test9',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test10'),
      field: 'test10',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test11'),
      field: 'test11',
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
      label: t('devOperation.developer.defGenTestSimple.name'),
      field: 'name',
      component: 'Input',
      defaultValue: '大法师',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.stock'),
      field: 'stock',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.type'),
      field: 'type',
      component: 'ApiRadioGroup',
      componentProps: {
        ...enumComponentProps(EnumEnum.ProductType),
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.type2'),
      field: 'type2',
      component: 'ApiRadioGroup',
      componentProps: {
        ...enumComponentProps(EnumEnum.DefGenTestSimpleType2Enum),
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.type3'),
      field: 'type3',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.DictionaryType_Global_EDUCATION),
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.state'),
      field: 'state',
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        ...yesNoComponentProps(),
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test4'),
      field: 'test4',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test5'),
      field: 'test5',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test6'),
      field: 'test6',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.parentId'),
      field: 'parentId',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.label'),
      field: 'label',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.sortValue'),
      field: 'sortValue',
      component: 'Input',
      defaultValue: '22',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test7'),
      field: 'test7',
      component: 'ApiRadioGroup',
      defaultValue: '01',
      componentProps: {
        ...dictComponentProps('GLOBAL_SEX'),
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test12'),
      field: 'test12',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.DictionaryType_Global_DATA_TYPE),
      },
    },
    {
      label: t('devOperation.developer.defGenTestSimple.userId'),
      field: 'userId',
      component: 'ApiRadioGroup',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.orgId'),
      field: 'orgId',
      component: 'ApiRadioGroup',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test8'),
      field: 'test8',
      component: 'Input',
      defaultValue: '21.2300',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test9'),
      field: 'test9',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test10'),
      field: 'test10',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestSimple.test11'),
      field: 'test11',
      component: 'Input',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
