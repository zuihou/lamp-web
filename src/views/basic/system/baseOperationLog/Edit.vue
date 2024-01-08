<template>
  <BasicDrawer
    :maskClosable="false"
    :title="t(`common.title.${type}`)"
    showFooter
    v-bind="$attrs"
    width="30%"
    @ok="handleSubmit"
    @register="registerDrawer"
  >
    <BasicForm @register="registerForm">
      <template #exDetail="{ model, field }">
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
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { detail } from '/@/api/basic/system/baseOperationLog';
  import { editFormSchema } from './baseOperationLog.data';
  import { Codemirror } from 'vue-codemirror';
  import { java } from '@codemirror/lang-java';
  import { oneDark } from '@codemirror/theme-one-dark';

  export default defineComponent({
    name: 'BaseOperationLogEdit',
    components: { BasicDrawer, BasicForm, Codemirror },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref<ActionEnum>(ActionEnum.VIEW);
      const logExtensions = [java(), oneDark];

      const [registerForm, { setFieldsValue, resetFields }] = useForm({
        labelWidth: 100,
        schemas: editFormSchema(type),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });
        await resetFields();
        type.value = data?.type || ActionEnum.ADD;

        const result = await detail(data?.record?.id);

        // 赋值
        await setFieldsValue(result);
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

      return { logExtensions, type, t, registerDrawer, registerForm, handleSubmit };
    },
  });
</script>
