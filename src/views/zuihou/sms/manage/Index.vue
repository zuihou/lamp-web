<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.smsTask.templateId')" class="filter-item search-item" v-model="queryParams.templateId" />
      <el-input :placeholder="$t('table.smsTask.topic')" class="filter-item search-item" v-model="queryParams.topic" />
      <el-input :placeholder="$t('table.smsTask.content')" class="filter-item search-item" v-model="queryParams.content" />
      <el-date-picker
        :range-separator="null"
        class="filter-item search-item date-range-item"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        type="daterange"
        v-model="queryParams.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['sms:manage:add','sms:manage:delete','sms:manage:export']">
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link :to="{path:'/sms/manage/edit',query: {type: 'add'}}">
            <el-dropdown-item v-has-permission="['sms:manage:add']">{{ $t('table.add') }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['sms:manage:delete']">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['sms:manage:export']">{{ $t('table.export') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :data="tableData.records"
      :key="tableKey"
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
      <el-table-column :label="$t('table.smsTask.templateId')" :show-overflow-tooltip="true" align="center" prop="templateId" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.templateId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTask.receiver')" :show-overflow-tooltip="true" align="center" prop="receiver">
        <template slot-scope="scope">
          <span>{{ scope.row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTask.topic')" :show-overflow-tooltip="true" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.topic }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTask.content')" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column :filter-multiple="false" :filters="statusFilters" :label="$t('table.smsTask.status')" :show-overflow-tooltip="true" class-name="status-col" column-key="status" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.sendTime">
            <el-tooltip :content="'发送时间: '+ scope.row.sendTime" class="item" effect="dark" placement="top">
              <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status.desc }}</el-tag>
            </el-tooltip>
          </span>
          <span v-else>
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status.desc }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="[{ text: $t('common.yes'), value: 'true' }, { text: $t('common.no'), value: 'false' }]"
        :label="$t('table.smsTask.draft')"
        align="center"
        column-key="draft"
        prop="draft"
        width="100px"
      >
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.draft?'danger':'success'" slot>{{ scope.row.draft ? '是' : '否' }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" align="center" prop="createTime" sortable="custom" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" class-name="small-padding fixed-width" width="100px">
        <template slot-scope="{row}">
          <i @click="view(row)" class="el-icon-view table-operation" style="color: #2db7f5;" v-hasPermission="['sms:manage:view']" />
          <i @click="edit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;" v-hasPermission="['sms:manage:update']" v-show="row.draft" />
          <i @click="copy(row)" class="el-icon-copy-document table-operation" style="color: #909399;" v-hasPermission="['sms:manage:copy']" />
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;" v-hasPermission="['sms:manage:delete']" />
          <el-link class="no-perm" v-has-no-permission="['sms:manage:update','sms:manage:delete','sms:manage:copy','sms:manage:view']">{{ $t('tips.noPermission') }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="pagination.size" :page.sync="pagination.current" :total="Number(tableData.total)" @pagination="fetch" v-show="tableData.total>0" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import smsTaskApi from '@/api/SmsTask.js'
import { convertEnum } from '@/utils/utils'
import { initMsgsEnums } from '@/utils/commons'

export default {
  name: 'StationManage',
  components: { Pagination },
  filters: {
    statusFilter (status) {
      const map = {
        WAITING: 'danger',
        SUCCESS: 'success',
        FAIL: 'error'
      }
      return map[status] || 'success'
    }
  },
  data () {
    return {
      dialog: {
        isVisible: false,
        type: 'add'
      },
      tableKey: 0,
      queryParams: {},
      sort: {},
      selection: [],
      // 以下已修改
      loading: false,
      tableData: {
        total: 0
      },
      enums:{ TaskStatus: {}},
      pagination: {
        size: 10,
        current: 1
      }
    }
  },
  computed: {
    statusFilters () {
      return convertEnum(this.enums.TaskStatus)
    }
  },
  watch: {
    '$route' (to) {
      if(to.path === '/sms/manage'){
        this.fetch();
      }
    }
  },
  mounted () {
    initMsgsEnums(['TaskStatus'], this.enums)
    this.fetch()
  },
  methods: {
    filterStatus (value, row) {
      return row.status === value
    },
    onSelectChange (selection) {
      this.selection = selection
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
    exportExcel () {
      this.$message({
        message: '待完善',
        type: 'warning'
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
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const ids = []
        this.selection.forEach((u) => {
          ids.push(u.id)
        })
        this.delete(ids)
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (ids) {
      smsTaskApi.delete({ 'ids': ids })
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
    copy (row) {
      this.$router.push({
        path: '/sms/manage/edit',
        query: {
          id: row.id,
          type: 'copy'
        }
      })
    },
    view (row) {
      this.$router.push({
        path: '/sms/manage/edit',
        query: {
          id: row.id,
          type: 'view'
        }
      })
    },
    edit (row) {
      this.$router.push({
        path: '/sms/manage/edit',
        query: {
          id: row.id,
          type: 'edit'
        }
      })
    },
    fetch (params = {}) {
      this.loading = true
      params.size = this.pagination.size
      params.current = this.pagination.current
      if (this.queryParams.timeRange) {
        params.startCreateTime = this.queryParams.timeRange[0]
        params.endCreateTime = this.queryParams.timeRange[1]
      }
      smsTaskApi.page(params)
        .then((response) => {
          const res = response.data
          this.loading = false
          if (res.isError) {
            return
          }
          this.tableData = res.data
        })
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
