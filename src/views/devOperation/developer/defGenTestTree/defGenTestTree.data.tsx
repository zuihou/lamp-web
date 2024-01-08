import { Ref } from 'vue';
import { DictEnum } from '/@/enums/commonEnum';
import { EnumEnum } from '/@/enums/commonEnum';
import { dateUtil } from '/@/utils/dateUtil';
import { dictComponentProps } from '/@/utils/lamp/common';
import { enumComponentProps } from '/@/utils/lamp/common';
import { yesNoComponentProps } from '/@/utils/lamp/common';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum } from '/@/enums/commonEnum';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';

const { t } = useI18n();

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
      field: 'parentId',
      label: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      field: 'parentName',
      label: 'parentName',
      component: 'Input',
      show: true,
    },
    {
      label: t('devOperation.developer.defGenTestTree.name'),
      field: 'name',
      component: 'Input',
      defaultValue: '',
    },
    {
      label: t('devOperation.developer.defGenTestTree.stock'),
      field: 'stock',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestTree.type'),
      field: 'type',
      component: 'ApiRadioGroup',
      componentProps: {
        ...enumComponentProps(EnumEnum.ProductType),
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.type2'),
      field: 'type2',
      component: 'ApiRadioGroup',
      componentProps: {
        ...enumComponentProps(EnumEnum.DefGenTestTreeType2Enum),
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.type3'),
      field: 'type3',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.DictionaryType_Global_EDUCATION),
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.state'),
      field: 'state',
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        ...yesNoComponentProps(),
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.test4'),
      field: 'test4',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestTree.test5'),
      field: 'test5',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.test6'),
      field: 'test6',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: dateUtil('00:00:00', 'HH:mm:ss') },
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.test7'),
      field: 'test7',
      component: 'ApiRadioGroup',
      defaultValue: '01',
      componentProps: {
        ...dictComponentProps('GLOBAL_SEX'),
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.test12'),
      field: 'test12',
      component: 'ApiRadioGroup',
      componentProps: {
        ...dictComponentProps(DictEnum.DictionaryType_Global_DATA_TYPE),
      },
    },
    {
      label: t('devOperation.developer.defGenTestTree.userId'),
      field: 'userId',
      component: 'ApiRadioGroup',
    },
    {
      label: t('devOperation.developer.defGenTestTree.orgId'),
      field: 'orgId',
      component: 'ApiRadioGroup',
    },
    {
      label: t('devOperation.developer.defGenTestTree.test8'),
      field: 'test8',
      component: 'Input',
      defaultValue: '21.2300',
    },
    {
      label: t('devOperation.developer.defGenTestTree.test9'),
      field: 'test9',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestTree.test10'),
      field: 'test10',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestTree.test11'),
      field: 'test11',
      component: 'Input',
    },
    {
      label: t('devOperation.developer.defGenTestTree.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (_): Partial<FormSchemaExt>[] => {
  return [];
};
