<template>
  <el-dialog :close-on-click-modal="false" :title="title" :type="type" :visible.sync="isVisible" :width="width"
             top="50px">
    <el-form :model="role" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :label="$t('table.role.code')" prop="code">
        <el-input :disabled="type==='edit'" v-model="role.code"/>
      </el-form-item>
      <el-form-item :label="$t('table.role.name')" prop="name">
        <el-input v-model="role.name"/>
      </el-form-item>
      <el-form-item :label="$t('table.role.status')" prop="status">
        <el-radio-group v-model="role.status">
          <el-radio-button :label="true">{{ $t('common.status.valid') }}</el-radio-button>
          <el-radio-button :label="false">{{ $t('common.status.invalid') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.role.describe')" prop="describe">
        <el-input v-model="role.describe"/>
      </el-form-item>
      <el-form-item :label="$t('table.role.dsType')" prop="dsType">
        <el-radio-group @change="dsTypeChange" v-model="role.dsType.code">
          <el-radio-button :key="index" :label="key" :value="key" v-for="(item, key, index) in enums.DataScopeType">
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :hidden="orgHidden" :label="$t('table.role.orgList')" prop="orgList">
        <el-tree
          :check-strictly="true"
          :data="orgList"
          :default-checked-keys="role.orgList"
          :default-expanded-keys="role.orgList"
          :expand-on-click-node="false"
          highlight-current
          node-key="id"
          ref="orgTree"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{ $t('common.cancel') }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
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
    data() {
      return {
        role: this.initRole(),
        screenWidth: 0,
        width: this.initWidth(),
        orgList: [],
        orgHidden: true,
        enums: {
          DataScopeType: {}
        },
        rules: {
          name: [
            {required: true, message: this.$t('rules.require'), trigger: 'blur'},
            {min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (!this.type === 'add' && value.trim().length > 0) {
                  roleApi.check(value)
                    .then((response) => {
                      const res = response.data
                      if (res.data) {
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
          status: {required: true, message: this.$t('rules.require'), trigger: 'blur'},
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
        get() {
          return this.dialogVisible
        },
        set() {
          this.close()
          this.reset()
        }
      },
      title() {
        return this.type === 'add' ? this.$t('common.add') : this.$t('common.edit')
      }
    },
    watch: {},
    mounted() {
      this.initOrg()
      window.onresize = () => {
        return (() => {
          this.width = this.initWidth()
        })()
      }
    },
    methods: {
      initRole() {
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
      initOrg() {
        orgApi.allTree({status: true})
          .then((response) => {
            const res = response.data

            this.orgList = res.data
          })
      },
      loadListOptions({callback}) {
        callback()
      },
      setRole(val = {}) {
        const vm = this

        if (val['enums']) {
          vm.enums = val['enums'];
        }

        if (val['row']) {
          vm.role = {...val['row']}

          this.orgHidden = vm.role.dsType.code !== 'CUSTOMIZE'
          if (!this.orgHidden) {
            roleApi.getDetails(vm.role.id)
              .then((response) => {
                const res = response.data
                if (res.isSuccess) {
                  this.role.orgList = res.data.orgList
                  this.$refs.orgTree.setCheckedKeys(res.data.orgList)
                }
              })
          }

        }
      },
      close() {
        this.$emit('close')
      },
      reset() {
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
        this.role = this.initRole()
        this.orgHidden = true
        this.$refs.orgTree.setCheckedKeys([])
      },
      submitForm() {
        const vm = this
        this.$refs.form.validate((valid) => {
          if (valid) {
            vm.editSubmit()
          } else {
            return false
          }
        })
      },
      editSubmit() {
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
      save() {
        const vm = this
        roleApi.save(this.role)
          .then((response) => {
            const res = response.data
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
      update() {
        roleApi.update(this.role)
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
      dsTypeChange(value) {
        this.orgHidden = value !== 'CUSTOMIZE'
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
