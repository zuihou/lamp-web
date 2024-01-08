<template>
  <BasicModal
    :keyboard="true"
    :maskClosable="false"
    :title="t(`common.title.${type}`)"
    v-bind="$attrs"
    @ok="handleSubmit"
    @register="registerModel"
  >
    <BasicForm @register="registerForm">
      <template #errorMsg="{ model, field }">
        <codemirror
          v-model="model[field]"
          :autofocus="true"
          :extensions="logExtensions"
          :indent-with-tab="true"
          :style="{ height: '200px' }"
          :tab-size="2"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { editFormSchema } from './defInterfaceLogging.data';
  import { Codemirror } from 'vue-codemirror';
  import { java } from '@codemirror/lang-java';
  import { oneDark } from '@codemirror/theme-one-dark';

  export default defineComponent({
    name: '编辑接口执行日志记录维护',
    components: { BasicModal, BasicForm, Codemirror },
    emits: ['success', 'register'],
    setup() {
      const { t } = useI18n();
      const type = ref<ActionEnum>(ActionEnum.ADD);
      const logExtensions = [java(), oneDark];
      const [registerForm, { setFieldsValue, resetFields, resetSchema }] = useForm({
        name: 'DefInterfaceLoggingEdit',
        labelWidth: 100,
        schemas: editFormSchema(type),
        showActionButtonGroup: false,
        // disabled: (_) => {
        //   return unref(type) === ActionEnum.VIEW;
        // },
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModel, { setModalProps: setProps, closeModal: close }] = useModalInner(
        async (data) => {
          setProps({ confirmLoading: false });
          await resetSchema(editFormSchema(type));
          await resetFields();
          type.value = data?.type || ActionEnum.ADD;

          // 赋值
          const record = { ...data?.record };
          await setFieldsValue(record);
        },
      );

      async function handleSubmit() {
        close();
      }

      return { type, t, logExtensions, registerModel, registerForm, handleSubmit };
    },
  });
</script>
