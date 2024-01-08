<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="调试上传"
    :maskClosable="false"
    @ok="handleSubmit"
    :showCancelBtn="false"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum, FileBizTypeEnum } from '/@/enums/commonEnum';

  import { editFormSchema } from './baseFile.data';

  export default defineComponent({
    name: 'FileEdit',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref(ActionEnum.ADD);
      const { createMessage } = useMessage();
      const param = reactive<Recordable>({
        bizType: FileBizTypeEnum.BASE_FILE,
        bucket: 'dev',
        storageType: 'MIN_IO',
      });
      const [registerForm, { resetFields }] = useForm({
        labelWidth: 100,
        schemas: editFormSchema(param),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        await resetFields();
        setModalProps({ confirmLoading: false });
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });

          createMessage.success(t(`common.tips.${type.value}Success`));
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { t, type, registerModal, registerForm, handleSubmit };
    },
  });
</script>
