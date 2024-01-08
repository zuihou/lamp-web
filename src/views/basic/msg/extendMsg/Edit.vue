<template>
  <PageWrapper class="high-form" contentBackground contentClass="p-4" title="发布消息">
    <BasicForm @register="registerForm" />
    <template #rightFooter>
      <a-button
        v-if="type !== ActionEnum.VIEW"
        class="ml-4"
        type="primary"
        @click="handleSubmit(true)"
      >
        暂存
      </a-button>
      <a-button
        v-if="type !== ActionEnum.VIEW"
        class="ml-4"
        type="primary"
        @click="handleSubmit(false)"
      >
        立即发送
      </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useLoading } from '/@/components/Loading';
  import { RouteEnum } from '/@/enums/biz/tenant';
  import { ActionEnum, VALIDATE_API } from '/@/enums/commonEnum';
  import { Api, get, publish } from '/@/api/basic/msg/extendMsg';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { customFormSchemaRules, editFormSchema } from './extendMsg.data';
  import { NoticeRemindModeEnum } from '/@/enums/biz/base';

  export default defineComponent({
    name: '发布消息',
    components: {
      BasicForm,
      PageWrapper,
    },
    emits: ['success', 'register'],
    setup(_) {
      const { t } = useI18n();
      const type = ref(ActionEnum.ADD);
      const { createMessage } = useMessage();
      const { replace, currentRoute } = useRouter();
      const { closeCurrent } = useTabs();

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: editFormSchema(type),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
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

        if ([ActionEnum.ADD, ActionEnum.EDIT, ActionEnum.COPY].includes(unref(type))) {
          let validateApi = Api[VALIDATE_API[unref(type)]];
          const rules = await getValidateRules(validateApi, customFormSchemaRules(type));
          rules && rules.length > 0 && (await updateSchema(rules));
        }
      };

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('common.requestingText'),
      });

      async function handleSubmit(draft = false) {
        try {
          const params = await validate();
          params.draft = draft;

          if(unref(type) === ActionEnum.COPY) {
            params.id = null;
          }

          openFullLoading();
          await publish(params);
          createMessage.success(t(`common.tips.${type.value}Success`));
          await closeCurrent();
          replace({ name: RouteEnum.BASIC_MSG });
        } finally {
          closeFullLoading();
        }
      }

      return { t, registerForm, type, handleSubmit, ActionEnum, NoticeRemindModeEnum };
    },
  });
</script>
