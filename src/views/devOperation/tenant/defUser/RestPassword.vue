<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="重置密码"
    :maskClosable="false"
    @ok="handleSubmit"
    :keyboard="true"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { Api, resetPassword } from '/@/api/devOperation/tenant/defUser';
  import { restPasswordFormSchema, restPasswordFormSchemaRules } from './defUser.data';

  export default defineComponent({
    name: '重置密码',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();

      const { createMessage } = useMessage();
      const [
        registerForm,
        { setFieldsValue, getFieldsValue, resetFields, updateSchema, validate, resetSchema },
      ] = useForm({
        labelWidth: 140,
        schemas: restPasswordFormSchema(),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
        baseColProps: { span: 24 },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetSchema(restPasswordFormSchema());
        await resetFields();
        setModalProps({ confirmLoading: false });

        // 赋值
        const record = { ...data?.record };
        await setFieldsValue(record);

        let validateApi = Api.ResetPassword;
        await getValidateRules(validateApi, restPasswordFormSchemaRules(getFieldsValue)).then(
          async (rules) => {
            rules && rules.length > 0 && (await updateSchema(rules));
          },
        );
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          const params = await validate();

          await resetPassword(params);

          createMessage.success('重置密码成功');

          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { t, registerModal, registerForm, handleSubmit };
    },
  });
</script>
