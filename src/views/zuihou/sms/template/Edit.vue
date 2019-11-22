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
      :model="smsTemplate"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        :label="$t(&quot;table.smsTemplate.name&quot;)"
        prop="name"
      >
        <el-input v-model="smsTemplate.name" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.appId&quot;)"
        prop="orgId"
      >
        <el-input v-model="smsTemplate.appId" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.status&quot;)"
        prop="status"
      >
        <el-radio-group v-model="smsTemplate.status">
          <el-radio :label="true">
            {{ $t('common.status.valid') }}
          </el-radio>
          <el-radio :label="false">
            {{ $t('common.status.invalid') }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.describe&quot;)"
        prop="describe"
      >
        <el-input v-model="smsTemplate.describe" />
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
        @click="submitForm"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import smsTemplateApi from '@/api/SmsTemplate.js'

export default {
  name: 'SmsTemplateEdit',
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
      smsTemplate: this.initSmsTemplate(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!this.smsTemplate.id) {
                // this.$get(`system/user/check/${value}`).then((r) => {
                //   if (!r.data) {
                //     callback(this.$t('rules.usernameExist'))
                //   } else {
                //     callback()
                //   }
                // })
              } else {
                // callback()
              }
              callback()
            }, trigger: 'blur'
          }
        ],
        status: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
    }
  },
  watch: {

  },
  mounted () {

    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initSmsTemplate () {
      return {
        id: '',
        name: '',
        orgId: null,
        status: true,
        describe: ''
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
    loadListOptions ({ callback }) {
      callback()
    },
    setSmsTemplate (val) {
      const vm = this
      if (val) {
        vm.smsTemplate = { ...val }
      }
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.smsTemplate = this.initSmsTemplate()
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
      if (vm.type === 'add') {
        vm.save()
      } else {
        vm.update()
      }
    },
    save () {
      const vm = this
      smsTemplateApi.save(this.smsTemplate)
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
    update () {
      smsTemplateApi.update(this.smsTemplate)
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
