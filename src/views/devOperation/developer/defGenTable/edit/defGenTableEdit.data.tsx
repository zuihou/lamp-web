import { FormSchema } from '/@/components/Table';
import { FormActionType } from '/@/components/Form';
import { DictEnum } from '/@/enums/commonEnum';
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
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
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
      label: t('devOperation.developer.defGenTable.edit.basicInfo'),
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
      label: t('devOperation.developer.defGenTable.edit.name'),
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
      label: t('devOperation.developer.defGenTable.edit.dsId'),
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
      label: t('devOperation.developer.defGenTable.edit.entityName'),
      field: 'entityName',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.entityName')],
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: t('devOperation.developer.defGenTable.author'),
      field: 'author',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.comment') + '@author'],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.comment'),
      field: 'comment',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.comment')],
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.swaggerComment'),
      field: 'swaggerComment',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.swaggerComment')],
      show: ({ values }) => {
        return !values.batch;
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.remark'),
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
      label: t('devOperation.developer.defGenTable.edit.genInfo'),
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.BasicTitle[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.BasicTitle[1]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.BasicTitle[2]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.BasicTitle[3]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.BasicTitle[4]'),
      ],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.serviceName'),
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
        t('devOperation.developer.defGenTable.edit.helpMessage.serviceName[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.serviceName[1]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.serviceName[2]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.serviceName[3]'),
      ],
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.parent'),
      field: 'parent',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.parent[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.parent[1]'),
      ],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.moduleName'),
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
        t('devOperation.developer.defGenTable.edit.helpMessage.moduleName[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.moduleName[1]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.moduleName[2]'),
      ],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.childPackageName'),
      field: 'childPackageName',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.childPackageName[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.childPackageName[1]'),
      ],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.entitySuperClass'),
      field: 'entitySuperClass',
      component: 'ApiSelect',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(DictEnum.EntitySuperClassEnum),
          onChange: async (value: string) => {
            const { setFieldsValue, getFieldsValue, updateSchema } = formActionType;

            createMessage.info(
              t('devOperation.developer.defGenTable.edit.helpMessage.entitySuperClass[0]'),
            );
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
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.entitySuperClass[1]')],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.superClass'),
      field: 'superClass',
      component: 'ApiSelect',
      componentProps: {
        ...enumComponentProps(DictEnum.SuperClassEnum),
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
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.isDs[0]')],
      itemProps: {
        extra: t('devOperation.developer.defGenTable.edit.helpMessage.isDs[1]'),
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
      label: t('devOperation.developer.defGenTable.edit.dsId'),
      field: 'dsValue',
      colProps: {
        span: 12,
      },
      component: 'AutoComplete',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.dsValue[0]')],
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
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.isTenantLine[0]')],
      itemProps: {
        extra: t('devOperation.developer.defGenTable.edit.helpMessage.isTenantLine[1]'),
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
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.isLombok[0]')],
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.isChain'),
      field: 'isChain',
      component: 'RadioGroup',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.isChain[0]')],
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.isColumnConstant'),
      field: 'isColumnConstant',
      component: 'RadioGroup',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.isColumnConstant[0]')],
      componentProps: {
        ...yesNoComponentProps(),
      },
      defaultValue: false,
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.genType'),
      field: 'genType',
      component: 'ApiRadioGroup',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(DictEnum.GenTypeEnum),
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
                {
                  field: 'frontSoyOutputDir',
                  rules: [{ required: true }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
                {
                  field: 'frontVben5OutputDir',
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
                {
                  field: 'frontSoyOutputDir',
                  rules: [{ required: false }, { min: 0, max: 255, message: '长度不能超过255' }],
                },
                {
                  field: 'frontVben5OutputDir',
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
        t('devOperation.developer.defGenTable.edit.helpMessage.genType[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.genType[1]'),
      ],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.outputDir'),
      field: 'outputDir',
      component: 'Input',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.outputDir')],
      ifShow: ({ values }) => {
        return values.genType === GenTypeEnum.GEN;
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.frontOutputDir'),
      field: 'frontOutputDir',
      component: 'Input',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.outputDir')],
      ifShow: ({ values }) => {
        return values.genType === GenTypeEnum.GEN;
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.frontSoyOutputDir'),
      field: 'frontSoyOutputDir',
      component: 'Input',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.outputDir')],
      ifShow: ({ values }) => {
        return values.genType === GenTypeEnum.GEN;
      },
    },
    {
      label: '前端（Vben5）生成路径',
      field: 'frontVben5OutputDir',
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
      label: t('devOperation.developer.defGenTable.edit.fronedInfo'),
    },
    {
      label: t('devOperation.developer.defGenTable.edit.plusApplicationName'),
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
        t('devOperation.developer.defGenTable.edit.helpMessage.plusApplicationName[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusApplicationName[1]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusApplicationName[2]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusApplicationName[3]'),
      ],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.plusModuleName'),
      field: 'plusModuleName',
      component: 'Input',
      colProps: {
        span: 12,
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.plusModuleName[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusModuleName[1]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusModuleName[2]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusModuleName[3]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.plusModuleName[4]'),
      ],
    },

    {
      label: t('devOperation.developer.defGenTable.edit.popupType'),
      field: 'popupType',
      component: 'ApiRadioGroup',
      componentProps: {
        ...enumComponentProps(DictEnum.PopupTypeEnum),
      },
      colProps: {
        span: 12,
      },
      defaultValue: PopupTypeEnum.MODAL,
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.popupType')],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.tplType'),
      field: 'tplType',
      component: 'ApiRadioGroup',
      componentProps: ({ formActionType }) => {
        return {
          ...enumComponentProps(DictEnum.TplEnum),
          onChange: async (value: string) => {
            const { updateSchema, setFieldsValue } = formActionType;

            createMessage.info(t('devOperation.developer.defGenTable.edit.helpMessage.tplType[0]'));
            if (value === TplEnum.TREE) {
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
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.tplType[1]')],
    },
    {
      label: t('devOperation.developer.defGenTable.edit.addShow'),
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
      label: t('devOperation.developer.defGenTable.edit.editShow'),
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
      label: t('devOperation.developer.defGenTable.edit.deleteShow'),
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
      label: t('devOperation.developer.defGenTable.edit.copyShow'),
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
      label: t('devOperation.developer.defGenTable.edit.viewShow'),
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
      label: t('devOperation.developer.defGenTable.edit.addAuth'),
      field: 'addAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.addShow;
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[1]') + ':add',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: t('devOperation.developer.defGenTable.generation'),
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'add');
          },
        };
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.editAuth'),
      field: 'editAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.editShow;
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[1]') + ':edit',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: t('devOperation.developer.defGenTable.generation'),
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'edit');
          },
        };
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.deleteAuth'),
      field: 'deleteAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.deleteShow;
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[1]') + ':delete',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: t('devOperation.developer.defGenTable.generation'),
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'delete');
          },
        };
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.copyAuth'),
      field: 'copyAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.copyShow;
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[1]') + ':copy',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: t('devOperation.developer.defGenTable.generation'),
          onSearch: (value: string) => {
            return getAuthCode(formActionType, value, 'copy');
          },
        };
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.viewAuth'),
      field: 'viewAuth',
      component: 'InputSearch',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.viewShow;
      },
      helpMessage: [
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[0]'),
        t('devOperation.developer.defGenTable.edit.helpMessage.auth[1]') + ':view',
      ],
      componentProps: ({ formActionType }) => {
        return {
          enterButton: t('devOperation.developer.defGenTable.generation'),
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
      label: t('devOperation.developer.defGenTable.edit.sqlInfo'),
    },
    {
      label: t('devOperation.developer.defGenTable.edit.menuApplicationId'),
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
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.menuApplicationId')],
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.menuParentId'),
      field: 'menuParentId',
      component: 'TreeSelect',
      componentProps: {
        fieldNames: { children: 'children', label: 'name', key: 'id', value: 'id' },
      },
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.menuParentId')],
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.menuName'),
      field: 'menuName',
      component: 'Input',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.menuName')],
      colProps: {
        span: 12,
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.menuIcon'),
      field: 'menuIcon',
      component: 'IconPicker',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.menuIcon')],
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
      label: t('devOperation.developer.defGenTable.edit.otherInfo'),
      ifShow: ({ values }) => {
        return [TplEnum.MAIN_SUB, TplEnum.TREE].includes(values.tplType);
      },
    },
    {
      label: t('devOperation.developer.defGenTable.edit.treeName'),
      field: 'treeName',
      component: 'Input',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.treeName')],
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
      label: t('devOperation.developer.defGenTable.edit.subId'),
      field: 'subId',
      component: 'ApiSelect',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.subId')],
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
      label: t('devOperation.developer.defGenTable.edit.subJavaFieldName'),
      field: 'subJavaFieldName',
      component: 'Input',
      helpMessage: [t('devOperation.developer.defGenTable.edit.helpMessage.subJavaFieldName')],
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
