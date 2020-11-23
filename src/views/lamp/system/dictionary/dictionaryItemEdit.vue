<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="true" :title="title" :type="type" :visible.sync="isVisible" :width="width" top="50px">
    <el-form :model="dictionaryItem" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :hidden="true" :label="$t('table.dictionaryItem.dictionaryId')" prop="dictionaryId">
        <el-input :disabled="type==='edit'" v-model="dictionaryItem.dictionaryId" />
      </el-form-item>
      <el-form-item :label="$t('table.dictionaryItem.code')" prop="code">
        <el-input :disabled="type==='edit'" v-model="dictionaryItem.code" />
      </el-form-item>
      <el-form-item :label="$t('table.dictionaryItem.name')" prop="name">
        <el-input v-model="dictionaryItem.name" />
      </el-form-item>
      <el-form-item :label="$t('table.dictionaryItem.status')" prop="status">
        <el-radio-group v-model="dictionaryItem.status">
          <el-radio :label="true">{{ $t('common.status.valid') }}</el-radio>
          <el-radio :label="false">{{ $t('common.status.invalid') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.dictionaryItem.sortValue')" prop="sortValue">
        <el-input v-model="dictionaryItem.sortValue" />
      </el-form-item>
      <el-form-item :label="$t('table.dictionaryItem.describe')" prop="describe">
        <el-input v-model="dictionaryItem.describe" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{ $t('common.cancel') }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dictionaryItemApi from '@/api/DictionaryItem.js'


export default {
  name: 'DictionaryItemEdit',
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
      dictionaryItem: this.initDictionaryItem(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        dictionaryId: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        code: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 64, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 64, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        describe: [
          { min: 1, max: 200, message: this.$t('rules.range4to10'), trigger: 'blur' }
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
    initDictionaryItem () {
      return {
        id: '',
        dictionaryId: null,
        dictionaryType: '',
        name: '',
        code: '',
        status: true,
        sortValue: 1,
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
    setDictionaryItem (val) {
      const vm = this
      if (val) {
        vm.dictionaryItem = { ...val }
      }
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.dictionaryItem = this.initDictionaryItem()
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
      dictionaryItemApi.save(this.dictionaryItem)
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
      dictionaryItemApi.update(this.dictionaryItem)
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
