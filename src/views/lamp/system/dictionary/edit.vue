<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="true" :title="title" :type="type" :visible.sync="isVisible" :width="width" top="50px">
    <el-form :model="dictionary" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :label="$t('table.dictionary.type')" prop="type">
        <el-input :disabled="type==='edit'" v-model="dictionary.type" />
      </el-form-item>
      <el-form-item :label="$t('table.dictionary.label')" prop="label">
        <el-input v-model="dictionary.label" />
      </el-form-item>
      <el-form-item :label="$t('table.dictionary.state')" prop="state">
        <el-radio-group v-model="dictionary.state">
          <el-radio :label="true">{{ $t('common.state.valid') }}</el-radio>
          <el-radio :label="false">{{ $t('common.state.invalid') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{ $t('common.cancel') }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dictionaryApi from '@/api/Dictionary.js'


export default {
  name: 'DictionaryEdit',
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
      dictionary: this.initDictionary(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        type: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 64, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        label: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 64, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        describe: [
          { min: 1, max: 200, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        state: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
    initDictionary () {
      return {
        id: '',
        label: '',
        type: '',
        state: true
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
    setDictionary (val) {
      const vm = this
      if (val) {
        vm.dictionary = { ...val }
      }
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.dictionary = this.initDictionary()
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
      dictionaryApi.saveType(this.dictionary)
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
      dictionaryApi.updateType(this.dictionary)
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
