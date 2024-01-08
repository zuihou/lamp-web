<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="50%"
    :maskClosable="false"
    :title="t(`common.title.${type}`)"
    @ok="handleSubmit"
  >
    <CollapseContainer title="员工信息">
      <BasicForm @register="registerForm" />
    </CollapseContainer>
    <CollapseContainer title="用户信息" v-if="type === ActionEnum.VIEW">
      <BasicForm @register="registerUserForm" />
    </CollapseContainer>
  </BasicDrawer>
</template>
<script lang="ts">
import {defineComponent, ref, unref} from 'vue';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
import {BasicForm, useForm} from '/@/components/Form/index';
import {useI18n} from '/@/hooks/web/useI18n';
import {useMessage} from '/@/hooks/web/useMessage';
import {CollapseContainer} from '/@/components/Container/index';
import {ActionEnum, DictEnum, VALIDATE_API} from '/@/enums/commonEnum';
import {Api, get, save, update} from '/@/api/basic/user/baseEmployee';
import {getValidateRules} from '/@/api/lamp/common/formValidateService';
import {customFormSchemaRules, editFormSchema, userEditFormSchema} from './baseEmployee.data';

export default defineComponent({
    name: 'BaseEmployeeEdit',
    components: { BasicDrawer, BasicForm, CollapseContainer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref<ActionEnum>(ActionEnum.ADD);
      const { createMessage } = useMessage();
      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate, resetSchema }] =
        useForm({
          labelWidth: 100,
          schemas: editFormSchema(type),
          showActionButtonGroup: false,
          baseColProps: { span: 24 },
          actionColOptions: {
            span: 23,
          },
        });

      const [
        registerUserForm,
        { setFieldsValue: setFieldsValueByUser, resetFields: resetFieldsByUser },
      ] = useForm({
        labelWidth: 100,
        schemas: userEditFormSchema(type),
        disabled: true,
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });
        await resetSchema(editFormSchema(type));
        await resetFields();
        if (unref(type) === ActionEnum.VIEW) {
          await resetFieldsByUser();
        }
        type.value = data?.type || ActionEnum.ADD;

        if (unref(type) !== ActionEnum.ADD) {
          if (unref(type) === ActionEnum.VIEW) {
            const record = await get(data.record.id);
            await setFieldsValue(record);
            await setFieldsValueByUser(record.defUser);
          } else {
            const record = { ...data.record };
            await setFieldsValue(record);
          }
        }

        if (unref(type) !== ActionEnum.VIEW) {
          let validateApi = Api[VALIDATE_API[unref(type)]];
          await getValidateRules(validateApi, customFormSchemaRules(type)).then(async (rules) => {
            rules && rules.length > 0 && (await updateSchema(rules));
          });
        }
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });

          if (unref(type) !== ActionEnum.VIEW) {
            const params = await validate();

            if (unref(type) === ActionEnum.EDIT) {
              await update(params);
            } else {
              params.id = null;
              await save(params);
            }
            createMessage.success(t(`common.tips.${type.value}Success`));
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { type, t, DictEnum, ActionEnum, registerDrawer, registerForm, handleSubmit, registerUserForm };
    },
  });
</script>
