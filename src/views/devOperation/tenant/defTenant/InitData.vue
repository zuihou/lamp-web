<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="30%"
    :maskClosable="false"
    title="初始化租户数据库表结构和初始数据"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TenantConnectTypeEnum } from '/@/enums/biz/tenant';

  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { Api, initData } from '/@/api/devOperation/tenant/tenant';
  import { initDataFormSchema, customInitDataFormSchemaRules } from './tenant.data';

  export default defineComponent({
    name: 'TenantInitData',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();

      const onChange = (e: ChangeEvent) => {
        let required = false;
        if (e.target?.value === TenantConnectTypeEnum.CUSTOM) {
          required = true;
        } else {
          clearValidate();
        }
        updateSchema(customInitDataFormSchemaRules(required));
      };

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate, clearValidate }] =
        useForm({
          labelWidth: 120,
          schemas: initDataFormSchema(onChange),
          showActionButtonGroup: false,
          actionColOptions: {
            span: 23,
          },
          baseColProps: { span: 24 },
        });

      const [registerDrawer, { setModalProps, closeModal, changeLoading }] = useModalInner(
        async (data) => {
          changeLoading(true);
          try {
            await resetFields();
            setModalProps({ confirmLoading: false });

            const record = { ...data.record };

            await setFieldsValue({
              ...record,
            });

            await getValidateRules(Api.InitData).then(async (rules) => {
              rules && rules.length > 0 && (await updateSchema(rules));
            });
          } finally {
            changeLoading(false);
          }
        },
      );

      async function handleSubmit() {
        try {
          const params = await validate();
          setModalProps({ confirmLoading: true });
          let flag = await initData(params);
          if (flag) {
            createMessage.success('初始化数据库、表结构、默认数据成功，请尽快初始化各个服务的链接');
            closeModal();
            emit('success');
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, handleSubmit };
    },
  });
</script>
