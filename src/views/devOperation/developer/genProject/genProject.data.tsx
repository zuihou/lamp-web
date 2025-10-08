import { FormSchema } from '/@/components/Table';
import { enumComponentProps } from '/@/utils/lamp/common';
import { DictEnum } from '/@/enums/commonEnum';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { ProjectTypeEnum } from '/@/enums/biz/base';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 编辑页字段
export const editFormSchema = (changeTab: Fn): FormSchema[] => {
  return [
    {
      field: 'divider-selects1',
      label: 'lamp-cloud/lamp-boot 配置',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      colProps: {
        span: 24,
      },
    },
    {
      label: t('devOperation.developer.genProject.type'),
      field: 'type',
      component: 'ApiRadioGroup',
      defaultValue: ProjectTypeEnum.CLOUD,
      componentProps: {
        ...enumComponentProps(DictEnum.ProjectTypeEnum),
        onClick: () => {
          changeTab('project_type');
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.outputDir'),
      field: 'outputDir',
      component: 'Input',
      helpMessage: [
        t('devOperation.developer.genProject.helpMessage.outputDir[0]'),
        t('devOperation.developer.genProject.helpMessage.outputDir[1]'),
      ],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.author'),
      field: 'author',
      component: 'Input',
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.description'),
      field: 'description',
      component: 'Input',
      helpMessage: [t('devOperation.developer.genProject.helpMessage.description')],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.projectPrefix'),
      field: 'projectPrefix',
      component: 'Input',
      helpMessage: [t('devOperation.developer.genProject.helpMessage.projectPrefix')],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.serviceName'),
      field: 'serviceName',
      component: 'Input',
      helpMessage: [
        t('devOperation.developer.genProject.helpMessage.serviceName[0]'),
        t('devOperation.developer.genProject.helpMessage.serviceName[1]'),
      ],
      componentProps: ({ formActionType }) => {
        return {
          onFocus: (e) => {
            changeTab(e.target.id);
          },
          onChange: (e: ChangeEvent) => {
            if (e?.target?.value) {
              const { setFieldsValue } = formActionType;
              setFieldsValue({
                moduleName: e?.target?.value,
              });
            }
          },
        };
      },
    },
    {
      label: t('devOperation.developer.genProject.parent'),
      field: 'parent',
      component: 'Input',
      helpMessage: [
        t('devOperation.developer.genProject.helpMessage.parent[0]'),
        t('devOperation.developer.genProject.helpMessage.parent[1]'),
        t('devOperation.developer.genProject.helpMessage.parent[2]'),
      ],
      componentProps: ({ formActionType }) => {
        return {
          onFocus: (e) => {
            changeTab(e.target.id);
          },
          onChange: (e: ChangeEvent) => {
            if (e?.target?.value) {
              const { setFieldsValue } = formActionType;
              setFieldsValue({
                groupId: e?.target?.value,
              });
            }
          },
        };
      },
    },
    {
      label: t('devOperation.developer.genProject.moduleName'),
      field: 'moduleName',
      component: 'Input',
      helpMessage: [
        t('devOperation.developer.genProject.helpMessage.moduleName[0]'),
        t('devOperation.developer.genProject.helpMessage.moduleName[1]'),
      ],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: 'groupId',
      field: 'groupId',
      component: 'Input',
      helpMessage: [t('devOperation.developer.genProject.helpMessage.groupId')],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.version'),
      field: 'version',
      component: 'Input',
      helpMessage: [t('devOperation.developer.genProject.helpMessage.version')],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.serverPort'),
      field: 'serverPort',
      component: 'InputNumber',
      itemProps: {
        extra: t('devOperation.developer.genProject.helpMessage.serverPort'),
      },
      componentProps: {
        onFocus: () => {
          changeTab('project_serverPort');
        },
      },
    },
    {
      label: t('devOperation.developer.genProject.seata'),
      field: 'seata',
      defaultValue: true,
      component: 'Switch',
      itemProps: {
        extra: t('devOperation.developer.genProject.helpMessage.seata'),
      },
    },
    {
      field: 'divider-selects2',
      label: 'lamp-util ' + t('devOperation.developer.genProject.configuration'),
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      colProps: {
        span: 24,
      },
    },
    {
      label: t('devOperation.developer.genProject.utilParent'),
      field: 'utilParent',
      component: 'Input',
      helpMessage: [
        t('devOperation.developer.genProject.helpMessage.utilParent[0]'),
        t('devOperation.developer.genProject.helpMessage.utilParent[1]'),
      ],
      componentProps: ({ formActionType }) => {
        return {
          onFocus: (e) => {
            changeTab(e.target.id);
          },
          onChange: (e: ChangeEvent) => {
            if (e?.target?.value) {
              const { setFieldsValue } = formActionType;
              setFieldsValue({
                utilGroupId: e?.target?.value,
              });
            }
          },
        };
      },
    },
    {
      label: 'utilGroupId',
      field: 'utilGroupId',
      component: 'Input',
      helpMessage: [t('devOperation.developer.genProject.helpMessage.utilGroupId')],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
  ];
};

// 前端自定义表单验证规则
export const customFormSchemaRules = (): Partial<FormSchemaExt>[] => {
  return [
    {
      field: 'outputDir',
      type: RuleType.append,
      rules: [
        {
          trigger: ['change', 'blur'],
          async validator(_, value) {
            if (value && value === '/') {
              return Promise.reject('安全起见，请勿生成在根路径');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
