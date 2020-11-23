<template>
  <div>
    <el-dialog
      title="模型管理"
      :fullscreen="true"
      :modal-append-to-body="false"
      :visible.sync="editVisible"
      @close="editClose">
      <div id="editView" class="edit-view">

      </div>
    </el-dialog>
  </div>
</template>
<script>

import db from '@/utils/localstorage'
export default {
  name: 'ModelEdit',
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      editVisible: false,
      url: process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX,
      modelId: null,
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {

  },
  methods: {
    open(id) {
      this.editVisible = true
      setTimeout(function() {
        var view = document.getElementById('editView')
        // var urlPrefix = process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX
        let url = `/api/activiti/static/index?modelId=${id}&tenant=${db.get('TENANT', '')}&token=Bearer ${db.get('TOKEN', '')}`
        view.innerHTML = `<iframe width=100% id="frameNode" height=100% scrolling='no' frameborder=0 src="${url}"></iframe>`;
      }, 1000)
    },
    editClose() {
      this.$parent.editClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-view {
  width: 100%;
  height: 100%;
  position: absolute;
}
/deep/ .el-dialog__header {
  padding: 10px;
}
/deep/ .el-dialog__body {
    padding: 0px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
</style>
