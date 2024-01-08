<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    width="70%"
    :keyboard="true"
    :maskClosable="true"
    title="邀请用户"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />

    <Form v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }">
      <FormItem name="query" :wrapper-col="{ span: 24, offset: 11 }">
        <a-button type="primary" @click="handleQuery"> 查询 </a-button>
      </FormItem>
      <FormItem name="userIdList" label="待邀请用户" v-if="userListRef && userListRef.length > 0">
        <Select style="width: 300px" v-model:value="userIdRef">
          <SelectOption :value="item.id" v-for="(item, index) in userListRef" :key="index">
            {{ item.nickName }} - {{ item.mobile }}
          </SelectOption>
        </Select>
      </FormItem>
    </Form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Select, Form } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { invitationUser } from '/@/api/basic/user/baseEmployee';
  import { DefUserResultVO } from '/@/api/devOperation/tenant/model/defUserModel';
  import { queryUser } from '/@/api/devOperation/tenant/defUser';
  import { invitationUserFormSchema } from './baseEmployee.data';

  export default defineComponent({
    name: 'InvitationUser',
    components: {
      BasicModal,
      BasicForm,
      Select,
      SelectOption: Select.Option,
      Form,
      FormItem: Form.Item,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const userIdRef = ref<string>('');
      const userListRef = ref<DefUserResultVO[]>([]);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, validate, resetSchema }] = useForm({
        labelWidth: 100,
        schemas: invitationUserFormSchema(),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        setModalProps({ confirmLoading: false });
        await resetSchema(invitationUserFormSchema());
        await resetFields();

        userIdRef.value = '';
        userListRef.value = [];
      });

      async function handleQuery() {
        const params = await validate();
        const userList = await queryUser(params);
        userIdRef.value = '';
        userListRef.value = userList;
      }

      async function handleSubmit() {
        try {
          if (!userIdRef.value) {
            createMessage.warn('请选择待邀请用户');
            return;
          }
          setModalProps({ confirmLoading: true });
          const params = {
            userIdList: [userIdRef.value],
            isBind: true,
          };
          await invitationUser(params);
          createMessage.success('邀请成功');

          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        t,
        registerModal,
        registerForm,
        handleSubmit,
        handleQuery,
        userListRef,
        userIdRef,
      };
    },
  });
</script>
