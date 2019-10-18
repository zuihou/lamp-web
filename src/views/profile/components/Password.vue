<template>
  <el-form ref="form" :model="p" :rules="rules" label-position="right" label-width="80px" class="form">
    <el-form-item :label="$t('table.user.oldPassword')" prop="oldPassword">
      <el-input v-model="p.oldPassword" type="password" />
    </el-form-item>
    <el-form-item :label="$t('table.user.newPassword')" prop="newPassword">
      <el-input v-model="p.newPassword" type="password" />
    </el-form-item>
    <el-form-item :label="$t('table.user.confirmPassword')" prop="confirmPassword">
      <el-input v-model="p.confirmPassword" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submit">{{ $t('common.edit') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      p: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            this.$get('system/user/password/check', {
              password: value,
              username: this.username
            }).then((r) => {
              if (r.data) {
                callback()
              } else {
                callback(this.$t('tips.oldPasswordIncorrect'))
              }
            }).catch(() => {
              callback()
            })
          }, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('rules.range6to20'), trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (this.p.newPassword !== value) {
              callback(this.$t('tips.notEqual'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$put('system/user/password', {
            password: this.p.newPassword,
            username: this.username
          }).then(() => {
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
            this.$refs.form.clearValidate()
            this.$refs.form.resetFields()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
