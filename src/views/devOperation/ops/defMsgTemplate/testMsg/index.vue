<template>
  <BasicModal
    v-bind="$attrs"
    width="800px"
    @register="registerModel"
    title="测试发送消息"
    :maskClosable="false"
    @ok="handleSubmit"
    :keyboard="true"
  >
    <BasicForm @register="registerForm">
      <template #paramList="{ model, field }">
        <ParamTable ref="paramListRef" v-model:value="model[field]" />
      </template>
      <template #recipientList="{ model, field }">
        <RecipientTable ref="recipientListRef" v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Api, sendByTemplate } from '/@/api/basic/msg/extendMsg';
  import { detail } from '/@/api/devOperation/ops/defMsgTemplate';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { reverse } from 'lodash-es';
  import { editFormSchema, customFormSchemaRules } from './data';
  import ParamTable from './ParamTable.vue';
  import RecipientTable from './RecipientTable.vue';

  export default defineComponent({
    name: '测试消息',
    components: { BasicModal, BasicForm, ParamTable, RecipientTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const paramListRef = ref();
      const recipientListRef = ref();
      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate, resetSchema }] =
        useForm({
          name: 'DefMsgTemplateEdit',
          labelWidth: 100,
          schemas: editFormSchema(),
          showActionButtonGroup: false,
          baseColProps: { span: 24 },
          actionColOptions: {
            span: 23,
          },
        });

      const [registerModel, { setModalProps: setProps, closeModal: close }] = useModalInner(
        async (data) => {
          setProps({ confirmLoading: false });
          await resetSchema(editFormSchema());
          await resetFields();

          const row = await detail(data.record?.id);

          // 赋值
          const record = { ...row };

          record.templateCode = row.code;
          await setFieldsValue(record);

          if (row.param) {
            let paramList = [];
            try {
              paramList = JSON.parse(row.param);
            } catch (e) {}

            record.paramList = paramList;
          } else {
            record.paramList = [];
          }
          unref(paramListRef).initData(record.paramList);
          unref(recipientListRef).initData();

          let validateApi = Api.SendByTemplate;
          await getValidateRules(validateApi, customFormSchemaRules()).then(async (rules) => {
            rules && rules.length > 0 && (await updateSchema(rules));
          });
        },
      );

      async function handleSubmit() {
        try {
          const params = await validate();
          setProps({ confirmLoading: true });
          params.paramList = reverse(params.paramList);
          params.recipientList = reverse(params.recipientList);
          console.log(params);

          await sendByTemplate(params);
          createMessage.success('发送成功');
          close();
          emit('success');
        } finally {
          setProps({ confirmLoading: false });
        }
      }

      return {
        t,
        paramListRef,
        recipientListRef,
        registerModel,
        registerForm,
        handleSubmit,
      };
    },
  });
</script>
