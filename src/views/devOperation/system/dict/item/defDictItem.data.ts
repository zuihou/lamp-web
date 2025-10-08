import { Ref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ActionEnum } from '/@/enums/commonEnum';
import { stateFilters, stateComponentProps } from '/@/utils/lamp/common';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { check } from '/@/api/devOperation/system/defDictItem';
import { isEmpty, isNullOrUnDef } from '/@/utils/is';

const { t } = useI18n();
// 列表页字段
export const columns = (): BasicColumn[] => {
  return [
    {
      title: t('devOperation.system.defDictItem.key'),
      dataIndex: 'key',
    },
    {
      title: t('devOperation.system.defDictItem.name'),
      dataIndex: 'name',
    },
    {
      title: t('devOperation.system.defDict.state'),
      dataIndex: 'state',
      width: 80,
      filters: [...stateFilters()],
    },
    {
      title: t('devOperation.system.defDictItem.sortValue'),
      dataIndex: 'sortValue',
      sorter: true,
      width: 80,
    },
    // {
    //   title: t('lamp.common.createdTime'),
    //   dataIndex: 'createdTime',
    //   sorter: true,
    //   width: 180,
    // },
  ];
};

export const searchFormSchema = (): FormSchema[] => {
  return [
    {
      label: t('devOperation.system.defDictItem.key'),
      field: 'key',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      label: t('devOperation.system.defDictItem.name'),
      field: 'name',
      component: 'Input',
      colProps: { span: 12 },
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
      label: t('devOperation.system.defDictItem.parentId'),
      field: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      label: t('devOperation.system.defDictItem.parentKey'),
      field: 'parentKey',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('devOperation.system.defDictItem.label'),
      field: 'parentName',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: t('devOperation.system.defDictItem.key'),
      field: 'key',
      component: 'Input',
      // dynamicDisabled: () => {
      //   return type.value === ActionEnum.EDIT;
      // },
    },
    {
      label: t('devOperation.system.defDictItem.name'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defDictItem.state'),
      field: 'state',
      component: 'RadioButtonGroup',
      componentProps: {
        ...stateComponentProps(),
      },
      defaultValue: true,
    },
    {
      label: t('devOperation.system.defDictItem.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: t('devOperation.system.defDictItem.sortValue'),
      field: 'sortValue',
      component: 'InputNumber',
    },
    {
      label: t('devOperation.system.defDictItem.icon'),
      field: 'icon',
      component: 'IconPicker',
    },
    {
      label: t('devOperation.system.defDictItem.cssStyle'),
      field: 'cssStyle',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defDictItem.cssClass'),
      field: 'cssClass',
      component: 'Input',
    },
    {
      label: t('devOperation.system.defDictItem.i18nJson'),
      field: 'i18nJson',
      slot: 'i18nJson',
      component: 'Input',
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (
  type: Ref<ActionEnum>,
  getFieldsValue: () => Recordable,
): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'key',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (type.value === ActionEnum.EDIT) {
              return Promise.resolve();
            }
            const model = await getFieldsValue();
            if (value && (await check(value, model?.parentId))) {
              return Promise.reject(t('devOperation.system.defDict.key') + '已经存在');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'i18nJson',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (type.value === ActionEnum.VIEW) {
              return Promise.resolve();
            }
            // const model = await getFieldsValue();
            // if (value && (await check(value, model?.parentId))) {
            //   return Promise.reject(t('devOperation.system.defDict.key') + '已经存在');
            // }
            // return Promise.resolve();

            if (isNullOrUnDef(value) || isEmpty(value)) {
              return Promise.reject('请填写国际化配置');
            }
            try {
              const obj = JSON.parse(value);

              const list: number[] = [];
              for (const key in obj) {
                if (isNullOrUnDef(obj[key]) || isEmpty(obj[key])) {
                  list.push(1);
                }
              }
              if (list.length > 0) {
                return Promise.reject(`请填写国际化配置`);
              }
              return Promise.resolve();
            } catch {}
            return Promise.reject('国际化配置格式不正确');
          },
        },
      ],
    },
  ];
};
