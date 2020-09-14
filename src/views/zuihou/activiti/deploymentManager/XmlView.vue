<template>
  <div>
    <el-dialog
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
    open(row) {
      const vm = this
      this.editVisible = true
      var view = document.getElementById('editView')
      if (view && view.innerHTML) {
        view.innerHTML = ''
      }
      setTimeout(function() {
        view = document.getElementById('editView')
        view.innerHTML = `<iframe width=100% id="frameNode" height=100% scrolling='no' frameborder=0 src=${vm.url}/api/activiti/static/goViewXml?pdid=${row.id}&resourceName=${row.resourceName}&token=${db.get('TOKEN', '')}></iframe>`;

      }, 2000)
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
  height: 600px;
  position: absolute;
}
/deep/ .el-dialog__body {
    padding: 30px 0;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
</style>
