<template>
  <el-dialog
    :title="title"
    :type="type"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
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
        :label="$t(&quot;table.smsTemplate.providerType&quot;)"
        prop="providerType"
      >
        <el-select
          v-model="smsTemplate.providerType.code"
          value
          placeholder
          style="width:100%"
        >
          <el-option
            v-for="(item, key, index) in enums.ProviderType"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.appId&quot;)"
        prop="appId"
      >
        <el-input v-model="smsTemplate.appId" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.appSecret&quot;)"
        prop="appSecret"
      >
        <el-input v-model="smsTemplate.appSecret" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.url&quot;)"
        prop="url"
      >
        <el-input v-model="smsTemplate.url" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.customCode&quot;)"
        prop="customCode"
      >
        <el-input
          v-model="smsTemplate.customCode"
          :disabled="type === &quot;edit&quot;"
        />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.name&quot;)"
        prop="name"
      >
        <el-input v-model="smsTemplate.name" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.content&quot;)"
        prop="content"
      >
        <el-input v-model="smsTemplate.content" />
        <aside>
          百度云：使用 ${xx} 作为占位符
          <br>
          阿里云：使用 ${xx} 作为占位符
          <br>
          腾讯云：使用 {xx} 作为占位符
        </aside>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.templateCode&quot;)"
        prop="templateCode"
      >
        <el-input v-model="smsTemplate.templateCode" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.signName&quot;)"
        prop="signName"
      >
        <el-input v-model="smsTemplate.signName" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.smsTemplate.templateDescribe&quot;)"
        prop="templateDescribe"
      >
        <el-input v-model="smsTemplate.templateDescribe" />
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
        providerType: [{ required: true, message: this.$t('rules.require'), trigger: 'change' }],
        appId: [{ required: true, message: this.$t('rules.require'), trigger: 'blur' },
        { min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur' }],
        appSecret: [{ required: true, message: this.$t('rules.require'), trigger: 'blur' },
        { min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur' }],
        customCode: [
          { min: 0, max: 20, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.type === 'add' && value.trim() !== '') {
                smsTemplateApi.check(value)
                  .then((response) => {
                    debugger
                    const res = response.data
                    if (res.data) {
                      callback('自定义编码重复')
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
        content: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        templateCode: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
        providerType: { code: '' },
        appId: '',
        appSecret: '',
        url: '',
        customCode: '',
        name: '',
        content: '',
        templateParams: '',
        templateCode: '',
        signName: '',
        templateDescribe: ''
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
aside {
  margin-top: 10px;
  margin-bottom: 0;
}
</style>
