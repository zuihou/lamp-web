<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :title="title"
    :type="type"
    :visible.sync="isVisible"
    :width="width"
    top="50px"
  >
    <el-form
      ref="form"
      :model="user"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        :label="$t('table.user.password')"
        prop="password"
      >
        <el-input v-model="user.password" type="password" />
      </el-form-item>
      <el-form-item
        :label="$t('table.user.confirmPassword')"
        prop="confirmPassword"
      >
        <el-input v-model="user.confirmPassword" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain type="warning" @click="isVisible = false">{{
        $t("common.cancel")
      }}</el-button>
      <el-button plain type="primary" @click="submitForm">{{
        $t("common.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import userApi from "@/api/GlobalUser.js"

export default {
  name: "UserEdit",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "add"
    }
  },
  data () {
    return {
      user: this.initUser(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        password: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        confirmPassword: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        }
      }
    }
  },
  computed: {
    isVisible: {
      get () {
        return this.dialogVisible
      },
      set () {
        this.close()
        this.reset()
      }
    },
    title () {
      return "修改密码"
    }
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUser () {
      return {
        id: "",
        confirmPassword: "",
        password: "",
        tenantCode: ""
      }
    },
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return "90%"
      } else if (this.screenWidth < 1400) {
        return "45%"
      } else {
        return "800px"
      }
    },
    setUser (val) {
      const vm = this
      vm.user = { id: val.id, tenantCode: val.tenantCode }
    },
    close () {
      this.$emit("close")
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.user = this.initUser()
    },
    submitForm () {
      const vm = this
      this.$refs.form.validate(valid => {
        if (valid) {
          vm.editSubmit()
        } else {
          return false
        }
      })
    },
    editSubmit () {
      userApi.reset(this.user).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.isVisible = false
          this.$message({
            message: this.$t("tips.updateSuccess"),
            type: "success"
          })
          this.$emit("success")
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
