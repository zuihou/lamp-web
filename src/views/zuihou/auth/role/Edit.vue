<template>
  <el-dialog
    :title="title"
    :type="type"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form
      ref="form"
      :model="role"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        :label="$t(&quot;table.role.code&quot;)"
        prop="name"
      >
        <el-input
          v-model="role.code"
          :disabled="type===&quot;edit&quot; || role.readonly"
        />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.role.name&quot;)"
        prop="name"
      >
        <el-input
          v-model="role.name"
          :disabled="role.readonly"
        />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.role.status&quot;)"
        prop="status"
      >
        <el-radio-group
          v-model="role.status"
          :disabled="role.readonly"
        >
          <el-radio-button :label="true">
            {{ $t('common.status.valid') }}
          </el-radio-button>
          <el-radio-button :label="false">
            {{ $t('common.status.invalid') }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.role.describe&quot;)"
        prop="describe"
      >
        <el-input
          v-model="role.describe"
          :disabled="role.readonly"
        />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.role.dsType&quot;)"
        prop="dsType"
      >
        <el-radio-group
          v-model="role.dsType.code"
          :disabled="role.readonly"
          @change="dsTypeChange"
        >
          <el-radio-button
            v-for="(item, key, index) in enums.DataScopeType"
            :key="index"
            :label="key"
            :value="key"
          >
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :hidden="orgHidden"
        :label="$t(&quot;table.role.orgList&quot;)"
        prop="orgList"
      >
        <el-tree
          ref="orgTree"
          :disabled="role.readonly"
          :data="orgList"
          :default-expanded-keys="role.orgList"
          :default-checked-keys="role.orgList"
          show-checkbox
          node-key="id"
          :expand-on-click-node="false"
          :check-strictly="true"
          highlight-current
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="warning"
        plain
        @click="isVisible = false"
      >
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        plain
        :disabled="role.readonly"
        @click="submitForm"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import roleApi from '@/api/Role.js'
import orgApi from '@/api/Org.js'

export default {
  name: 'RoleEdit',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      role: this.initRole(),
      screenWidth: 0,
      width: this.initWidth(),
      orgList: [],
      orgHidden: true,
      rules: {
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!this.type === 'add' && value.trim().length > 0) {
                roleApi.check(value).then((r) => {
                  if (r.data) {
                    callback('编码重复')
                  } else {
                    callback()
                  }
                })
              } else {
                callback()
              }
              callback()
            }, trigger: 'blur'
          }
        ],
        status: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        orgList: {
          validator: (rule, value, callback) => {
            if (this.role.dsType.code === 'CUSTOMIZE') {
              if (this.$refs.orgTree.getCheckedKeys().length > 0) {
                callback()
              } else {
                callback('请至少选择一个单位或部门')
              }
            } else {
              callback()
            }
          }
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
      return this.type === 'add' ? this.$t('common.add') : this.$t('common.edit')
    },
    enums () {
      return this.$store.state.common.enums
    }
  },
  watch: {

  },
  mounted () {
    this.initOrg()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initRole () {
      return {
        id: '',
        code: '',
        name: '',
        orgList: [],
        status: true,
        describe: '',
        dsType: {
          code: 'SELF',
          desc: ''
        }
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
    initOrg () {
      orgApi.allTree({ status: true })
        .then((r) => {
          if (r.isError) {
            this.$message({
              message: this.$t('tips.getDataFail'),
              type: 'error'
            })
            return
          }
          this.orgList = r.data
        }).catch(() => {
          this.$message({
            message: this.$t('tips.getDataFail'),
            type: 'error'
          })
        })
    },
    loadListOptions ({ callback }) {
      callback()
    },
    setRole (val) {
      const vm = this
      if (val) {
        vm.role = { ...val }
        this.orgHidden = val.dsType.code !== 'CUSTOMIZE'
        if (!this.orgHidden) {
          roleApi.get(val.id)
            .then(res => {
              if (res.isSuccess) {
                this.role.orgList = res.data.orgList
                this.$refs.orgTree.setCheckedKeys(res.data.orgList)
              }
            })
        }

      }
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.role = this.initRole()
      this.orgHidden = true
      this.$refs.orgTree.setCheckedKeys([])
    },
    submitForm () {
      const vm = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.editSubmit()
        } else {
          return false
        }
      })
    },
    editSubmit () {
      const vm = this
      if (this.orgHidden && this.role.orgList) {
        this.role.orgList.length = 0
      } else {
        this.role.orgList = this.$refs.orgTree.getCheckedKeys()
      }

      if (vm.type === 'add') {
        vm.save()
      } else {
        vm.update()
      }
    },
    save () {
      const vm = this
      roleApi.save(this.role).then((res) => {
        if (res.isSuccess) {
          vm.isVisible = false
          vm.$message({
            message: vm.$t('tips.createSuccess'),
            type: 'success'
          })
          vm.$emit('success')
        }
      })
    },
    update () {
      roleApi.update(this.role).then((res) => {
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
    dsTypeChange (value) {
      this.orgHidden = value !== 'CUSTOMIZE'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
