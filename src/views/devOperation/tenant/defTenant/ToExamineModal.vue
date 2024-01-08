<template>
  <BasicModal
    v-bind="$attrs"
    okText="绑定"
    @register="registerModal"
    title="审核"
    @ok="handleSubmit"
    :maskClosable="false"
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
  import { toExamineFormSchema } from './tenant.data';
  import { updateStatus } from '/@/api/devOperation/tenant/tenant';
  import { TenantStatusEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    name: 'ToExamineModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createSuccessModal, createWarningModal } = useMessage();
      const [registerForm, { setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: toExamineFormSchema(),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
        baseColProps: { span: 24 },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });

        const record = { ...data?.record };
        record.status = '';
        await setFieldsValue(record);
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          const params = await validate();

          await updateStatus(params);

          if (params.status === TenantStatusEnum.AGREED) {
            createSuccessModal({
              title: '审核成功',
              content: `请执行以下操作,使用户能正常使用系统： <br/> 1. 初始化数据源 <br/> 2. 手动绑定用户【${params?.createdName}】为租户管理员`,
            });
          } else {
            createWarningModal({ title: '拒绝成功' });
          }

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
