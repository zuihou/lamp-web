<template>
  <BasicModal
    v-bind="$attrs"
    defaultFullscreen
    @register="registerModal"
    :title="t(`common.title.${type}`)"
    :maskClosable="false"
    :showOkBtn="false"
    :keyboard="true"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { get } from '/@/api/basic/msg/extendNotice';
  import { editFormSchema } from './extendNotice.data';

  export default defineComponent({
    name: 'DatasourceConfigEdit',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_) {
      const { t } = useI18n();
      const type = ref(ActionEnum.ADD);
      const [registerForm, { setFieldsValue, resetFields }] = useForm({
        labelWidth: 100,
        disabled: true,
        schemas: editFormSchema(),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
        baseColProps: { span: 24 },
      });

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        load({ type: ActionEnum.VIEW, id: data?.id });
      });

      const load = async (data: Recordable) => {
        type.value = data?.type;
        await resetFields();

        if (![ActionEnum.ADD].includes(unref(type))) {
          const record = await get(data?.id);
          await setFieldsValue({ ...record });
        }
      };

      return { t, type, registerModal, registerForm };
    },
  });
</script>
