<template>
  <el-dialog :close-on-click-modal="false" :title="title" :type="type" :visible.sync="isVisible" :width="width"
             @dragDialog="handleDrag" top="50px" v-el-drag-dialog>
    <el-form :model="user" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item label="文件" prop="fileLength">
        <fileUpload :acceptSize="100*1024*1024" :auto-upload="false" :limit="1" @fileLengthVaild="fileLengthVaild" :accept="accept"
                    @setId="setIdAndSubmit" ref="fileRef" :action="action">
          <el-button size="small" slot="trigger" type="primary">选取文件</el-button>
          <div class="el-upload__tip" slot="tip">文件不超过100MB</div>
        </fileUpload>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{ $t('common.cancel') }}</el-button>
      <el-button :disabled="disabled" @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import fileUpload from "@/components/zuihou/fileUpload"

  export default {
    name: 'userEdit',
    directives: {elDragDialog, fileUpload},
    components: {fileUpload},
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
        action: `${process.env.VUE_APP_BASE_API}/authority/user/import`,
        accept: ".xls,.xlsx",
        user: this.initUser(),
        screenWidth: 0,
        width: this.initWidth(),
        fileLength: 0,
        disabled: false,
        rules: {
          fileLength: {
            required: true, trigger: "change",
            validator: (rule, value, callback) => {
              const vm = this;
              if (vm.fileLength === 0) {
                callback(new Error("请上传文件"))
              } else if (vm.fileLength > 1) {
                callback(new Error("一次性只能上传1个文件"))
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
        return this.$t('common.upload')
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
      initUser() {
        return {
          id: '',
          bizId: '',
          bizType: '',
          file: null,
          isSingle: false
        }
      },
      handleDrag() {
      },
      // 附件长度校验
      fileLengthVaild(data) {
        const vm = this;
        vm.fileLength = data || 0;
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
      setUser(val) {
        const vm = this
        if (val) {
          vm.user = {...val}
        }
      },
      close() {
        this.$emit('close')
      },
      reset() {
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
        this.user = this.initUser()
        this.$refs.fileRef.init({
          id: ""
        })
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
        vm.disabled = true
        vm.$refs.fileRef.submitFile(this.user.id, this.user.bizId, this.user.bizType)
      },
      setIdAndSubmit(isUploadCompleted) {
        const vm = this
        if (isUploadCompleted) {
          vm.disabled = false
          vm.isVisible = false
          vm.$message({
            message: vm.$t('tips.createSuccess'),
            type: 'success'
          })
          vm.$emit('success')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
