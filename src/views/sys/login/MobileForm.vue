<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form ref="formRef" :model="formData" :rules="getFormRules" class="p-4 enter-x">
      <FormItem name="grantType">
        <Input v-model:value="formData.grantType" :hidden="true" size="large" />
      </FormItem>
      <FormItem class="enter-x" name="mobile">
        <Input
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
          size="large"
        />
      </FormItem>
      <FormItem class="enter-x" name="code">
        <CountdownInput
          v-model:value="formData.code"
          :placeholder="t('sys.login.smsCode')"
          :sendCodeApi="handleSendCode"
          class="fix-auto-fill"
          size="large"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button :loading="loading" block size="large" type="primary" @click="handleLogin">
          {{ t('sys.login.loginButton') }}
        </Button>
        <Button block class="mt-4" size="large" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref, toRaw, unref } from 'vue';
  import { Button, Form, Input } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useFormValid, useLoginState } from './useLogin';
  import { sendSmsCode } from '/@/api/lamp/common/oauth';
  import { MsgTemplateCodeEnum } from '/@/enums/commonEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const FormItem = Form.Item;
  const { t } = useI18n();
  const userStore = useUserStore();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { notification } = useMessage();
  const getFormRules = {
    code: {
      required: true,
      message: '请填写验证码',
      trigger: 'change',
    },
    mobile: {
      required: true,
      message: '请填写手机号',
      trigger: 'change',
    },
  };

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    mobile: '',
    grantType: 'MOBILE',
    code: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

  async function handleSendCode() {
    const form = unref(formRef);
    try {
      const data = await form.validateFields(['mobile']);
      // templateCode 参数需要 提前在消息模板中配置
      await sendSmsCode(data.mobile, MsgTemplateCodeEnum.MOBILE_LOGIN);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login(toRaw(data));
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}`,
          duration: 3,
        });
      }
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }
</script>
