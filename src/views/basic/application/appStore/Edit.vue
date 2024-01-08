<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="30%"
    :maskClosable="false"
    :title="t(`common.title.${type}`)"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum, ServicePrefixEnum, FileBizTypeEnum } from '/@/enums/commonEnum';
  import { listByBizId } from '/@/api/lamp/file/upload';
  import { editFormSchema } from './defApplication.data';

  export default defineComponent({
    name: 'BasicApplicationEdit',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref<ActionEnum>(ActionEnum.VIEW);
      const [registerForm, { setFieldsValue, resetFields, resetSchema }] = useForm({
        labelWidth: 100,
        schemas: editFormSchema(type),
        showActionButtonGroup: false,
        disabled: true,
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetSchema(editFormSchema(type));
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        type.value = data?.type;

        // 赋值
        const record = { ...data?.record };
        const appendixIcons = await listByBizId({
          prefix: ServicePrefixEnum.TENANT,
          bizId: record.id,
          isDef: true,
          bizType: FileBizTypeEnum.DEF_APPLICATION_LOGO,
        });
        record.appendixIcon = appendixIcons?.[0];
        await setFieldsValue(record);
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { t, registerDrawer, registerForm, type, handleSubmit };
    },
  });
</script>
