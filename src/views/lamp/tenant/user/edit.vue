<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible.sync="isVisible" :width="width" top="50px">
    <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="130px">
      <el-form-item label="租户" prop="tenantCode">
        <el-select v-model="user.tenantCode" :disabled="type === 'edit'" placeholder="企业">
          <el-option v-for="item in tenantList" :key="item.code" :label="item.name + '(' + item.code + ')'" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.account')" prop="account">
        <el-input v-model="user.account" :disabled="type === 'edit'" />
      </el-form-item>
      <el-form-item v-show="type === 'add'" :label="$t('table.user.password')" prop="password">
        <el-input v-model="user.password" maxlength="64" type="password" />
      </el-form-item>
      <el-form-item v-show="type === 'add'" :label="$t('table.user.confirmPassword')" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" maxlength="64" type="password" />
      </el-form-item>
      <el-form-item :label="$t('table.user.name')" prop="name">
        <el-input v-model="user.name" maxlength="50" />
      </el-form-item>
      <el-form-item :label="$t('table.user.mobile')" prop="mobile">
        <el-input v-model="user.mobile" maxlength="20" />
      </el-form-item>
      <el-form-item :label="$t('table.user.email')" prop="email">
        <el-input v-model="user.email" maxlength="255" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain type="warning" @click="isVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button plain type="primary" @click="submitForm">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import globalUserApi from '@/api/GlobalUser.js'
import tenantApi from '@/api/Tenant.js'

export default {
  name: 'GlobalUserEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tenantList: [],
      type: 'add',
      user: this.initUser(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        account: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 30, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!this.user.id && this.user.tenantCode) {
                const checkData = {
                  tenantCode: this.user.tenantCode,
                  account: value
                }
                globalUserApi.check(checkData)
                  .then((response) => {
                    const res = response.data
                    if (res.data) {
                      callback(this.$t('rules.usernameExist'))
                    } else {
                      callback()
                    }
                  })
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        tenantCode: [{ required: true, message: this.$t('rules.require'), trigger: 'blur' }]
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
    }
  },
  mounted () {
    this.initTenantList()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initTenantList () {
      tenantApi.list({status: {code: 'NORMAL'}})
        .then((response) => {
          const res = response.data
          this.tenantList = res.data
        })
    },
    initUser () {
      return {
        id: '',
        tenantCode: '0000',
        name: '',
        account: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    setUser (val) {
      this.user = { ...val }
    },
    close () {
      this.$emit('close')
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.save()
          } else {
            this.update()
          }
        } else {
          return false
        }
      })
    },
    save () {
      globalUserApi.save(this.user)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.isVisible = false
            this.$message({
              message: this.$t('tips.createSuccess'),
              type: 'success'
            })
            this.$emit('success')
          }
        })
    },
    update () {
      globalUserApi.update(this.user)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.isVisible = false
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
            this.$emit('success')
          }
        })
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.user = this.initUser()
    }
  }
}
</script>
<style lang="scss" >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
