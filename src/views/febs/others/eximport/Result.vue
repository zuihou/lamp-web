<!-- 本页内容就不国际化了，累啊 T T -->
<template>
  <el-dialog
    :title="$t('common.importResult')"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <div class="import-desc">
      <span v-if="data.length === 0 && error.length === 0">
        <el-alert
          title="暂无导入记录"
          type="info"
          :closable="false"
        />
      </span>
      <span v-if="data.length !== 0 && error.length !== 0">
        <el-alert
          title="部分导入成功"
          type="warning"
          :closable="false"
          :description="`成功导入${data.length} 条记录，${error.length} 条记录导入失败，共耗时 ${time} 秒`"
        />
      </span>
      <span v-if="data.length !== 0 && error.length === 0">
        <el-alert
          title="全部导入成功"
          type="success"
          :closable="false"
          :description="`成功导入 ${data.length} 条记录，共耗时 ${time} 秒`"
        />
      </span>
      <span v-if="data.length === 0 && error.length !== 0">
        <el-alert
          title="全部导入失败"
          type="error"
          :closable="false"
          :description="`${error.length} 条记录导入失败，共耗时  ${time} 秒`"
        />
      </span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="data.length !== 0" label="成功记录" name="first">
        <el-table
          ref="success-table"
          key="0"
          :data="data"
          max-height="250"
          border
          fit
          style="width: 100%;"
        >
          <el-table-column label="字段1" prop="field1" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.field1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段2" prop="field2" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.field2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段3" prop="field3" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.field3 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="导入时间" prop="createTime" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="error.length !== 0" label="失败记录" name="second">
        <el-table
          ref="failed-table"
          key="1"
          :data="errorsData"
          max-height="250"
          border
          fit
          style="width: 100%;"
        >
          <el-table-column label="行" prop="row" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>第{{ scope.row.row + 1 }}行</span>
            </template>
          </el-table-column>
          <el-table-column label="列" prop="cellIndex" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>第{{ scope.row.cellIndex + 1 }}列</span>
            </template>
          </el-table-column>
          <el-table-column label="列名" prop="column" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.column }}</span>
            </template>
          </el-table-column>
          <el-table-column label="对应字段" prop="name" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="错误信息" prop="errorMessage" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.errorMessage }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  name: 'ImportResult',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    time: {
      type: String,
      default: '0 ms'
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    error: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      screenWidth: 0,
      width: this.initWidth(),
      success: {
        pagination: {
          size: 5,
          num: 1
        }
      }
    }
  },
  computed: {
    errorsData() {
      const arr = []
      for (let i = 0; i < this.error.length; i++) {
        const err = this.error[i]
        let e = {}
        for (const field of err.errorFields) {
          e = { ...field }
          e.row = err.row
          arr.push(e)
        }
      }
      return arr
    },
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '70%'
      } else {
        return '1000px'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .import-desc {
    margin-bottom: .5rem;
  }
</style>
