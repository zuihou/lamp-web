<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.systemApi.code')" class="filter-item search-item" v-model="queryParams.code" />
      <el-input :placeholder="$t('table.systemApi.name')" class="filter-item search-item" v-model="queryParams.name" />
      <el-input :placeholder="$t('table.systemApi.serviceId')" class="filter-item search-item" v-model="queryParams.serviceId" />
      <el-date-picker
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        v-model="queryParams.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['systemApi:delete','systemApi:export']">
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add" v-has-permission="['systemApi:add']">{{ $t('table.add') }}</el-dropdown-item>
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['systemApi:delete']">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['systemApi:export']">{{ $t('table.export') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="tableData.records"
      :key="tableKey"
      @cell-click="cellClick"
      @filter-change="filterChange"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      border
      fit
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px" />
      <el-table-column :label="$t('table.systemApi.code')" :show-overflow-tooltip="true" align="center" prop="code">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.name')" :show-overflow-tooltip="true" align="left" min-width="120px" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.describe')" :show-overflow-tooltip="true" align="left" min-width="120px" prop="describe">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.requestMethod')" :show-overflow-tooltip="true" align="left" min-width="80px" prop="requestMethod">
        <template slot-scope="scope">
          <span>{{ scope.row.requestMethod }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.systemApi.contentType')" :show-overflow-tooltip="true" align="center" prop="contentType" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.contentType }}</span>
        </template>
      </el-table-column>-->
      <el-table-column :label="$t('table.systemApi.serviceId')" :show-overflow-tooltip="true" align="center" min-width="180px" prop="serviceId">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.path')" :show-overflow-tooltip="true" align="left" min-width="200px" prop="path">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.status')" :show-overflow-tooltip="true" align="center" prop="status" width="70px">
        <template slot-scope="scope">
          <el-badge :type="scope.row.status ? 'success' :'danger'" class="status-item" is-dot />
          <span>{{ scope.row.status? $t('common.status.valid') : $t('common.status.invalid') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.isAuth')" :show-overflow-tooltip="true" align="center" prop="isAuth" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.isAuth ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.isOpen')" :show-overflow-tooltip="true" align="center" prop="isOpen" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.isOpen? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.systemApi.isPersist')" :show-overflow-tooltip="true" align="center" prop="isOpen" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.isPersist? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.createTime')" :show-overflow-tooltip="true" align="center" prop="className" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" class-name="small-padding fixed-width" fixed="right" width="110px">
        <template slot-scope="{row}">
          <i @click="edit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;" v-has-permission="['systemApi:update']" />
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;" v-has-permission="['systemApi:delete']" />
          <i @click="onView(row)" class="el-icon-view table-operation" style="color: #87d068;" />
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="pagination.size" :page.sync="pagination.current" :total="Number(tableData.total)" @pagination="fetch" v-show="tableData.total>0" />

    <el-drawer :before-close="closeDrawer" :visible.sync="drawer" direction="rtl" v-model="currentRow">
      <div class="clearfix" slot="title">{{ currentRow.path }}</div>
      <el-scrollbar style="height: 100%;">
        <el-card class="box-card">
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.code') }}:</span>
            <aside>{{ currentRow.code }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.name') }}:</span>
            <aside style>{{ currentRow.name }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.describe') }}:</span>
            <aside style>{{ currentRow.describe }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.requestMethod') }}:</span>
            <aside style>{{ currentRow.requestMethod }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.contentType') }}:</span>
            <aside style>{{ currentRow.contentType }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.serviceId') }}:</span>
            <aside style>{{ currentRow.serviceId }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.path') }}:</span>
            <aside style>{{ currentRow.path }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.status') }}:</span>
            <aside style>{{ currentRow.status ? '是' : '否' }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.isPersist') }}:</span>
            <aside style>{{ currentRow.isPersist ? '是' : '否' }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.isAuth') }}:</span>
            <aside style>{{ currentRow.isAuth ? '是' : '否' }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.isOpen') }}:</span>
            <aside style>{{ currentRow.isOpen ? '是' : '否' }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.isPersist') }}:</span>
            <aside style>{{ currentRow.isPersist ? '是' : '否' }}</aside>
          </div>
          <div class="box-item">
            <span class="field-label">{{ $t('table.systemApi.className') }}:</span>
            <aside style>{{ currentRow.className + '.' + currentRow.methodName }}</aside>
          </div>
        </el-card>
      </el-scrollbar>
    </el-drawer>
    <system-api-edit :dialog-visible="dialog.isVisible" :type="dialog.type" @close="editClose" @success="editSuccess" ref="edit" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import SystemApiEdit from './Edit'
import systemApiApi from '@/api/SystemApi.js'

export default {
  name: 'SystemApi',
  components: { Pagination, SystemApiEdit },
  filters: {

  },
  data () {
    return {
      dialog: {
        isVisible: false,
        type: 'add'
      },
      tableKey: 0,
      loading: false,
      queryParams: {
      },
      sort: {},
      selection: [],
      tableData: {},
      pagination: {
        size: 10,
        current: 1
      },
      drawer: false,
      currentRow: {
      }
    }
  },
  computed: {

  },
  mounted () {
    this.fetch()
  },
  methods: {
    onSelectChange (selection) {
      this.selection = selection
    },
    exportExcel () {

    },

    fetch (params = {}) {
      params.current = this.pagination.current
      params.size = this.pagination.size
      if (this.queryParams.timeRange) {
        params.startCreateTime = this.queryParams.timeRange[0]
        params.endCreateTime = this.queryParams.timeRange[1]
      }
      this.loading = true

      systemApiApi.page(params)
        .then((response) => {
          const res = response.data
          this.loading = false
          this.tableData = res.data
        })
    },
    singleDelete (row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete () {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }

      const isPersist = this.selection.findIndex(item => item.isPersist)
      if (isPersist > -1) {
        this.$message({
          message: "不能删除内置数据",
          type: 'warning'
        })
        return
      }

      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const logIds = this.selection.map(item => item.id)
        this.delete(logIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (logIds) {
      systemApiApi.delete({ ids: logIds })
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
          }
          this.search()
        })
    },
    search () {
      this.fetch({
        ...this.queryParams,
        ...this.sort
      })
    },
    reset () {
      this.queryParams = {}
      this.sort = {}
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },

    sortChange (val) {
      this.sort.field = val.prop
      this.sort.order = val.order
      this.search()
    },
    filterChange (filters) {
      for (const key in filters) {
        this.queryParams[key] = filters[key][0]
      }
      this.search()
    },
    onView (row) {
      this.currentRow = row
      this.drawer = true
    },
    closeDrawer (done) {
      done()
      this.currentRow = {}
    },

    cellClick (row, column, cell, event) {
      var oInput = document.createElement('input');     //创建一个隐藏input（重要！）
      oInput.value = row[column.property];    //赋值

      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';
    },
    editClose () {
      this.dialog.isVisible = false
    },
    editSuccess () {
      this.search()
    },
    add () {
      this.dialog.type = 'add'
      this.dialog.isVisible = true
      this.$refs.edit.setSystemApi(false)
    },
    edit (row) {
      this.$refs.edit.setSystemApi(row)
      this.dialog.type = 'edit'
      this.dialog.isVisible = true
    }

  }
}
</script>
<style lang="scss" scoped>
.item {
  margin-top: 7px;
}
.drawer-item {
  margin-top: 6px;
}
.box-item {
  margin-top: 15px;
  aside {
    word-wrap: break-word;
    margin-top: 15px;
  }
  pre {
    white-space: pre-wrap;
    font-size: 0.8em;
    line-height: 1.5em;
  }
}
</style>
