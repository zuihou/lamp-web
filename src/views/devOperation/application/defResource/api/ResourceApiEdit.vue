<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="录入接口"
    :maskClosable="false"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { editResourceApiFormSchema } from './defResourceApi.data';

  export default defineComponent({
    name: 'DefResourceApiEdit',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: editResourceApiFormSchema(),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false, minHeight: 300 });

        await setFieldsValue({
          ...data.record,
        });
      });

      async function handleSubmit() {
        try {
          const params = await validate();
          setModalProps({ confirmLoading: true });
          params.isInput = true;
          closeModal();
          emit('success', params);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { t, registerModal, registerForm, handleSubmit };
    },
  });
</script>
