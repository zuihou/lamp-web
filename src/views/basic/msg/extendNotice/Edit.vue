<template>
  <PageWrapper class="high-form" contentBackground contentClass="p-4" title="查看消息">
    <BasicForm @register="registerForm" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { get } from '/@/api/basic/msg/extendNotice';
  import { editFormSchema } from './extendNotice.data';
  import { NoticeRemindModeEnum } from '/@/enums/biz/base';

  export default defineComponent({
    name: '查看我的消息',
    components: {
      BasicForm,
      PageWrapper,
    },
    emits: ['success', 'register'],
    setup(_) {
      const { t } = useI18n();
      const type = ref(ActionEnum.ADD);
      const { currentRoute } = useRouter();

      const [registerForm, { setFieldsValue, resetFields }] = useForm({
        labelWidth: 100,
        schemas: editFormSchema(type),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        disabled: true,
        actionColOptions: {
          span: 23,
        },
      });

      onMounted(() => {
        const { params } = currentRoute.value;
        const id = params.id;
        load({ type: params?.type, id });
      });

      const load = async (data: Recordable) => {
        await resetFields();
        type.value = data?.type;

        if (![ActionEnum.ADD].includes(unref(type))) {
          const record = await get(data?.id);
          await setFieldsValue({ ...record });
        }
      };

      return { t, registerForm, type, ActionEnum, NoticeRemindModeEnum };
    },
  });
</script>
