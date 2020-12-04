<template>
  <div class="login-container">
    <div class="login-info">
      <div class="title">lamp-web</div>
      <div class="title">{{ $t("common.system") }}</div>
      <div class="desc">1. {{ $t("common.desc.a") }}</div>
      <div class="desc">2. {{ $t("common.desc.b") }}</div>
      <div class="desc">3. {{ $t("common.desc.c") }}</div>
      <div class="desc">4. {{ $t("common.desc.d") }}</div>
      <div class="desc">5. {{ $t("common.desc.e") }}</div>
      <div class="desc">6. {{ $t("common.desc.f") }}</div>
      <div class="desc">
        8. 源码：
        <a href="https://github.com/zuihou" target="_blank"
        >github</a>、
        <a href="https://gitee.com/zuihou111" target="_blank"
        >gitee</a>
      </div>
    </div>
    <el-form
      :model="loginForm"
      :rules="rules"
      autocomplete="off"
      class="login-form"
      label-position="left"
      ref="loginForm"
    >
      <div class="title-container">
        <h3 class="title">{{ $t("login.title") }}</h3>
        <lang-select class="set-language"/>
      </div>
      <span v-if="login.type === 'up'">
        <el-form-item prop="tenant" v-show="isMultiTenant">
          <el-input
            :placeholder="$t('login.tenant')"
            @keyup.enter.native="handleLogin"
            autocomplete="off"
            name="tenantView"
            prefix-icon="el-icon-user"
            ref="tenant"
            type="text"
            v-model="loginForm.tenantView"
          />
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            :placeholder="$t('login.username')"
            @keyup.enter.native="handleLogin"
            autocomplete="off"
            name="account"
            prefix-icon="el-icon-user"
            ref="account"
            type="text"
            v-model="loginForm.account"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :placeholder="$t('login.password')"
            :show-password="true"
            @keyup.enter.native="handleLogin"
            autocomplete="off"
            name="password"
            prefix-icon="el-icon-key"
            ref="password"
            type="password"
            v-model="loginForm.password"
          />
        </el-form-item>
        <el-form-item class="code-input" prop="code" v-show="isCaptcha">
          <el-input
            :placeholder="$t('login.code')"
            @keyup.enter.native="handleLogin"
            autocomplete="off"
            name="code"
            prefix-icon="el-icon-lock"
            ref="code"
            style="width: 70%"
            type="text"
            v-model="loginForm.code"
          />
        </el-form-item>
        <img
          v-show="isCaptcha"
          :src="imageCode"
          @click="getCodeImage"
          alt="codeImage"
          class="code-image"
        />
        <el-button
          :loading="loading"
          @click.native.prevent="handleLogin"
          style="width:100%;margin-bottom:14px;"
          type="primary"
        >{{ $t("login.logIn") }}</el-button
        >
      </span>
      <span v-if="login.type === 'social'">
        {{ $t("login.chooseToSignIn") }}
        <div>
          <template v-for="(l, index) in logo">
            <div :key="index" class="logo-wrapper">
              <img
                :class="{ radius: l.radius }"
                :src="resolveLogo(l.img)"
                @click="socialLogin(l.name)"
                alt
              />
            </div>
          </template>
        </div>
      </span>
      <span style="margin-top: -1rem" v-if="login.type === 'bind'">
        <el-tabs @tab-click="handleTabClick" v-model="tabActiveName">
          <el-tab-pane :label="$t('common.bindLogin')" name="bindLogin">
            <el-form-item prop="bindAccount">
              <el-input
                :placeholder="$t('login.account')"
                autocomplete="off"
                name="bindAccount"
                prefix-icon="el-icon-user"
                ref="bindAccount"
                type="text"
                v-model="loginForm.bindAccount"
              />
            </el-form-item>
            <el-form-item prop="bindPassword">
              <el-input
                :placeholder="$t('login.password')"
                :show-password="true"
                autocomplete="off"
                name="bindPassword"
                prefix-icon="el-icon-key"
                ref="bindPassword"
                type="password"
                v-model="loginForm.bindPassword"
              />
            </el-form-item>
            <el-button
              :loading="loading"
              @click.native.prevent="bindLogin"
              style="width:100%;margin-bottom:14px;"
              type="primary"
            >{{ $t("common.bindLogin") }}</el-button
            >
          </el-tab-pane>
          <el-tab-pane :label="$t('common.signLogin')" name="signLogin">
            <el-form-item prop="signAccount">
              <el-input
                :placeholder="$t('login.account')"
                autocomplete="off"
                name="signAccount"
                prefix-icon="el-icon-user"
                ref="signAccount"
                type="text"
                v-model="loginForm.signAccount"
              />
            </el-form-item>
            <el-form-item prop="signPassword">
              <el-input
                :placeholder="$t('login.password')"
                :show-password="true"
                autocomplete="off"
                name="signPassword"
                prefix-icon="el-icon-key"
                ref="signPassword"
                type="password"
                v-model="loginForm.signPassword"
              />
            </el-form-item>
            <el-button
              :loading="loading"
              @click.native.prevent="signLogin"
              style="width:100%;margin-bottom:14px;"
              type="primary"
            >{{ $t("common.signLogin") }}</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </span>
      <el-dropdown class="login-type" placement="top-end">
        <span class="el-dropdown-link">
          <el-link type="primary">{{ $t("login.ortherLoginType") }}</el-link>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :disabled="login.type === 'up'"
            @click.native="login.type = 'up'"
          >{{ $t("login.type.up") }}
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="login.type === 'social'"
            @click.native="login.type = 'social'"
          >{{ $t("login.type.social") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form>
    <span class="login-footer">
      © 2019 - 2020
      <a href="https://github.com/zuihou" target="_blank">zuihou</a> -
      lamp-cloud
    </span>
  </div>
</template>

<script>
import LangSelect from "@/components/LangSelect";
import db from "@/utils/localstorage";
import {randomNum} from "@/utils";
import {socialLoginUrl} from "@/settings";
import loginApi from "@/api/Login.js";
import {Base64} from "js-base64";

export default {
  name: "Login",
  components: {LangSelect},
  data() {
    return {
      //是否启用多租户
      isMultiTenant: process.env.VUE_APP_IS_MULTI_TENANT_TYPE !== "NONE",
      isCaptcha: process.env.VUE_APP_IS_CAPTCHA === "true",
      tabActiveName: "bindLogin",
      login: {
        type: "up"
      },
      logo: [
        {img: "gitee.png", name: "gitee", radius: true},
        {img: "github.png", name: "github", radius: true},
        {img: "tencent_cloud.png", name: "tencent_cloud", radius: true},
        {img: "qq.png", name: "qq", radius: false},
        {img: "dingtalk.png", name: "dingtalk", radius: true},
        {img: "microsoft.png", name: "microsoft", radius: false}
      ],
      loginForm: {
        account: "lamp",
        password: "lamp",
        tenantView: "0000", //显示用的
        tenant: "", //传递给后端的
        key: randomNum(24, 16),
        code: "",
        grantType:
          process.env.VUE_APP_IS_CAPTCHA === "true" ? "captcha" : "password",
        bindAccount: "",
        bindPassword: "",
        signAccount: "",
        signPassword: ""
      },
      rules: {
        account: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        tenantView: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        password: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        code: {
          validator: (rule, value, callback) => {
            if (this.isCaptcha && value === "") {
              callback("验证码不能为空");
            } else {
              callback();
            }
            callback();
          },
          trigger: "blur"
        },
        bindAccount: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        bindPassword: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        signAccount: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur"
          },
          {
            min: 4,
            max: 10,
            message: this.$t("rules.range4to10"),
            trigger: "blur"
          }
        ],
        signPassword: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: this.$t("rules.range6to20"),
            trigger: "blur"
          }
        ]
      },
      authUser: null,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      imageCode: "",
      page: {
        width: window.screen.width * 0.5,
        height: window.screen.height * 0.5
      }
    };
  },
  created() {
  },
  mounted() {
    db.clear();
    this.getCodeImage();
  },
  destroyed() {
    window.removeEventListener("message", this.resolveSocialLogin);
  },
  methods: {
    getCodeImage() {
      loginApi
        .getCaptcha(this.loginForm.key)
        .then(response => {
          const res = response.data;
          if (res.byteLength <= 100) {
            this.$message({
              message: this.$t("tips.systemError"),
              type: "error"
            });
          }
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(res => {
          this.imageCode = res;
        })
        .catch(e => {
          if (e.toString().indexOf("429") !== -1) {
            this.$message({
              message: this.$t("tips.tooManyRequest"),
              type: "error"
            });
          } else {
            this.$message({
              message: this.$t("tips.getCodeImageFailed"),
              type: "error"
            });
          }
        });
    },
    handleTabClick(tab) {
      this.tabActiveName = tab.name;
    },
    resolveLogo(logo) {
      return require(`@/assets/logo/${logo}`);
    },
    socialLogin(oauthType) {
      const url = `${socialLoginUrl}/${oauthType}/login`;
      window.open(
        url,
        "newWindow",
        `resizable=yes, height=${this.page.height}, width=${this.page.width}, top=10%, left=10%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`
      );
      window.addEventListener("message", this.resolveSocialLogin, false);
    },
    resolveSocialLogin(e) {
      const data = e.data;
      const that = this;
      if (data.message === "not_bind") {
        that.login.type = "bind";
        const authUser = data.data;
        that.authUser = authUser;
        that
          .$confirm(
            that.$t("common.current") +
            authUser.source +
            that.$t("common.socialAccount") +
            authUser.nickname +
            that.$t("common.socialTips"),
            that.$t("common.tips"),
            {
              confirmButtonText: that.$t("common.signLogin"),
              cancelButtonText: that.$t("common.bindLogin"),
              type: "warning"
            }
          )
          .then(() => {
            that.tabActiveName = "signLogin";
          })
          .catch(() => {
            that.tabActiveName = "bindLogin";
          });
      } else if (data.message === "social_login_success") {
        that.saveLoginData(data.data);
        that.getUserDetailInfo();
        that.loginSuccessCallback(data.account);
      } else {
        // do nothing
      }
    },
    bindLogin() {
      let account_c = false;
      let password_c = false;
      this.$refs.loginForm.validateField("bindAccount", e => {
        if (!e) {
          account_c = true;
        }
      });
      this.$refs.loginForm.validateField("bindPassword", e => {
        if (!e) {
          password_c = true;
        }
      });
      if (account_c && password_c) {
        this.loading = true;
        const that = this;
        const params = {
          bindAccount: that.loginForm.bindAccount,
          bindPassword: that.loginForm.bindPassword,
          ...that.authUser
        };
        params.token = null;
        that
          .$post("auth/social/bind/login", params)
          .then(r => {
            const data = r.data.data;
            this.saveLoginData(data);
            this.getUserDetailInfo();
            this.loginSuccessCallback(that.loginForm.bindAccount);
          })
          .catch(error => {
            console.error(error);
            that.loading = false;
          });
      }
    },
    signLogin() {
      let account_c = false;
      let password_c = false;
      this.$refs.loginForm.validateField("signAccount", e => {
        if (!e) {
          account_c = true;
        }
      });
      this.$refs.loginForm.validateField("signPassword", e => {
        if (!e) {
          password_c = true;
        }
      });
      if (account_c && password_c) {
        this.loading = true;
        const that = this;
        const params = {
          bindAccount: that.loginForm.signAccount,
          bindPassword: that.loginForm.signPassword,
          ...that.authUser
        };
        params.token = null;
        that
          .$post("auth/social/sign/login", params)
          .then(r => {
            const data = r.data.data;
            this.saveLoginData(data);
            this.getUserDetailInfo();
            this.loginSuccessCallback(that.loginForm.signAccount);
          })
          .catch(error => {
            console.error(error);
            that.loading = false;
          });
      }
    },
    handleLogin() {
      this.loginForm.tenant = `${Base64.encode(this.loginForm.tenantView)}`;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginSubmit();
        } else {
          return false;
        }
      });
    },
    loginSubmit() {
      this.loading = true;
      const that = this;
      this.$store.commit("account/setTenant", this.loginForm.tenant);
      loginApi
        .login(this.loginForm, {tenant: this.loginForm.tenant, "X-isTenant": false})
        .then(response => {
          const res = response.data;
          if (res.isSuccess) {
            that.saveLoginData(
              res.data["token"],
              res.data["refreshToken"],
              res.data["expiration"]
            );
            that.saveUserInfo(res.data);
            that.getResource();
          } else {
            that.getCodeImage();
          }
        })
        .catch(() => {
          // if(error.response.data){
          //   this.$message({
          //     message: error.response.data.msg,
          //     type: "error"
          //   });
          // }
          that.getCodeImage();
        })
        .finally(() => (that.loading = false));
    },
    saveLoginData(token, refreshToken, expiration) {
      this.$store.commit("account/setToken", token);
      this.$store.commit("account/setRefreshToken", refreshToken);
      this.$store.commit("account/setExpireTime", expiration);
    },
    saveUserInfo(user) {
      this.$store.commit("account/setUser", {
        id: user.userId,
        account: user.account,
        name: user.name,
        avatar: user.avatar,
        workDescribe: user.workDescribe
      });
    },
    getResource() {
      loginApi.getResource().then(response => {
        const res = response.data;
        if (res.isSuccess) {
          const authorityResource = res.data;
          const permissionsList = authorityResource.resourceList || [];

          this.$store.commit("account/setPermissions", permissionsList);
          this.$store.commit("account/setAuthorityResource", authorityResource);

          this.loginSuccess();
        } else {
          this.getCodeImage();
        }
      });
    },
    loginSuccess() {
      this.$message({
        message: this.$t("tips.loginSuccess"),
        type: "success"
      });
      this.$router.push("/");
    },
    loginSuccessCallback(user) {
      console.log(user);
    }
  }
};
</script>

<style lang="scss">
$bg: #fff;
$light_gray: #fff;
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
    transition: all 0.3s;

    &:hover {
      border-color: #57a3f3;
    }
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #aaa;
$light_gray: #eee;

.login-container {
  background: url(../../assets/background.jpg) 50% no-repeat;
  // background-color: #2d3a4b;
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
      margin: 0.3rem 0 0.7rem 1rem;
    }

    .desc {
      font-size: 0.96rem;
      line-height: 1.9rem;
    }
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 70%;
    margin: -180px 0 0 -160px;
    width: 320px;
    height: 440px;
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
        margin: 0.8rem 0.8rem -0.8rem 0.8rem;
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
    font-size: 0.85rem;
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
      color: rgba(0, 0, 0, 0.85);
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

  @media screen and (max-width: 1100px) {
    .login-info {
      left: 8%;
    }
  }

  @media screen and (max-width: 970px) {
    .login-form {
      left: 50%;
    }
    .login-info {
      display: none;
    }
  }
}
</style>
