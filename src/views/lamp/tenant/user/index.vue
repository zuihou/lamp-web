<template>
  <div class="app-container">
    <aside>
      该菜单和用户管理的区别在于：这里只能查询到所有租户的超级管理员和内置用户。<br>
      系统初始化时会初始化1个用户（内置超级管理员），内置用户用于开发者运营时使用，该账号尽量不告知租户用户
      然后需要手动新增一个超级管理员，提供给租户使用。
    </aside>
    <div class="filter-container">
      <el-select
        v-model="queryParams.model.tenantCode"
        placeholder="租户"
        class="filter-item search-item"
        @change="codeChange"
      >
        <el-option v-for="(item, key, index) in tenantList" :key="index" :label="item.name + '(' + item.code + ')'"
                   :value="item.code"/>
      </el-select>
      <el-input v-model="queryParams.model.account" :placeholder="$t('table.user.account')"
                class="filter-item search-item"/>
      <el-input v-model="queryParams.model.name" :placeholder="$t('table.user.name')"
                class="filter-item search-item"/>
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button class="filter-item" plain type="primary" @click="search">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" plain type="warning" @click="reset">{{ $t('table.reset') }}</el-button>
      <el-button class="filter-item" plain type="danger" @click="add">
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click">
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-delete" @click.native="batchDelete">{{ $t('table.delete') }}
          </el-dropdown-item>
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
      <el-table-column align="center" type="selection" width="40px" column-key="selectionId" :reserve-selection="true"/>
      <el-table-column :label="$t('table.user.account')" :show-overflow-tooltip="true" class-name="status-col"
                       prop="account">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.user.name')" class-name="status-col">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.user.mobile')" class-name="status-col">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.user.email')" class-name="status-col">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.readonly')" align="center" prop="readonly" sortable width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.readonly ? $t("common.yes") : $t("common.no") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" align="center" prop="createTime" sortable="custom" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" column-key="operation" align="center"
                       class-name="small-padding fixed-width" width="150px">
        <template slot-scope="{row}">
<!--          <i class="el-icon-edit table-operation" style="color: #2db7f5;" @click="edit(row)"/>-->
          <i class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)"/>
          <i
            class="el-icon-refresh-left"
            style="color: #f50;"
            @click="updatePassword(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData.total>0" :limit.sync="queryParams.size" :page.sync="queryParams.current"
                :total="Number(tableData.total)" @pagination="fetch"/>
    <global-user-edit ref="edit" :dialog-visible="dialog.isVisible" :title="dialog.title" @close="editClose"
                      @success="editSuccess"/>
    <update-password
      ref="updatePassword"
      :dialog-visible="updatePasswordDialog.isVisible"
      :type="updatePasswordDialog.type"
      @close="updatePasswordClose"
      @success="updatePasswordSuccess"
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
        <div v-html="preview.context"/>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import GlobalUserEdit from './edit'
import globalUserApi from '@/api/GlobalUser.js'
import tenantApi from '@/api/Tenant.js'
import UpdatePassword from "./updatePassword"
import elDragDialog from '@/directive/el-drag-dialog'
import {downloadFile, initQueryParams} from '@/utils/commons'

export default {
  name: 'GlobalUserManage',
  directives: {elDragDialog},
  components: {Pagination, GlobalUserEdit, UpdatePassword},
  data() {
    return {
      dialog: {
        isVisible: false,
        title: ''
      },
      updatePasswordDialog: {
        isVisible: false,
        type: "add"
      },
      preview: {
        isVisible: false,
        context: ''
      },
      tableKey: 0,
      tenantList: [],
      queryParams: initQueryParams({
        model: {
          tenantCode: '0000'
        }
      }),
      selection: [],
      loading: false,
      tableData: {
        total: 0
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.account.user
    }
  },
  mounted() {
    this.fetch()
    this.loadTenantList()
  },
  methods: {
    loadTenantList() {
      tenantApi.list({status: 'NORMAL'}).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.tenantList = res.data
        }
      })
    },
    editClose() {
      this.dialog.isVisible = false
    },
    editSuccess() {
      this.search()
    },
    updatePasswordSuccess() {
      this.search()
    },
    updatePasswordClose() {
      this.updatePasswordDialog.isVisible = false
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    reset() {
      this.queryParams = initQueryParams({
        model: {
          tenantCode: '0000'
        }
      })
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    exportExcelPreview() {
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0]
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1]
      }
      this.queryParams.extra.fileName = `导出租户${this.queryParams.model.tenantCode}的用户数据`
      globalUserApi.preview(this.queryParams).then(response => {
        const res = response.data
        this.preview.isVisible = true
        this.preview.context = res.data
      })
    },
    exportExcel() {
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0]
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1]
      }
      this.queryParams.extra.fileName = `导出租户${this.queryParams.model.tenantCode}的用户数据`
      globalUserApi.export(this.queryParams).then(response => {
        downloadFile(response)
      })
    },
    add() {
      this.$refs.edit.setUser({
        tenantCode: this.queryParams.model.tenantCode
      })
      this.$refs.edit.type = 'add'
      this.dialog.title = this.$t('common.add')
      this.dialog.isVisible = true
    },
    singleDelete(row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        let contain = false
        const userIds = []
        let isSystemData = false
        this.selection.forEach((item) => {
          if (item.id === this.currentUser.id) {
            contain = true
            return
          }
          if (item.readonly) {
            isSystemData = true
            return
          }
          userIds.push(item.id)
        })
        if (isSystemData) {
          this.$message({
            message: this.$t('tips.readonly'),
            type: 'warning'
          })
        } else if (contain) {
          this.$message({
            message: this.$t('tips.containCurrentUser'),
            type: 'warning'
          })
          this.clearSelections()
        } else {
          this.delete(this.queryParams.model.tenantCode, userIds)
        }
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    delete(tenantCode, ids) {
      globalUserApi.remove({tenantCode: tenantCode, ids: ids})
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.search()
          }
        })
    },
    edit(row) {
      if (row.readonly) {
        this.$message({
          message: this.$t('tips.readonly'),
          type: 'warning'
        })
        return
      }
      row.tenantCode = this.queryParams.model.tenantCode
      this.$refs.edit.setUser(row)
      this.$refs.edit.type = 'edit'
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
    },
    updatePassword(row) {
      row.tenantCode = this.queryParams.model.tenantCode
      this.$refs.updatePassword.setUser(row)
      this.updatePasswordDialog.type = "edit"
      this.updatePasswordDialog.isVisible = true
    },
    fetch(params = {}) {
      this.loading = true
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0]
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1]
      }

      this.queryParams.current = params.current ? params.current : this.queryParams.current
      this.queryParams.size = params.size ? params.size : this.queryParams.size
      if(!this.queryParams.model.tenantCode){
        this.$message({
          message: '请先选择租户',
          type: 'error'
        })
        return ;
      }
      globalUserApi.page(this.queryParams).then(response => {
        const res = response.data
        if (res.isSuccess) {
          this.tableData = res.data
        }
      }).finally(() => {
        this.loading = false
        return true
      })
    },
    codeChange() {
      this.fetch()
    },
    sortChange(val) {
      this.queryParams.sort = val.prop
      this.queryParams.order = val.order
      if (this.queryParams.sort) {
        this.search()
      }
    },
    filterChange(filters) {
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
    cellClick(row, column) {
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
<style lang="scss" scoped>
</style>
