<template>
  <div>
    <el-upload
      :ref="uploadRef"
      class="avatar-uploader"
      :class="{ limit: showUploadBtn }"
      list-type="picture-card"
      :multiple="multiple"
      :auto-upload="autoUpload"
      :headers="headers"
      :action="action"
      :data="fileOtherData"
      :file-list="imgFileList"
      :on-change="handleChange"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :show-file-list="showFileList"
      :limit="limit"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
      >
      <i
        v-else
        class="el-icon-plus"
      />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt
      >
    </el-dialog>
  </div>
</template>

<script>
import db from '@/utils/localstorage'
import commonApi from "@/api/Common.js"
export default {
  props: {
    uploadRef: {
      type: String,
      default: "file1"
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: false
    },
    // 是否显示上传列表
    showFileList: {
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
      default: "JPG,JPEG,PNG,GIF,BMP,PDF"
    },
    // 默认额外上传数据
    fileOtherData: {
      type: Object,
      default: function () {
        return {
          bizId: "",
          bizType: "",
          isSingle: false
        }
      }
    }
  },
  data () {
    return {
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: true,
      // 默认附件列表
      imgFileList: [],
      // 删除附件列表
      removeFileAry: [],
      // 新增附件列表
      addFileAry: [],
      // 是否上传失败
      isUploadError: false,
      fileLength: 0,
      action: `${process.env.VUE_APP_BASE_API}/file/attachment/upload`
    }
  },
  computed: {
    showUploadBtn () {
      return (
        this.showFileList &&
        this.addFileAry.length + this.imgFileList.length === this.limit
      )
    },
    headers () {
      return {
        token: db.get('TOKEN', ''),
        tenant: db.get('TENANT', '')
      }
    }

  },
  methods: {
    // 附件初始化
    init ({ bizId, bizType, imageUrl, isSingle, isDetail }) {
      const vm = this
      vm.fileOtherData.bizId = bizId
      vm.fileOtherData.bizType = bizType
      vm.fileOtherData.isSingle = isSingle || false
      // vm.imgFileList = []
      vm.imgFileList.length = 0
      vm.removeFileAry = []
      vm.addFileAry = []
      vm.imageUrl = imageUrl
      vm.isUploadError = false
      if (isDetail) {
        vm.getAttachment()
      }
    },
    // 附件上传前触发
    beforeUpload () {
      const vm = this
      vm.$store.state.hasLoading = true
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange (file) {
      const vm = this
      if (file.response) {
        if (file.response.isSuccess) {
          vm.fileOtherData.bizId = file.response.data.bizId
          vm.$emit("setId", file.response.data.bizId, file.response.data.url)
        } else {
          vm.$message.error(file.response.msg)
          vm.isUploadError = false
        }
      } else {
        const ary = vm.accept.split(",")
        const fileType = file.name.split(".")
        const length = fileType.length - 1
        let isImg = false
        ary.map(item => {
          if (item.trim().toLowerCase() === fileType[length].toLowerCase()) {
            isImg = true
          }
        })
        if (!isImg) {
          vm.$message.error("只能上传" + vm.accept + "格式的文件!")
          //vm.imgFileList = []
          vm.imgFileList.length = 0
        } else {
          if (!vm.isUploadError) {
            if (!vm.showFileList) {
              this.imageUrl = URL.createObjectURL(file.raw)
            }
            vm.addFileAry.push(file.name)
          }
          vm.isUploadError = false
        }
      }
      vm.$store.state.hasLoading = false
    },
    // 附件上传失败
    handleError () {
      const vm = this
      vm.$message.error("附件上传失败，请重试")
      vm.isUploadError = true
      vm.$store.state.hasLoading = false
      if (!vm.showFileList) {
        vm.imageUrl = ""
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
              if (!vm.showFileList) {
                vm.imageUrl = item.url
              }
            })
            vm.imgFileList = data
            vm.$emit("fileLengthVaild", vm.imgFileList.length)
          }
        }
      }
    },
    // 删除附件回调
    handleRemove (file) {
      const vm = this
      if (file.bizId) {
        vm.removeFileAry.push(file.id)
        vm.imgFileList.map((item, index) => {
          if (item.bizId === file.bizId) {
            vm.imgFileList.splice(index, 1)
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
    },
    // 文件超出个数限制时的钩子
    handleExceed () {
      const vm = this
      vm.$message("当前最多允许上传" + vm.limit + "张图片")
    },
    // 返回附件新增及删除数组长度
    handleBack () {
      const vm = this
      return {
        addLength: vm.addFileAry.length,
        removeLength: vm.removeFileAry.length
      }
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
        }
      }
    },
    // 附件上传服务器触发方法
    submitFile (bizId, bizType, isSingle) {
      const vm = this
      vm.fileOtherData.bizId = bizId
      vm.fileOtherData.bizType = bizType
      vm.fileOtherData.isSingle = isSingle
      if (!vm.showFileList) {
        const length = vm.$refs[vm.uploadRef].uploadFiles.length - 1
        vm.$refs[vm.uploadRef].uploadFiles = [
          vm.$refs[vm.uploadRef].uploadFiles[length]
        ]
        vm.imgFileList.map(item => {
          vm.removeFileAry.push(item.id)
        })
        if (vm.imgFileList.length > 0) {
          vm.deleteAttachment()
        }
      }
      vm.$refs[vm.uploadRef].submit()
      vm.$store.state.hasLoading = false
      vm.addFileAry = []
    },
    // 服务器删除附件
    async deleteAttachmentByIds (ids) {
      const vm = this
      const res = await commonApi.deleteAttachment({
        ids: ids
      })
      if (res.status === 200) {
        if (res.data.code !== 0) {
          vm.$message(res.data.msg)
        } else {
          vm.removeFileAry = []
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
}
/deep/.el-form-item__content {
  line-height: 0;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  margin: 0 8px 0 0;
}
/deep/.el-upload--picture-card,
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 128px;
  height: 128px;
}
.limit {
  /deep/.el-upload--picture-card {
    display: none;
  }
}
</style>
