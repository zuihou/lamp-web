import { FormSchema } from '/@/components/Table';
import { enumComponentProps } from '/@/utils/lamp/common';
import { EnumEnum } from '/@/enums/commonEnum';

// 代码生成页面 表单
export const generatorCodeFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'divider-selects1',
      component: 'Divider',
      label: '后端',
      helpMessage: ['“覆盖策略”只会影响“生成前端”和“生成后端”功能，下载功能不收“覆盖策略”影响'],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'allBack',
      component: 'ApiRadioGroup',
      label: '批量设置',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
          isBtn: true,
          onChange: (e: ChangeEvent) => {
            const { setFieldsValue } = formActionType;
            const value = e?.target?.value;
            setFieldsValue({
              enum: value,
              saveVo: value,
              updateVo: value,
              resultVo: value,
              pageQuery: value,
              sql: value,
              entity: value,
              xml: value,
              mapper: value,
              manager: value,
              service: value,
              controller: value,
            });
          },
        };
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'entity',
      component: 'ApiRadioGroup',
      label: 'entity',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'saveVo',
      component: 'ApiRadioGroup',
      label: 'saveVo',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'updateVo',
      component: 'ApiRadioGroup',
      label: 'updateVo',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'resultVo',
      component: 'ApiRadioGroup',
      label: 'resultVo',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'pageQuery',
      component: 'ApiRadioGroup',
      label: 'pageQuery',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'enum',
      component: 'ApiRadioGroup',
      label: 'Enum',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'sql',
      component: 'ApiRadioGroup',
      label: 'sql',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'xml',
      component: 'ApiRadioGroup',
      label: 'xml',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'mapper',
      component: 'ApiRadioGroup',
      label: 'mapper',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'manager',
      component: 'ApiRadioGroup',
      label: 'manager',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'service',
      component: 'ApiRadioGroup',
      label: 'service',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'controller',
      component: 'ApiRadioGroup',
      label: 'controller',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'echoList',
      component: 'ApiRadioGroup',
      label: 'Echo常量',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
      helpMessage: ['仅支持覆盖和忽略'],
    },
    {
      field: 'divider-selects1',
      component: 'Divider',
      helpMessage: ['“覆盖策略”只会影响“生成前端”和“生成后端”功能，下载功能不收“覆盖策略”影响'],
      label: '前端',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'allFront',
      component: 'ApiRadioGroup',
      label: '批量设置',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
          isBtn: true,
          onChange: (e: ChangeEvent) => {
            const { setFieldsValue } = formActionType;
            const value = e?.target?.value;
            setFieldsValue({
              api: value,
              model: value,
              langEn: value,
              langZh: value,
              data: value,
              index: value,
              edit: value,
            });
          },
        };
      },
      colProps: {
        span: 24,
      },
    },

    {
      field: 'index',
      component: 'ApiRadioGroup',
      label: 'index',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'edit',
      component: 'ApiRadioGroup',
      label: 'edit',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'data',
      component: 'ApiRadioGroup',
      label: 'data',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'api',
      component: 'ApiRadioGroup',
      label: 'Api',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'model',
      component: 'ApiRadioGroup',
      label: 'Model',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'langEn',
      component: 'ApiRadioGroup',
      label: 'langEn',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
    },
    {
      field: 'langZh',
      component: 'ApiRadioGroup',
      label: 'langZh',
      componentProps: {
        ...enumComponentProps(EnumEnum.FileOverrideStrategyEnum),
        isBtn: true,
      },
      colProps: {
        span: 24,
      },
    },
  ];
};
