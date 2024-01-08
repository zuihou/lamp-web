<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t(`common.title.edit`)"
    :maskClosable="false"
    @ok="handleSubmit"
  >
    <BasicForm @register="register" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { formSchema } from './pwd.data';
  import { Api, updatePassword } from '/@/api/lamp/profile/userInfo';

  export default defineComponent({
    name: 'Password',
    components: { BasicForm, BasicModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { t } = useI18n();
      const userStore = useUserStore();

      const [register, { validate, resetFields, updateSchema }] = useForm({
        name: 'passwordForm',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
        actionColOptions: {
          span: 23,
        },
        baseColProps: { span: 24 },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (_) => {
        await resetFields();
        setModalProps({ confirmLoading: false });

        getValidateRules(Api.UpdatePassword).then((rules) => {
          rules && rules.length > 0 && updateSchema(rules);
        });
      });

      async function handleSubmit() {
        try {
          const params = await validate();
          setModalProps({ confirmLoading: true });
          const { id } = userStore.getUserInfo;
          params.id = id;
          await updatePassword(params);

          createMessage.success(t(`common.tips.updateSuccess`));

          closeModal();
          emit('success');
        } catch (error) {
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { register, registerModal, resetFields, handleSubmit, t };
    },
  });
</script>
