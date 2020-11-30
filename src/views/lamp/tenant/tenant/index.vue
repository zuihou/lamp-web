<template>
  <div class="app-container">
    <aside>新增租户步骤：1. 添加租户 2.点击操作列: 初始化连接 3.点击超级用户页面去新增一个超级管理员账号 4.将刚创建的超级管理员提供给租户，登录lamp-web</aside>
    <div class="filter-container">
      <el-input
        v-model="queryParams.model.code"
        :placeholder="$t('table.tenant.code')"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.model.name"
        :placeholder="$t('table.tenant.name')"
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
        :label="$t('table.tenant.code')"
        :show-overflow-tooltip="true"
        align="center"
        prop="code"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.tenant.name')"
        :show-overflow-tooltip="true"
        class-name="status-col"
        prop="name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.tenant.duty')"
        class-name="status-col"
        width="80px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.duty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="typeFilterList"
        column-key="type.code"
        :label="$t('table.tenant.type')"
        :show-overflow-tooltip="true"
        align="center"
        prop="type"
        width="80px"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.type ? row.type.code :'' | typeFilter">{{
            row.type.desc
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        column-key="status"
        :filters="statusFilterList"
        :label="$t('table.tenant.status')"
        align="center"
        prop="status"
        width="100px"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status ? row.status.code :row.status | statusFilter" class="pointer">{{
            row.status.desc
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.tenant.expirationTime')"
        align="center"
        prop="expirationTime"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.expirationTime ? scope.row.expirationTime : "永久"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.readonly')"
        align="center"
        prop="readonly"
        sortable
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.readonly ? $t("common.yes") : $t("common.no")
          }}</span>
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
            class="el-icon-view table-operation"
            style="color: #87d068;"
            @click="view(row)"
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
          <i
            v-if="row.status.code === 'WAIT_INIT'"
            class="el-icon-connection table-operation"
            style="color: #f50;"
            title="初始化连接"
            @click="initConnection(row)"
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
    <tenant-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @close="editClose"
      @success="editSuccess"
    />
    <tenant-view
      ref="view"
      :dialog-visible="tenantViewVisible"
      @close="viewClose"
    />
    <tenant-connection
      ref="connection"
      :dialog-visible="tenantConnectionVisible"
      @close="tenantConnectionClose"
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
import TenantEdit from "./edit"
import TenantView from "./view"
import TenantConnection from "./connection"
import tenantApi from "@/api/Tenant.js"
import elDragDialog from '@/directive/el-drag-dialog'
import { downloadFile, initEnums, initQueryParams } from '@/utils/commons'
export default {
  name: "TenantManage",
  directives: { elDragDialog },
  components: { TenantConnection, Pagination, TenantEdit, TenantView },
  filters: {
    typeFilter (status) {
      const map = {
        CREATE: "success",
        REGISTER: "danger"
      }
      return map[status] || "info"
    },
    statusFilter (status) {
      const map = {
        NORMAL: "success",
        FORBIDDEN: "warning",
        WAITING: "info",
        REFUSE: "danger"
      }
      return map[status] || ""
    }
  },
  data () {
    return {
      dialog: {
        isVisible: false,
        title: ""
      },
      preview: {
        isVisible: false,
        context: ''
      },
      tenantViewVisible: false,
      tenantConnectionVisible: false,
      tableKey: 0,
      queryParams: initQueryParams({}),
      selection: [],
      loading: false,
      tableData: {
        total: 0
      },
      enums: {
        TenantTypeEnum: {},
        TenantStatusEnum: {}
      }
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.account.user
    },
    typeFilterList () {
      const list = []
      for (const key in this.enums.TenantTypeEnum) {
        list.push({
          value: key,
          text: this.enums.TenantTypeEnum[key]
        })
      }
      return list
    },
    statusFilterList () {
      const list = []
      for (const key in this.enums.TenantStatusEnum) {
        list.push({
          value: key,
          text: this.enums.TenantStatusEnum[key]
        })
      }
      return list
    }
  },
  mounted () {
    initEnums(['TenantStatusEnum', 'TenantTypeEnum'], this.enums)
    this.fetch()
  },
  methods: {
    tenantConnectionClose () {
      this.tenantConnectionVisible = false
    },
    viewClose () {
      this.tenantViewVisible = false
    },
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
      this.queryParams.extra.fileName = '导出用户数据'
      tenantApi.preview(this.queryParams).then(response => {
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
      this.queryParams.extra.fileName = '导出用户数据'
      tenantApi.export(this.queryParams).then(response => {
        downloadFile(response)
      })
    },
    add () {
      if (this.tableData.total > 5) {
        this.$message({
          message: '演示环境有限，最多支持创建5个租户，请在现有租户下创建用户进行测试',
          type: "warning",
          duration: 5000
        })
        return
      }
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

      this.$confirm("删除租户数据后，会将租户库及其所有数据全部删除，建议调用禁用接口。", this.$t("common.tips"), {
        confirmButtonText: "禁用",
        cancelButtonText: "删除",
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
            this.updateStatus(ids)
          }
        })
        .catch((action) => {
          if (action === 'cancel') {
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
          }
        })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (ids) {
      tenantApi.remove({ ids: ids }).then(response => {
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
    updateStatus (ids) {
      tenantApi.updateStatus({ 'ids[]': ids }).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.$message({
            message: '禁用成功',
            type: "success"
          })
          this.search()
        }
      })
    },
    changeStatus (row) {
      let status = 'NORMAL'
      if (row.status['code'] === 'NORMAL') {
        status = 'FORBIDDEN'
      } else {
        status = 'NORMAL'
      }
      tenantApi.updateStatus({ 'ids[]': row.id, status: status }).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.$message({
            message: row.status['code'] === 'NORMAL' ? '禁用成功' : '启用成功',
            type: row.status['code'] === 'NORMAL' ? 'warning' : 'success'
          })
          this.search()
        }
      })
    },
    view (row) {
      this.$refs.view.setTenant(row)
      this.tenantViewVisible = true
    },
    edit (row) {
      if (row.readonly) {
        this.$message({
          message: this.$t("tips.readonly"),
          type: "warning"
        })
        return
      }
      this.$refs.edit.setTenant(row)
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

      tenantApi.page(this.queryParams).then(response => {
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
    },
    initConnection (row) {
      this.$refs.connection.setTenant(row)
      this.tenantConnectionVisible = true
    }
  }
}
</script>
<style lang="scss" scoped></style>
