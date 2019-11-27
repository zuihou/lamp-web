<template>
  <el-form
    ref="form"
    :model="p"
    :rules="rules"
    label-position="right"
    label-width="80px"
    class="form"
  >
    <el-form-item
      :label="$t(&quot;table.user.oldPassword&quot;)"
      prop="oldPassword"
    >
      <el-input
        v-model="p.oldPassword"
        type="password"
      />
    </el-form-item>
    <el-form-item
      :label="$t(&quot;table.user.newPassword&quot;)"
      prop="password"
    >
      <el-input
        v-model="p.password"
        type="password"
      />
    </el-form-item>
    <el-form-item
      :label="$t(&quot;table.user.confirmPassword&quot;)"
      prop="confirmPassword"
    >
      <el-input
        v-model="p.confirmPassword"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        plain
        @click="submit"
      >
        {{ $t('common.edit') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import userApi from '@/api/User.js'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  data () {
    return {
      p: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('rules.range6to20'), trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          {            validator: (rule, value, callback) => {
              if (this.p.password !== value) {
                callback(this.$t('tips.notEqual'))
              } else {
                callback()
              }
            }, trigger: 'blur'          }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          debugger
          userApi.updatePassword({
            ...this.p,
            ...{ id: this.user.id }
          }).then((response) => {
            const res = response.data
            if (res.isSuccess) {
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.$refs.form.clearValidate()
              this.$refs.form.resetFields()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
