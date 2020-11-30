<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.model.name"
        :placeholder="$t('table.datasourceConfig.name')"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.model.username"
        :placeholder="$t('table.datasourceConfig.username')"
        class="filter-item search-item"
      />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button class="filter-item" plain type="primary" @click="search">
        {{ $t("table.search") }}
      </el-button>
      <el-button class="filter-item" plain type="warning" @click="reset">
        {{ $t("table.reset") }}
      </el-button>
      <el-button class="filter-item" plain type="danger" @click="add">
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click">
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-delete" @click.native="batchDelete">{{ $t("table.delete") }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel">{{ $t("table.export") }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview">{{ $t("table.exportPreview") }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :key="tableKey"
      ref="table"
      v-loading="loading"
      :data="tableData.records"
      border
      fit
      row-key="id"
      style="width: 100%;"
      @filter-change="filterChange"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      @cell-click="cellClick"
    >
      <el-table-column align="center" type="selection" width="40px" column-key="selectionId" :reserve-selection="true" />
      <el-table-column
        :label="$t('table.datasourceConfig.name')"
        align="center"
        prop="code"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.datasourceConfig.username')"
        class-name="status-col"
        prop="name"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.datasourceConfig.password')"
        class-name="status-col"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.datasourceConfig.url')"
        class-name="status-col"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.datasourceConfig.driverClassName')"
        class-name="status-col"
        :show-overflow-tooltip="true"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.driverClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        prop="createTime"
        sortable="custom"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        column-key="operation"
        class-name="small-padding fixed-width"
        width="150px"
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-copy-document table-operation"
            style="color: #87d068;"
            @click="copy(row)"
          />
          <i
            class="el-icon-connection table-operation"
            style="color: #87d068;"
            @click="testConnect(row)"
          />
          <i
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            @click="edit(row)"
          />
          <i
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableData.total > 0"
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="Number(tableData.total)"
      @pagination="fetch"
    />
    <datasourceConfig-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @close="editClose"
      @success="editSuccess"
    />
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      title="预览"
      width="80%"
      top="50px"
      :visible.sync="preview.isVisible"
    >
      <el-scrollbar>
        <div v-html="preview.context" />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import DatasourceConfigEdit from "./edit"
import datasourceConfigApi from "@/api/DatasourceConfig.js"
import elDragDialog from '@/directive/el-drag-dialog'
import { downloadFile, initQueryParams } from '@/utils/commons'
export default {
  name: "DatasourceConfigManage",
  directives: { elDragDialog },
  components: { Pagination, DatasourceConfigEdit },
  filters: {
  },
  data () {
    return {
      dialog: {
        isVisible: false,
        title: ""
      },
      isTestConnect: false,
      preview: {
        isVisible: false,
        context: ''
      },
      tableKey: 0,
      queryParams: initQueryParams({}),
      selection: [],
      loading: false,
      tableData: {
        total: 0
      },
      enums: {
      }
    }
  },
  computed: {
  },
  mounted () {
    this.fetch()
  },
  methods: {
    editClose () {
      this.dialog.isVisible = false
    },
    editSuccess () {
      this.search()
    },
    onSelectChange (selection) {
      this.selection = selection
    },
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      this.queryParams = initQueryParams({})
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    exportExcelPreview () {
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0]
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1]
      }
      this.queryParams.extra.fileName = '导出数据源数据'
      datasourceConfigApi.preview(this.queryParams).then(response => {
        const res = response.data
        this.preview.isVisible = true
        this.preview.context = res.data
      })
    },
    exportExcel () {
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0]
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1]
      }
      this.queryParams.extra.fileName = '导出数据源数据'
      datasourceConfigApi.export(this.queryParams).then(response => {
        downloadFile(response)
      })
    },
    add () {
      this.$refs.edit.type = "add"
      this.dialog.title = this.$t("common.add")
      this.dialog.isVisible = true
    },
    singleDelete (row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete () {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning"
        })
        return
      }

      const readonlyIndex = this.selection.findIndex(item => item.readonly)

      if (readonlyIndex > -1) {
        this.$message({
          message: this.$t("tips.readonly"),
          type: "warning"
        })
        return
      }

      this.$confirm("删除数据源数据后，会导致运行中的租户无法正常运行，请谨慎删除", this.$t("common.tips"), {
        confirmButtonText: "坚决删除",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        distinguishCancelAndClose: true
      })
        .then(() => {
          const ids = []
          let contain = false
          this.selection.forEach(item => {
            if (item.readonly) {
              contain = true
              return
            }
            ids.push(item.id)
          })
          if (contain) {
            this.$message({
              message: this.$t("tips.readonly"),
              type: "warning"
            })
          } else {
            this.delete(ids)
          }
        })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (ids) {
      datasourceConfigApi.delete({ ids: ids }).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          })
          this.search()
        }
      })
    },
    testConnect (row) {
      row.poolName = 'test'
      if (this.isTestConnect) {
        this.$message({
          message: '正在测试连接，请稍后',
          type: 'warn'
        })
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.isTestConnect = true
      datasourceConfigApi.testConnect(row).then((response) => {
        const res = response.data
        if (res.isSuccess && res.data) {
          this.$message({
            message: '连接成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '连接失败',
            type: 'error'
          })
        }
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.isTestConnect = false;
        loading.close();
      })
    },
    copy (row) {
      this.$refs.edit.setDatasourceConfig(row)
      this.$refs.edit.type = "copy"
      this.dialog.title = this.$t("common.copy")
      this.dialog.isVisible = true
    },
    edit (row) {
      this.$refs.edit.setDatasourceConfig(row)
      this.$refs.edit.type = "edit"
      this.dialog.title = this.$t("common.edit")
      this.dialog.isVisible = true
    },
    fetch (params = {}) {
      this.loading = true
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0]
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1]
      }

      this.queryParams.current = params.current ? params.current : this.queryParams.current
      this.queryParams.size = params.size ? params.size : this.queryParams.size

      datasourceConfigApi.page(this.queryParams).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.tableData = res.data
        }
        // eslint-disable-next-line no-return-assign
      }).finally(() => this.loading = false)
    },
    sortChange (val) {
      this.queryParams.sort = val.prop
      this.queryParams.order = val.order
      if (this.queryParams.sort) {
        this.search()
      }
    },
    filterChange (filters) {
      for (const key in filters) {
        if (key.includes('.')) {
          const val = {}
          val[key.split('.')[1]] = filters[key][0]
          this.queryParams.model[key.split('.')[0]] = val
        } else {
          this.queryParams.model[key] = filters[key][0]
        }
      }
      this.search()
    },
    cellClick (row, column) {
      if (column['columnKey'] !== "selectionId") {
        return
      }
      let flag = false
      this.selection.forEach((item) => {
        if (item.id === row.id) {
          flag = true
          this.$refs.table.toggleRowSelection(row)
        }
      })

      if (!flag) {
        this.$refs.table.toggleRowSelection(row, true)
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
