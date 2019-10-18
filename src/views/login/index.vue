<template>
  <div class="login-container">
    <div class="login-info">
      <div class="title">FEBS Cloud</div>
      <div class="sub-title">{{ $t('common.system') }}</div>
      <div class="desc">1. {{ $t('common.desc.a') }}</div>
      <div class="desc">2. {{ $t('common.desc.b') }}</div>
      <div class="desc">3. {{ $t('common.desc.c') }}</div>
      <div class="desc">4. {{ $t('common.desc.d') }}</div>
      <div class="desc">5. {{ $t('common.desc.e') }}</div>
      <div class="desc">6. {{ $t('common.desc.f') }}</div>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" autocomplete="off" label-position="left">
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <lang-select class="set-language" />
      </div>
      <span v-if="login.type === 'up'">
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            prefix-icon="el-icon-user"
            name="username"
            type="text"
            autocomplete="off"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-key"
            type="password"
            :placeholder="$t('login.password')"
            name="password"
            autocomplete="off"
            :show-password="true"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="code" class="code-input">
          <el-input
            ref="code"
            v-model="loginForm.code"
            prefix-icon="el-icon-lock"
            :placeholder="$t('login.code')"
            name="code"
            type="text"
            autocomplete="off"
            style="width: 70%"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <img :src="imageCode" alt="codeImage" class="code-image" @click="getCodeImage">
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:14px;" @click.native.prevent="handleLogin">
          {{ $t('login.logIn') }}
        </el-button>
      </span>
      <span v-if="login.type === 'social'">
        {{ $t('login.chooseToSignIn') }}
        <div>
          <template v-for="(l, index) in logo">
            <div :key="index" class="logo-wrapper">
              <img :src="resolveLogo(l.img)" alt="" :class="{ 'radius': l.radius }" @click="socialLogin(l.name)">
            </div>
          </template>
        </div>
      </span>
      <span v-if="login.type === 'bind'" style="margin-top: -1rem">
        <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('common.bindLogin')" name="bindLogin">
            <el-form-item prop="bindUsername">
              <el-input
                ref="bindUsername"
                v-model="loginForm.bindUsername"
                :placeholder="$t('login.username')"
                prefix-icon="el-icon-user"
                name="bindUsername"
                type="text"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item prop="bindPassword">
              <el-input
                ref="bindPassword"
                v-model="loginForm.bindPassword"
                :placeholder="$t('login.password')"
                prefix-icon="el-icon-key"
                name="bindPassword"
                type="password"
                :show-password="true"
                autocomplete="off"
              />
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:14px;" @click.native.prevent="bindLogin">
              {{ $t('common.bindLogin') }}
            </el-button>
          </el-tab-pane>
          <el-tab-pane :label="$t('common.signLogin')" name="signLogin">
            <el-form-item prop="signUsername">
              <el-input
                ref="signUsername"
                v-model="loginForm.signUsername"
                :placeholder="$t('login.username')"
                prefix-icon="el-icon-user"
                name="signUsername"
                type="text"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item prop="signPassword">
              <el-input
                ref="signPassword"
                v-model="loginForm.signPassword"
                :placeholder="$t('login.password')"
                prefix-icon="el-icon-key"
                name="signPassword"
                type="password"
                :show-password="true"
                autocomplete="off"
              />
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:14px;" @click.native.prevent="signLogin">
              {{ $t('common.signLogin') }}
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </span>
      <el-dropdown class="login-type" placement="top-end">
        <span class="el-dropdown-link">
          <el-link type="primary">{{ $t('login.ortherLoginType') }}</el-link>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="login.type === 'up'" @click.native="login.type = 'up'">{{ $t('login.type.up') }}</el-dropdown-item>
          <el-dropdown-item :disabled="login.type === 'social'" @click.native="login.type = 'social'">{{ $t('login.type.social') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form>
    <span class="login-footer">
      © 2019 <a target="_blank" href="https://mrbird.cc">MrBird</a> - FEBS
    </span>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import db from '@/utils/localstorage'
import { randomNum } from '@/utils'
import { socialLoginUrl, captchaUrl } from '@/settings'
import axios from 'axios'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    return {
      tabActiveName: 'bindLogin',
      login: {
        type: 'up'
      },
      logo: [
        { img: 'gitee.png', name: 'gitee', radius: true },
        { img: 'github.png', name: 'github', radius: true },
        { img: 'tencent_cloud.png', name: 'tencent_cloud', radius: true },
        { img: 'qq.png', name: 'qq', radius: false },
        { img: 'dingtalk.png', name: 'dingtalk', radius: true },
        { img: 'microsoft.png', name: 'microsoft', radius: false }
      ],
      loginForm: {
        username: '',
        password: '',
        bindUsername: '',
        bindPassword: '',
        signUsername: '',
        signPassword: ''
      },
      rules: {
        username: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        password: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        code: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        bindUsername: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        bindPassword: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        signUsername: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        signPassword: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('rules.range6to20'), trigger: 'blur' }
        ]
      },
      authUser: null,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      randomId: randomNum(24, 16),
      imageCode: '',
      page: {
        width: window.screen.width * 0.5,
        height: window.screen.height * 0.5
      }
    }
  },
  mounted() {
    db.clear()
    this.getCodeImage()
  },
  destroyed() {
    window.removeEventListener('message', this.resolveSocialLogin)
  },
  methods: {
    getCodeImage() {
      axios({
        method: 'GET',
        url: `${captchaUrl}?key=${this.randomId}`,
        responseType: 'arraybuffer'
      }).then(res => {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then((res) => {
        this.imageCode = res
      }).catch((e) => {
        if (e.toString().indexOf('429') !== -1) {
          this.$message({
            message: this.$t('tips.tooManyRequest'),
            type: 'error'
          })
        } else {
          this.$message({
            message: this.$t('tips.getCodeImageFailed'),
            type: 'error'
          })
        }
      })
    },
    handleTabClick(tab, event) {
      this.tabActiveName = tab.name
    },
    resolveLogo(logo) {
      return require(`@/assets/logo/${logo}`)
    },
    socialLogin(oauthType) {
      const url = `${socialLoginUrl}/${oauthType}/login`
      window.open(url, 'newWindow', `resizable=yes, height=${this.page.height}, width=${this.page.width}, top=10%, left=10%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`)
      window.addEventListener('message', this.resolveSocialLogin, false)
    },
    resolveSocialLogin(e) {
      const data = e.data
      const that = this
      if (data.message === 'not_bind') {
        that.login.type = 'bind'
        const authUser = data.data
        that.authUser = authUser
        that.$confirm(that.$t('common.current') + authUser.source + that.$t('common.socialAccount') + authUser.nickname + that.$t('common.socialTips'), that.$t('common.tips'), {
          confirmButtonText: that.$t('common.signLogin'),
          cancelButtonText: that.$t('common.bindLogin'),
          type: 'warning'
        }).then(() => {
          that.tabActiveName = 'signLogin'
        }).catch(() => {
          that.tabActiveName = 'bindLogin'
        })
      } else if (data.message === 'social_login_success') {
        that.saveLoginData(data.data)
        that.getUserDetailInfo()
        that.loginSuccessCallback(data.username)
      } else {
        // do nothing
      }
    },
    bindLogin() {
      let username_c = false
      let password_c = false
      this.$refs.loginForm.validateField('bindUsername', e => { if (!e) { username_c = true } })
      this.$refs.loginForm.validateField('bindPassword', e => { if (!e) { password_c = true } })
      if (username_c && password_c) {
        this.loading = true
        const that = this
        const params = {
          bindUsername: that.loginForm.bindUsername,
          bindPassword: that.loginForm.bindPassword,
          ...that.authUser
        }
        params.token = null
        that.$post('auth/social/bind/login', params).then((r) => {
          const data = r.data.data
          this.saveLoginData(data)
          this.getUserDetailInfo()
          this.loginSuccessCallback(that.loginForm.bindUsername)
        }).catch((error) => {
          console.error(error)
          that.loading = false
        })
      }
    },
    signLogin() {
      let username_c = false
      let password_c = false
      this.$refs.loginForm.validateField('signUsername', e => { if (!e) { username_c = true } })
      this.$refs.loginForm.validateField('signPassword', e => { if (!e) { password_c = true } })
      if (username_c && password_c) {
        this.loading = true
        const that = this
        const params = {
          bindUsername: that.loginForm.signUsername,
          bindPassword: that.loginForm.signPassword,
          ...that.authUser
        }
        params.token = null
        that.$post('auth/social/sign/login', params).then((r) => {
          const data = r.data.data
          this.saveLoginData(data)
          this.getUserDetailInfo()
          this.loginSuccessCallback(that.loginForm.signUsername)
        }).catch((error) => {
          console.error(error)
          that.loading = false
        })
      }
    },
    handleLogin() {
      let username_c = false
      let password_c = false
      let code_c = false
      this.$refs.loginForm.validateField('username', e => { if (!e) { username_c = true } })
      this.$refs.loginForm.validateField('password', e => { if (!e) { password_c = true } })
      this.$refs.loginForm.validateField('code', e => { if (!e) { code_c = true } })
      if (username_c && password_c && code_c) {
        this.loading = true
        const that = this
        this.$login('auth/oauth/token', {
          ...that.loginForm,
          key: this.randomId
        }).then((r) => {
          const data = r.data
          this.saveLoginData(data)
          this.getUserDetailInfo()
          this.loginSuccessCallback(that.loginForm.username)
        }).catch((error) => {
          console.error(error)
          that.loading = false
          that.getCodeImage()
        })
      }
    },
    saveLoginData(data) {
      this.$store.commit('account/setAccessToken', data.access_token)
      this.$store.commit('account/setRefreshToken', data.refresh_token)
      const current = new Date()
      const expireTime = current.setTime(current.getTime() + 1000 * data.expires_in)
      this.$store.commit('account/setExpireTime', expireTime)
    },
    getUserDetailInfo() {
      this.$get('auth/user').then((r) => {
        this.$store.commit('account/setUser', r.data.principal)
        this.$message({
          message: this.$t('tips.loginSuccess'),
          type: 'success'
        })
        this.loading = false
        this.$router.push('/')
      }).catch((error) => {
        this.$message({
          message: this.$t('tips.loginFail'),
          type: 'error'
        })
        console.error(error)
        this.loading = false
      })
    },
    loginSuccessCallback(username) {
      this.$get(`system/user/success/${username}`).catch((e) => { console.log(e) })
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #555;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      color: #000000;
      height: 28px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dedede;
    border-radius: 2px;
    color: #454545;
    transition: all .3s;
    &:hover {
      border-color: #57a3f3;
    }
  }
}
</style>
<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#aaa;
$light_gray:#eee;

.login-container {
  background: url(../../assets/background.jpg) 50% no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
  .login-info {
    position: absolute;
    left: 15%;
    top: 44%;
    margin-top: -100px;
    color: #fff;
    .title {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .sub-title {
      font-size: 1.5rem;
      margin: .3rem 0 .7rem 1rem;
    }
    .desc {
      font-size: .96rem;
      line-height: 1.9rem;
    }
  }
  .login-form {
    position: absolute;
    top: 50%;
    left: 70%;
    margin: -180px 0 0 -160px;
    width: 320px;
    height: 380px;
    padding: 36px;
    background: #fff;
    border-radius: 3px;
    .code-input {
      width: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    .code-image {
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
    }
    .login-type {
      text-align: right;
      display: inline-block;
      width: 100%;
    }
    .logo-wrapper {
      display: inline-block;
      margin: 10px 0;
      img {
        width: 1.9rem;
        display: inline-block;
        margin: .8rem .8rem -.8rem .8rem;
        cursor: pointer;
        &.radius {
          border-radius: 50%;
        }
      }
    }
  }
  .login-footer {
    position: fixed;
    bottom: 1rem;
    width: 100%;
    text-align: center;
    color: white;
    font-size: .85rem;
    line-height: 1rem;
    height: 1rem;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: rgba(0,0,0,.85);
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #aaa;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0;
      cursor: pointer;
    }
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  @media screen and (max-width: 1100px)
  {
    .login-info {
      left: 8%;
    }
  }

  @media screen and (max-width: 970px)
  {
    .login-form {
      left: 50%;
    }
    .login-info {
      display: none;
    }
  }
}
</style>
