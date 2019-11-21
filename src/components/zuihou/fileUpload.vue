<template>
  <div>
    <el-upload
      :ref="uploadRef"
      class="upload-demo"
      :class="isUpload === false ? &quot;hidebtn&quot; : &quot;&quot;"
      :multiple="multiple"
      :auto-upload="autoUpload"
      :headers="headers"
      :action="action"
      :data="fileOtherData"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-change="handleChange"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="limit"
      :on-exceed="handleExceed"
    >
      <el-button
        v-if="isUpload"
        size="small"
        type="primary"
      >
        点击上传
      </el-button>
    </el-upload>
  </div>
</template>

<script>
import db from '@/utils/localstorage'
import commonApi from "@/api/Common.js"
export default {
  name: 'FileUpload',
  props: {
    uploadRef: {
      type: String,
      default: "file1"
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 是否上传文件
    isUpload: {
      type: Boolean,
      default: true
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: null
    },
    // 允许上传的文件类型
    accept: {
      type: String,
      default: ""
    },
    // 默认额外上传数据
    fileOtherData: {
      type: Object,
      default: function () {
        return {
          id: null,
          bizId: "",
          bizType: "",
          isSingle: false
        }
      }
    }
  },
  data () {
    return {
      // 默认附件列表
      fileList: [],
      // 删除附件列表
      removeFileAry: [],
      // 新增附件列表
      addFileAry: [],
      // 上传成功的文件数
      successNum: 0,
      // 上传失败的文件数
      errorNum: 0,
      // 已上传的文件数
      uploadTotalNum: 0,
      // 是否上传失败
      isUploadError: false,
      action: `${process.env.VUE_APP_BASE_API}/file/attachment/upload`
    }
  },
  computed: {
    headers () {
      return {
        token: db.get('TOKEN', '') || '',
        tenant: db.get('TENANT', '') || ''
      }
    }
  },
  methods: {
    // 附件初始化
    init ({ id, bizId, bizType, isSingle, isDetail }) {
      const vm = this
      debugger
      vm.fileOtherData.bizId = bizId
      vm.fileOtherData.id = id || ""
      vm.fileOtherData.bizType = bizType
      vm.fileOtherData.isSingle = isSingle || false
      vm.fileList.length = 0
      vm.removeFileAry = []
      vm.addFileAry = []
      vm.$emit("fileLengthVaild", 0)
      if (isDetail) {
        vm.getAttachment()
      }
      vm.successNum = 0
      vm.errorNum = 0
      vm.uploadTotalNum = 0
      vm.$refs[vm.uploadRef].clearFiles()
    },

    handleChange (file, fileList) {
      debugger
      const vm = this
      if (file.response) {
        vm.uploadTotalNum += 1
        if (file.response.isSuccess) {
          vm.fileOtherData.bizId = file.response.data.bizId
          vm.successNum += 1
        } else {
          setTimeout(() => {
            vm.$message({
              message: file.name + '上传失败，原因：\n' + file.response.msg,
              type: 'error',
              showClose: true,
              duration: 6000
            })
          }, 0)
          vm.isUploadError = false
          vm.errorNum += 1
        }
        vm.$emit("setId", vm.uploadTotalNum === fileList.length, file.response)
      } else {
        if (vm.accept) {
          const ary = vm.accept.split(",")
          const fileType = file.name.split(".")
          const length = fileType.length - 1
          let trueFormat = false
          ary.map(item => {
            if (item.trim().toLowerCase() === fileType[length].toLowerCase()) {
              trueFormat = true
            }
          })
          if (!trueFormat) {
            vm.$message.error("只能上传" + vm.accept + "格式的文件!")
            debugger
            vm.fileList = JSON.parse(JSON.stringify(vm.fileList))
          } else {
            if (!vm.isUploadError) {
              vm.addFileAry.push(file.name)
            }
            vm.isUploadError = false
          }
        } else {
          if (!vm.isUploadError) {
            vm.addFileAry.push(file.name)
          }
          vm.isUploadError = false
        }
        vm.$emit("fileLengthVaild", vm.fileList.length + vm.addFileAry.length)
      }
      vm.$store.state.hasLoading = false
    },
    // 附件上传失败
    handleError () {
      const vm = this
      vm.$message.error("附件上传失败，请重试")
      vm.isUploadError = true
      vm.$store.state.hasLoading = false
    },
    handlePreview (file) {
      if (file.bizId) {
        this.downLoadFile(file)
      }
    },
    beforeRemove (file) {
      return this.$confirm("确定移除" + file.name, "删除确认")
    },
    // 文件超出个数限制时的钩子
    handleExceed () {
      const vm = this
      vm.$message("当前最多允许上传" + vm.limit + "个文件")
    },
    // 删除附件列表
    handleRemove (file) {
      debugger
      const vm = this
      if (file.bizId) {
        vm.removeFileAry.push(file.id)
        vm.fileList.map((item, index) => {
          if (item.name === file.name) {
            vm.fileList.splice(index, 1)
            return false
          }
        })
      } else {
        vm.addFileAry.map((item, index) => {
          if (item === file.name) {
            vm.addFileAry.splice(index, 1)
            return false
          }
        })
      }
      vm.$emit("fileLengthVaild", vm.fileList.length + vm.addFileAry.length)
    },
    // 服务器删除附件
    async deleteAttachment () {
      const vm = this
      const res = await commonApi.deleteAttachment({
        ids: vm.removeFileAry
      })
      if (res.status === 200) {
        if (res.data.code !== 0) {
          vm.$message(res.data.msg)
        } else {
          vm.removeFileAry = []
        }
      }
    },
    // 查询附件
    async getAttachment () {
      const vm = this
      const res = await commonApi.getAttachment({
        bizIds: vm.fileOtherData.bizId,
        bizTypes: vm.fileOtherData.bizType
      })
      if (res.status === 200) {
        if (res.data.code === 0) {
          if (res.data.data.length > 0) {
            let data = res.data.data[0].list
            data.map(item => {
              item.name = item.submittedFileName
            })
            vm.fileList = data
            vm.$emit("fileLengthVaild", vm.fileList.length)
          }
        }
      }
    },
    // 查询附件
    async getAttachmentByArr (bizIds, bizTypes) {
      const vm = this
      const res = await commonApi.getAttachment({
        bizIds: bizIds,
        bizTypes: bizTypes
      })
      if (res.status === 200) {
        if (res.data.code === 0) {
          if (res.data.data.length > 0) {
            let data = res.data.data[0].list
            data.map(item => {
              item.name = item.submittedFileName
            })
            vm.fileList = data
          }
        }
      }
    },
    // 返回附件新增及删除数组长度
    handleBack () {
      const vm = this
      return {
        addLength: vm.addFileAry.length,
        removeLength: vm.removeFileAry.length
      }
    },
    // 附件上传服务器触发方法
    submitFile (id, bizId, bizType) {
      debugger
      const vm = this
      vm.fileOtherData.id = id
      if (bizId) {
        vm.fileOtherData.bizId = bizId
        vm.isUpload = true
      }
      vm.fileOtherData.bizType = bizType
      vm.$refs[vm.uploadRef].submit()
      vm.addFileAry = []
    },
    // 附件下载
    async downLoadFile (data) {
      let link = document.createElement("a")
      link.href = data.url
      link.download = data.name
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
  }
}
</script>
<style>
.hidebtn .el-upload {
  display: none;
}
</style>
