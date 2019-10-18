<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="100px">
      <el-form-item :label="$t('table.user.username')" prop="username">
        <el-input v-model="user.username" :readonly="user.userId === '' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item v-show="user.userId === ''" :label="$t('table.user.password')" prop="password">
        <el-tooltip class="item" effect="dark" :content="$t('tips.defaultPassword')" placement="top-start">
          <el-input value="1234qwer" type="password" readonly />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.user.email')" prop="email">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item :label="$t('table.user.mobile')" prop="mobile">
        <el-input v-model="user.mobile" />
      </el-form-item>
      <el-form-item :label="$t('table.user.dept')" prop="deptId">
        <treeselect
          v-model="user.deptId"
          :multiple="false"
          :options="depts"
          :clear-value-text="$t('common.clear')"
          placeholder=" "
          style="width:100%"
        />
      </el-form-item>
      <el-form-item :label="$t('table.user.role')" prop="roleId">
        <el-select v-model="user.roleId" multiple value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="String(item.roleId)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.sex')" prop="sex">
        <el-select v-model="user.sex" value="" placeholder="" style="width:100%">
          <el-option value="0" :label="$t('common.sex.male') " />
          <el-option value="1" :label="$t('common.sex.female') " />
          <el-option value="2" :label="$t('common.sex.secret') " />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.status')" prop="status">
        <el-radio-group v-model="user.status">
          <el-radio label="1">{{ $t('common.status.valid') }}</el-radio>
          <el-radio label="0">{{ $t('common.status.invalid') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" plain @click="submitForm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validMobile } from '@/utils/my-validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'UserEdit',
  components: { Treeselect },
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
  data() {
    return {
      user: this.initUser(),
      screenWidth: 0,
      width: this.initWidth(),
      depts: [],
      roles: [],
      rules: {
        username: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (!this.user.userId) {
              this.$get(`system/user/check/${value}`).then((r) => {
                if (!r.data) {
                  callback(this.$t('rules.usernameExist'))
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        email: { type: 'email', message: this.$t('rules.email'), trigger: 'blur' },
        mobile: { validator: (rule, value, callback) => {
          if (value !== '' && !validMobile(value)) {
            callback(this.$t('rules.mobile'))
          } else {
            callback()
          }
        }, trigger: 'blur' },
        roleId: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        sex: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        status: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    }
  },
  mounted() {
    this.initDept()
    this.initRoles()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUser() {
      return {
        userId: '',
        username: '',
        password: '1234qwer',
        email: '',
        mobile: '',
        sex: '',
        status: '1',
        deptId: null,
        roleId: []
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    initDept() {
      this.$get('system/dept').then((r) => {
        this.depts = r.data.data.rows
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    initRoles() {
      this.$get('system/role/options').then((r) => {
        this.roles = r.data.data
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    setUser(val) {
      this.user = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.user.userId) {
            // create
            this.user.roleId = this.user.roleId.join(',')
            this.$post('system/user', { ...this.user }).then(() => {
              this.isVisible = false
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          } else {
            // update
            this.user.roleId = this.user.roleId.join(',')
            this.user.createTime = this.user.modifyTime = this.user.lastLoginTime = null
            this.$put('system/user', { ...this.user }).then(() => {
              this.isVisible = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          }
        } else {
          return false
        }
      })
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.user = this.initUser()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
