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
      :model="resource"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        :label="$t(&quot;table.resource.code&quot;)"
        prop="code"
      >
        <el-input
          v-model="resource.code"
          :disabled="type===&quot;edit&quot;"
          @keyup.enter.native="submitForm"
        />
        <p class="note">
          建议使用:作为分隔符，并以view、add、update、delete、export、import、download、upload等关键词结尾
        </p>
        <p class="note">
          如：menu:add、 resource:view、 file:upload
        </p>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.resource.name&quot;)"
        prop="name"
        @keyup.enter.native="submitForm"
      >
        <el-input v-model="resource.name" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.resource.describe&quot;)"
        prop="describe"
        @keyup.enter.native="submitForm"
      >
        <el-input v-model="resource.describe" />
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
import resourceApi from '@/api/Resource.js'


export default {
  name: 'ResourceEdit',
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
      resource: this.initResource(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        code: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!this.resource.id) {
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
        name: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
    initResource () {
      return {
        id: '',
        name: '',
        code: '',
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
    setResource (val) {
      const vm = this
      if (val) {
        vm.resource = { ...val }
      }
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.resource = this.initResource()
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
      resourceApi.save(this.resource).then((res) => {
        if (res.isSuccess) {
          debugger
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
      resourceApi.update(this.resource).then((res) => {
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
p.note {
  font-size: 12px;
  margin: 0;
  padding: 0;
  line-height: 1.4rem;
}
</style>
