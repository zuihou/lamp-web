<template>
  <BasicModal
    :maskClosable="false"
    :title="t(`common.title.edit`)"
    v-bind="$attrs"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <BasicForm @register="register" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { formSchema } from './data';
  import { Api, updateMobile } from '/@/api/lamp/profile/userInfo';
  import { sendSmsCode } from '/@/api/lamp/common/oauth';
  import { MsgTemplateCodeEnum } from '/@/enums/commonEnum';

  export default defineComponent({
    name: 'EditMobile',
    components: { BasicForm, BasicModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { t } = useI18n();

      async function handleSendCode() {
        try {
          const data = await validate(['mobile']);
          // templateCode 参数需要 提前在消息模板中配置
          await sendSmsCode(data.mobile, MsgTemplateCodeEnum.MOBILE_EDIT);
          return true;
        } catch (e) {
          return false;
        }
      }

      const [register, { validate, resetFields, setFieldsValue, updateSchema }] = useForm({
        name: 'mobileForm',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema(handleSendCode),
        actionColOptions: {
          span: 23,
        },
        baseColProps: { span: 24 },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (_) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        setFieldsValue({
          templateCode: MsgTemplateCodeEnum.MOBILE_EDIT,
        });
        getValidateRules(Api.UpdateMobile).then((rules) => {
          rules && rules.length > 0 && updateSchema(rules);
        });
      });

      async function handleSubmit() {
        try {
          const params = await validate();
          setModalProps({ confirmLoading: true });
          await updateMobile(params);

          createMessage.success(t(`common.tips.updateSuccess`));

          closeModal();
          emit('success');
        } catch (error) {
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { register, registerModal, resetFields, handleSubmit, t };
    },
  });
</script>
