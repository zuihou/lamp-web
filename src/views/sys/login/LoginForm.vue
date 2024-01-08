<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    v-show="getShow"
    ref="formRef"
    :model="formData"
    :rules="getFormRules"
    class="p-4 enter-x"
    @keypress.enter="handleLogin"
  >
    <FormItem name="grantType">
      <Input v-model:value="formData.grantType" :hidden="true" size="large" />
    </FormItem>
    <FormItem name="key">
      <Input v-model:value="formData.key" :hidden="true" size="large" />
    </FormItem>
    <FormItem class="enter-x" name="username">
      <Input
        v-model:value="formData.username"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
        size="large"
      />
    </FormItem>
    <FormItem class="enter-x" name="password">
      <InputPassword
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
        autocomplete="off"
        size="large"
        visibilityToggle
      />
    </FormItem>

    <ARow v-show="formState.showCaptcha" class="enter-x">
      <ACol>
        <FormItem class="code-input" name="code">
          <Input
            v-model:value="formData.code"
            :placeholder="t('sys.login.captcha')"
            size="large"
            visibilityToggle
          />
        </FormItem>

        <img
          v-if="formState.captchaSrc"
          :src="formState.captchaSrc"
          alt="captcha"
          class="code-image"
          @click="buildCaptcha"
        />
        <img
          v-else
          alt="captcha"
          class="code-image"
          src="../../../assets/images/captcha_404.png"
          @click="buildCaptcha"
        />
      </ACol>
    </ARow>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button size="small" type="link" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button :loading="formState.loading" block size="large" type="primary" @click="handleLogin">
        {{ t('sys.login.loginButton') }} {{ devFlag }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER_EMAIL)">邮箱注册</Button>
      </ACol>
      <ACol :md="6" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">手机注册</Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div :class="`${prefixCls}-sign-in-way`" class="flex justify-evenly enter-x">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>
  </Form>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, toRaw, unref } from 'vue';
  import { isDevMode } from '/@/utils/env';

  import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'ant-design-vue';
  import {
    AlipayCircleFilled,
    GithubFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
    WechatFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { randomNum } from '/@/utils';
  import { MultiTenantTypeEnum } from '/@/enums/biz/tenant';

  import { loadCaptcha } from '/@/api/lamp/common/oauth';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const globSetting = useGlobSetting();
  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const rememberMe = ref(false);
  const devFlag = ref<string>('');

  if (isDevMode()) {
    devFlag.value = '(dev)';
  }
  onMounted(() => {
    buildCaptcha();
  });

  const formData = reactive({
    username: '',
    password: '',
    code: '',
    grantType: globSetting.showCaptcha === 'true' ? 'CAPTCHA' : 'PASSWORD',
    key: randomNum(24, 16),
  });
  const formState = reactive({
    loading: false,
    captchaSrc: '',
    isMultiTenant: globSetting.multiTenantType !== MultiTenantTypeEnum.NONE,
    showCaptcha: globSetting.showCaptcha === 'true',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  // 生成验证码
  async function buildCaptcha() {
    try {
      formData.code = '';

      const res = await loadCaptcha(formData.key).catch((e) => {
        const { createMessage } = useMessage();
        if (e.toString().indexOf('429') !== -1) {
          createMessage.error('获取验证码过于频繁，请1分钟后再试');
        } else {
          createMessage.error('加载验证码失败');
        }
        formState.captchaSrc = '';
      });
      if (res.byteLength <= 100) {
        const { createMessage } = useMessage();
        createMessage.error('系统维护中，请稍微再试~');
        return '';
      }
      formState.captchaSrc =
        'data:image/png;base64,' +
        btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    } catch (error) {
      console.error(error);
      formState.captchaSrc = '';
      return '';
    }
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      formState.loading = true;
      const userInfo = await userStore.login(toRaw(data));
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}`,
          duration: 3,
        });
      } else {
        await buildCaptcha();
      }
    } catch (error) {
      await buildCaptcha();
    } finally {
      formState.loading = false;
    }
  }
</script>
