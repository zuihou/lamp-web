import { FormSchema } from '/@/components/Table';
import { enumComponentProps } from '/@/utils/lamp/common';
import { EnumEnum } from '/@/enums/commonEnum';
import { FormSchemaExt, RuleType } from '/@/api/lamp/common/formValidateService';
import { ProjectTypeEnum } from '/@/enums/biz/base';

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
      label: '项目类型',
      field: 'type',
      component: 'ApiRadioGroup',
      defaultValue: ProjectTypeEnum.CLOUD,
      componentProps: {
        ...enumComponentProps(EnumEnum.ProjectTypeEnum),
        onClick: () => {
          changeTab('project_type');
        },
      },
    },
    {
      label: '输出路径',
      field: 'outputDir',
      component: 'Input',
      helpMessage: ['请确保lamp-generator服务在本地启动', '项目生成到指定的绝对路径'],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: '作者',
      field: 'author',
      component: 'Input',
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: '中文服务名',
      field: 'description',
      component: 'Input',
      helpMessage: ['服务的中文名称'],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: '项目前缀',
      field: 'projectPrefix',
      component: 'Input',
      helpMessage: ['如： lamp-base、lamp-base-server 中的lamp'],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: '服务名',
      field: 'serviceName',
      component: 'Input',
      helpMessage: ['如： lamp-base-server 中的base', '如： lamp-system-server system'],
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
      label: '基础包',
      field: 'parent',
      component: 'Input',
      helpMessage: [
        'lamp-cloud或lamp-boot项目的基础包',
        '如： top.tangyh.lamp.base.dao.common 包中的 top.tangyh.lamp',
        '如： top.tangyh.lamp.file.dao.xxx 包中的 top.tangyh.lamp',
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
      label: '模块名',
      field: 'moduleName',
      component: 'Input',
      helpMessage: [
        '如： top.tangyh.lamp.base.dao.common 包中的 base',
        'top.tangyh.lamp.file.dao.xxx 包中的 file',
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
      helpMessage: ['lamp-cloud或lamp-boot项目 pom文件的groupId'],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: '版本号',
      field: 'version',
      component: 'Input',
      helpMessage: ['lamp-cloud或lamp-boot项目 pom文件中的版本号'],
      componentProps: {
        onFocus: (e) => {
          changeTab(e.target.id);
        },
      },
    },
    {
      label: '端口号',
      field: 'serverPort',
      component: 'InputNumber',
      itemProps: {
        extra: 'lamp-cloud项目 新建服务的端口号，lamp-boot项目请忽略该参数',
      },
      componentProps: {
        onFocus: () => {
          changeTab('project_serverPort');
        },
      },
    },
    {
      field: 'divider-selects2',
      label: 'lamp-util 配置',
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
      label: 'util基础包',
      field: 'utilParent',
      component: 'Input',
      helpMessage: ['lamp-util项目的基础包', '如： top.tangyh.basic.xxx 包中的 top.tangyh.basic'],
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
      helpMessage: ['lamp-util项目 pom文件的groupId'],
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
