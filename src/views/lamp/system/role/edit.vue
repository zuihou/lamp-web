<template>
  <el-dialog :close-on-click-modal="false" :title="title" :type="type" :visible.sync="isVisible" :width="width"
             top="50px">
    <el-form :model="role" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :label="$t('table.role.code')" prop="code">
        <el-input :disabled="type==='edit'" v-model="role.code"/>
      </el-form-item>
      <el-form-item label="角色类别" prop="category">
        <el-radio-group v-model="role.category">
          <el-radio-button label="10">功能角色</el-radio-button>
          <el-radio-button label="30">数据角色</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.role.name')" prop="name">
        <el-input v-model="role.name"/>
      </el-form-item>
      <el-form-item :label="$t('table.role.state')" prop="state">
        <el-radio-group v-model="role.state">
          <el-radio-button :label="true">{{ $t('common.state.valid') }}</el-radio-button>
          <el-radio-button :label="false">{{ $t('common.state.invalid') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.role.describe')" prop="describe">
        <el-input v-model="role.describe"/>
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
        enums: {
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
          state: {required: true, message: this.$t('rules.require'), trigger: 'blur'},
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
          state: true,
          describe: '',
          category: '10',
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
    }
  }
</script>
<style lang="scss" scoped>
</style>
