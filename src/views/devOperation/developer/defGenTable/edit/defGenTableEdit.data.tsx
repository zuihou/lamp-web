import { FormSchema } from '/@/components/Table';
import { FormActionType } from '/@/components/Form';
import { EnumEnum } from '/@/enums/commonEnum';
import { useMessage } from '/@/hooks/web/useMessage';
import { lowerFirst } from 'lodash-es';
import { enumComponentProps, yesNoComponentProps } from '/@/utils/lamp/common';
import { EntitySuperClassEnum, GenTypeEnum, PopupTypeEnum, TplEnum } from '/@/enums/biz/tenant';
import { FormSchemaExt } from '/@/api/lamp/common/formValidateService';
import { query } from '/@/api/devOperation/tenant/datasourceConfig';
import { findOnlineService } from '/@/api/devOperation/application/gateway';
import { query as queryApplication } from '/@/api/devOperation/application/defApplication';
import { tree as queryMenu } from '/@/api/devOperation/application/defResource';
import { query as queryTable } from '/@/api/devOperation/developer/defGenTable';

const { createMessage } = useMessage();

const getAuthCode = async (formActionType: FormActionType, value: string, type: string) => {
  const { getFieldsValue, setFieldsValue } = formActionType;
  if (!value) {
    const model = await getFieldsValue();
    const plusApplicationName = model.plusApplicationName;
    const plusModuleName = model.plusModuleName;
    const entityName = lowerFirst(model.entityName);
    if (!plusApplicationName) {
      createMessage.warn('请先填写【前端应用名】');
      return;
    }
    if (!plusModuleName) {
      createMessage.warn('请先填写【前端模块名】');
      return;
    }
    if (!entityName) {
      createMessage.warn('请先填写【实体名称】');
      return;
    }
    const auth = `${plusApplicationName}:${plusModuleName}:${entityName}:${type}`;
    const field = `${type}Auth`;
    setFieldsValue({ [field]: auth });
  } else {
    createMessage.warn('无法生成！若您仍要采用系统规则生成，请先删除已输入的内容');
  }
};

// 生成字段页面 表单
export const baseEditFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'divider-selects1',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      label: '基础信息',
    },
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      field: 'batch',
      label: 'batch',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: false,
      show: false,
    },
    {
      label: '表名',
      field: 'name',
      component: 'Input',
      dynamicDisabled: true,
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: '数据源名',
      field: 'dsId',
      component: 'ApiSelect',
      dynamicDisabled: true,
      componentProps: {
        api: query,
        labelField: 'name',
        valueField: 'id',
        showSearch: true,
        allowClear: false,
      },
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: '实体名称',
      field: 'entityName',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: ['修改实体名称后，会影响Controller、Service、Manager、Mapper、VO的名称'],
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: '作者',
      field: 'author',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: ['体现在代码注释中的 @author'],
    },
    {
      label: '表注释',
      field: 'comment',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: ['体现在代码注释中'],
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: 'swagger注释',
      field: 'swaggerComment',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: ['体现在swagger文档'],
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      field: 'divider-selects2',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      label: '生成信息',
      helpMessage: [
        '生成的后端文件位于： [{输出路径}/]{全局配置.项目前缀}-{服务名}-{全局配置.服务后缀}/src/main/java/{父包名}/{模块名}[/{全局配置.PackageInfoConfig}]/{子包名}/',
        '[]: 表示可选项; {}: 表示占位符 ; 全局配置: 表示在后台yml或常量中配置',
        '全局配置.项目前缀: 后端yml配置： generator.projectPrefix',
        '全局配置.服务后缀: 后端代码常量： GenCodeConstant.XXX_SERVICE_SUFFIX',
        '全局配置.PackageInfoConfig: 后端yml配置: generator.packageInfoConfig.xxx',
      ],
    },
    {
      label: '服务名',
      field: 'serviceName',
      component: 'ApiAutoComplete',
      componentProps: ({ formActionType }) => {
        return {
          allowClear: true,
          getPopupContainer: () => document.body,
          filterOption: (input: string, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
          },
          api: findOnlineService,
          labelField: 'value',
          onChange: async (value: string) => {
            if (value) {
              const { setFieldsValue, getFieldsValue } = formActionType;
              const model = await getFieldsValue();
              if (!model.moduleName) {
                setFieldsValue({
                  moduleName: value,
                });
              }
            }
          },
        };
      },
      helpMessage: [
        '1. 确保前端ServicePrefixEnum中的枚举值KEY 与 后端”服务名“和lamp-gateway-server.yml中“uri”保持一致',
        '2. 确保前端ServicePrefixEnum中的枚举值VALUE 与 后端lamp-gateway-server.yml中“predicates”配置一致',
        '如： lamp-base、lamp-base-api、lamp-base-biz、lamp-base-controller、lamp-base-server 中的 base',
        '如： lamp-system-server 中的 system',
      ],
      colProps: {
        span: 12,
      },
    },
    {
      label: '父包名',
      field: 'parent',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [
        '生成业务代码的基础包包名',
        '如："top.tangyh.lamp.base.dao.common" 中的 "top.tangyh.lamp" ',
      ],
    },
    {
      label: '模块名',
      field: 'moduleName',
      component: 'ApiAutoComplete',
      componentProps: () => {
        return {
          allowClear: true,
          getPopupContainer: () => document.body,
          filterOption: (input: string, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
          },
          api: findOnlineService,
          labelField: 'value',
        };
      },
      colProps: {
        span: 12,
      },
      helpMessage: [
        '建议跟{服务名一致}保持一致',
        '如："top.tangyh.lamp.base.dao.common" 中的 "base" ',
        '如："top.tangyh.lamp.file.dao" 中的 "file" ',
      ],
    },
    {
      label: '子包名',
      field: 'childPackageName',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [
        '如："top.tangyh.lamp.base.dao.common" 中的 "common" ',
        '如："top.tangyh.lamp.base.dao.system" 中的 "system" ',
      ],
    },
    {
      label: '实体父类',
      field: 'entitySuperClass',
      component: 'ApiSelect',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(EnumEnum.EntitySuperClassEnum),
          onChange: async (value: string) => {
            const { setFieldsValue, getFieldsValue, updateSchema } = formActionType;

            createMessage.info('生成模板已级联更改');
            if (value === EntitySuperClassEnum.TREE_ENTITY) {
              setFieldsValue({ tplType: TplEnum.TREE });
              updateSchema({
                field: 'treeName',
                rules: [{ required: true }, { min: 0, max: 255, message: '长度不能超过255' }],
              });
            } else {
              const model = await getFieldsValue();
              model.tplType === TplEnum.TREE && setFieldsValue({ tplType: TplEnum.SIMPLE });
              updateSchema({
                field: 'treeName',
                rules: [{ required: false }, { min: 0, max: 255, message: '长度不能超过255' }],
              });
            }
          },
        };
      },
      colProps: {
        span: 12,
      },
      helpMessage: ['实体类需要继承谁？'],
    },
    {
      label: '父类',
      field: 'superClass',
      component: 'ApiSelect',
      componentProps: {
        ...enumComponentProps(EnumEnum.SuperClassEnum),
      },
      colProps: {
        span: 12,
      },
      helpMessage: ['Controller、Service、Manager、Mapper类需要继承谁？'],
    },
    {
      label: '@DS',
      field: 'isDs',
      component: 'RadioGroup',
      helpMessage: ['ServiceImpl类是否标记@DS注解，加上该注解后，sql操作会自动切换数据源'],
      itemProps: {
        extra: 'datasource模式才会使用该参数，column、none模式请忽略',
      },
      componentProps: ({ formActionType }) => {
        return {
          ...yesNoComponentProps(),
          onChange: (e) => {
            const { updateSchema } = formActionType;
            if (e.target.value) {
              updateSchema([
                {
                  field: 'dsValue',
                  rules: [{ required: true }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
                {
                  field: 'isDs',
                  colProps: {
                    span: 12,
                  },
                },
              ]);
            } else {
              updateSchema([
                {
                  field: 'dsValue',
                  rules: [{ required: false }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
                {
                  field: 'isDs',
                  colProps: {
                    span: 24,
                  },
                },
              ]);
            }
          },
        };
      },
      defaultValue: false,
      colProps: {
        span: 24,
      },
    },
    {
      label: '数据源',
      field: 'dsValue',
      colProps: {
        span: 12,
      },
      component: 'AutoComplete',
      helpMessage: ['ServiceImpl类标记的@DS注解具体值'],
      componentProps: () => {
        return {
          allowClear: true,
          getPopupContainer: () => document.body,
          filterOption: (input: string, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
          },
          options: [
            { value: 'DsConstant.BASE_TENANT' },
            { value: 'DsConstant.DEFAULTS' },
            { value: 'DsConstant.EXTEND_TENANT' },
          ],
        };
      },
      required: false,
      ifShow: ({ values }) => {
        return values.isDs;
      },
    },
    {
      label: '@TenantLine',
      field: 'isTenantLine',
      component: 'RadioGroup',
      helpMessage: ['Mapper类是否标记@TenantLine注解，加上该注解sql操作不会自动拼接租户ID'],
      itemProps: {
        extra: 'column模式才会使用该参数，datasource、none模式请忽略',
      },
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: false,
      colProps: {
        span: 12,
      },
    },
    {
      label: 'lombok',
      field: 'isLombok',
      component: 'RadioGroup',
      helpMessage: ['实体类是否使用Lombok注解'],
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '链式模型',
      field: 'isChain',
      component: 'RadioGroup',
      helpMessage: ['实体类是否使用@Accessors(chain = true)注解'],
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '生成字段常量',
      field: 'isColumnConstant',
      component: 'RadioGroup',
      helpMessage: ['实体类中是否生成字段常量'],
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: false,
      colProps: {
        span: 12,
      },
    },
    {
      label: '生成方式',
      field: 'genType',
      component: 'ApiRadioGroup',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(EnumEnum.GenTypeEnum),
          onChange: (e: ChangeEvent) => {
            const value = e?.target?.value;
            const { updateSchema } = formActionType;
            if (GenTypeEnum.GEN === value) {
              updateSchema([
                {
                  field: 'outputDir',
                  rules: [{ required: true }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
                {
                  field: 'frontOutputDir',
                  rules: [{ required: true }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
              ]);
            } else {
              updateSchema([
                {
                  field: 'outputDir',
                  rules: [{ required: false }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
                {
                  field: 'frontOutputDir',
                  rules: [{ required: false }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
              ]);
            }
          },
        };
      },
      colProps: {
        span: 12,
      },
      defaultValue: GenTypeEnum.GEN,
      helpMessage: [
        '生成代码的方式',
        '直接生成时，一定要确保lamp-generator服务在本地启动，否则无法生成到开发者的开发电脑',
      ],
    },
    {
      label: '后端生成路径',
      field: 'outputDir',
      component: 'Input',
      helpMessage: ['非dev环境启动，此参数无效'],
      ifShow: ({ values }) => {
        return values.genType === GenTypeEnum.GEN;
      },
    },
    {
      label: '前端生成路径',
      field: 'frontOutputDir',
      component: 'Input',
      helpMessage: ['非dev环境启动，此参数无效'],
      ifShow: ({ values }) => {
        return values.genType === GenTypeEnum.GEN;
      },
    },
    {
      field: 'divider-selects3',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      label: '前端信息',
    },
    {
      label: '前端应用名',
      field: 'plusApplicationName',
      component: 'AutoComplete',
      componentProps: () => {
        return {
          allowClear: true,
          getPopupContainer: () => document.body,
          filterOption: (input: string, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
          },
          options: [{ value: 'devOperation' }, { value: 'basic' }],
        };
      },
      colProps: {
        span: 12,
      },
      helpMessage: [
        '1. src/views/ 目录下的 basic 或 devOperation 或 其他 ',
        '2. src/api/ 目录下的 basic 或 devOperation 或 其他 ',
        '3. src/locales/lang/{语言}/ 目录下的 basic 或 devOperation 或 其他 ',
        '4. 其他 表示其他应用',
      ],
    },
    {
      label: '前端模块名',
      field: 'plusModuleName',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [
        '1. src/api/{前端应用名} 目录下的文件夹名',
        '2. src/views/{前端应用名} 目录下的文件夹名',
        '3. src/locales/lang/{语言}/{前端应用名} 目录下的文件夹名',
        '如：src/views/devOperation/ 下的 application、developer 等目录',
        '如：src/api/devOperation/ 下的 application、developer 等目录',
      ],
    },

    {
      label: '弹窗方式',
      field: 'popupType',
      component: 'ApiRadioGroup',
      componentProps: {
        ...enumComponentProps(EnumEnum.PopupTypeEnum),
      },
      colProps: {
        span: 12,
      },
      defaultValue: PopupTypeEnum.MODAL,
      helpMessage: ['前端代码index.vue页面点击新增或编辑时，弹窗的打开方式'],
    },
    {
      label: '生成模板',
      field: 'tplType',
      component: 'ApiRadioGroup',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(EnumEnum.TplEnum),
          onChange: async (e: ChangeEvent) => {
            console.log(e.target.value);
            const { updateSchema, setFieldsValue } = formActionType;

            createMessage.info('实体父类已级联更改');
            if (e.target.value === TplEnum.TREE) {
              await updateSchema({
                field: 'treeName',
                rules: [{ required: true }, { min: 0, max: 255, message: '长度不能超过255' }],
              });
              await setFieldsValue({ entitySuperClass: EntitySuperClassEnum.TREE_ENTITY });
            } else {
              await setFieldsValue({ entitySuperClass: EntitySuperClassEnum.ENTITY });
              await updateSchema({
                field: 'treeName',
                rules: [{ required: false }, { min: 0, max: 255, message: '长度不能超过255' }],
              });
            }
          },
        };
      },
      defaultValue: TplEnum.SIMPLE,
      colProps: {
        span: 12,
      },
      helpMessage: ['前端代码生成何种操作风格的页面'],
    },
    {
      label: '显示新增按钮',
      field: 'addShow',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '显示编辑按钮',
      field: 'editShow',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '显示删除按钮',
      field: 'deleteShow',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '显示复制按钮',
      field: 'copyShow',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '显示详情按钮',
      field: 'viewShow',
      component: 'RadioGroup',
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '新增按钮权限',
      field: 'addAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.addShow;
      },
      helpMessage: [
        '文本框为空时，方可点击"生成"按钮，按系统建议的规则生成权限编码',
        '系统规则：{前端应用名}:{前端模块名}:{实体名称}:add',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: '生成',
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'add');
          },
        };
      },
    },
    {
      label: '编辑按钮权限',
      field: 'editAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.editShow;
      },
      helpMessage: [
        '文本框为空时，方可点击"生成"按钮，按系统建议的规则生成权限编码',
        '系统规则：{前端应用名}:{前端模块名}:{实体名称}:edit',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: '生成',
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'edit');
          },
        };
      },
    },
    {
      label: '删除按钮权限',
      field: 'deleteAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.deleteShow;
      },
      helpMessage: [
        '文本框为空时，方可点击"生成"按钮，按系统建议的规则生成权限编码',
        '系统规则：{前端应用名}:{前端模块名}:{实体名称}:delete',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: '生成',
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'delete');
          },
        };
      },
    },
    {
      label: '复制按钮权限',
      field: 'copyAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.copyShow;
      },
      helpMessage: [
        '文本框为空时，方可点击"生成"按钮，按系统建议的规则生成权限编码',
        '系统规则：{前端应用名}:{前端模块名}:{实体名称}:copy',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: '生成',
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'copy');
          },
        };
      },
    },
    {
      label: '详情按钮权限',
      field: 'viewAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.viewShow;
      },
      helpMessage: [
        '文本框为空时，方可点击"生成"按钮，按系统建议的规则生成权限编码',
        '系统规则：{前端应用名}:{前端模块名}:{实体名称}:view',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: '生成',
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'view');
          },
        };
      },
    },
    {
      field: 'divider-selects4',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      label: 'SQL信息',
    },
    {
      label: '菜单所属应用',
      field: 'menuApplicationId',
      component: 'ApiSelect',
      componentProps: ({ formActionType }) => {
        return {
          api: queryApplication,
          labelField: 'name',
          valueField: 'id',
          onChange: async (applicationId: string) => {
            const { updateSchema, setFieldsValue } = formActionType;
            setFieldsValue({ menuParentId: undefined });
            const treeData = await queryMenu({ applicationId });
            await updateSchema({
              field: 'menuParentId',
              componentProps: {
                treeData,
              },
            });
          },
        };
      },
      helpMessage: ['当前功能生成后，菜单属于哪个应用？'],
      colProps: {
        span: 12,
      },
    },
    {
      label: '上级菜单',
      field: 'menuParentId',
      component: 'TreeSelect',
      componentProps: {
        fieldNames: { children: 'children', label: 'name', key: 'id', value: 'id' },
      },
      helpMessage: ['当前功能生成后，显示在左侧菜单的位置'],
      colProps: {
        span: 12,
      },
    },
    {
      label: '当前菜单名',
      field: 'menuName',
      component: 'Input',
      helpMessage: ['当前功能生成后，显示在左侧的菜单名'],
      colProps: {
        span: 12,
      },
    },
    {
      label: '菜单图标',
      field: 'menuIcon',
      component: 'IconPicker',
      helpMessage: ['当前功能生成后，显示在左侧的菜单图标'],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'divider-selects5',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      label: '其他信息',
      ifShow: ({ values }) => {
        return [TplEnum.MAIN_SUB, TplEnum.TREE].includes(values.tplType);
      },
    },
    {
      label: '树名称字段',
      field: 'treeName',
      component: 'Input',
      helpMessage: ['树型页面，显示在树节点上的字段'],
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.tplType === TplEnum.TREE;
      },
      required: ({ values }) => {
        return values.tplType === TplEnum.TREE;
      },
    },
    {
      label: '从表',
      field: 'subId',
      component: 'ApiSelect',
      helpMessage: ['主从页面，从表需要先导入并配置相关信息'],
      componentProps: {
        api: queryTable,
        labelField: 'name',
        valueField: 'id',
        showSearch: true,
        allowClear: false,
        allData: false,
      },
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.tplType === TplEnum.MAIN_SUB;
      },
      required: ({ values }) => {
        return values.tplType === TplEnum.MAIN_SUB;
      },
    },
    {
      label: '从表实体字段名',
      field: 'subJavaFieldName',
      component: 'Input',
      helpMessage: ['主从页面，从表的外键Java实体类的字段名'],
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.tplType === TplEnum.MAIN_SUB;
      },
      required: ({ values }) => {
        return values.tplType === TplEnum.MAIN_SUB;
      },
    },
  ];
};

// 生成字段页面 表单前端自定义验证规则
export const customFormSchemaRules = (
  _getFieldsValue: () => Recordable,
): Partial<FormSchemaExt>[] => {
  return [];
};
