<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="true" :title="title" :type="type" :visible.sync="isVisible" :width="width" top="50px">
    <el-form :model="systemApi" :rules="rules" label-position="right" label-width="100px" ref="form">

      <el-form-item :label="$t('table.systemApi.serviceId')" prop="serviceId">
        <el-select :disabled="type==='view'" placeholder style="width:100%" v-model="systemApi.serviceId" value>
          <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in serviceList" />
        </el-select>
      </el-form-item>

    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{ $t('common.cancel') }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import systemApiApi from '@/api/SystemApi.js'


export default {
  name: 'SystemApiScan',
  components: {  },
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
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
      },
      systemApi:{
        serviceId: 'authority',
      },
      serviceList: [
        { id: "authority", name: "权限服务" },
        { id: "file", name: "文件服务" },
        { id: "msgs", name: "消息服务" },
        { id: "demo", name: "演示服务" },
        { id: "order", name: "订单服务" },
      ]
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
      return '扫描Rest接口'
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
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.serviceId = 'authority'
    },
    submitForm() {
      systemApiApi.scan(this.systemApi.serviceId).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.$message({
            message: "扫描成功，请稍后刷新数据",
            type: 'success'
          })
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  margin-bottom: 0;
  padding: 0px 10px;
}
</style>
