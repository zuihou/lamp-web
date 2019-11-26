<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.templateId"
        :placeholder="$t(&quot;table.smsTask.templateId&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.topic"
        :placeholder="$t(&quot;table.smsTask.topic&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.content"
        :placeholder="$t(&quot;table.smsTask.content&quot;)"
        class="filter-item search-item"
      />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        class="filter-item search-item date-range-item"
        type="daterange"
      />
      <el-button
        class="filter-item"
        type="primary"
        plain
        @click="search"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        type="warning"
        plain
        @click="reset"
      >
        {{ $t('table.reset') }}
      </el-button>
      <el-dropdown
        v-has-any-permission="[&quot;sms:manage:add&quot;,&quot;sms:manage:delete&quot;,&quot;sms:manage:export&quot;]"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link :to="{path:&quot;/sms/manage/edit&quot;,query: {type: &quot;add&quot;}}">
            <el-dropdown-item v-has-permission="[&quot;sms:manage:add&quot;]">
              {{ $t('table.add') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item
            v-has-permission="[&quot;sms:manage:delete&quot;]"
            @click.native="batchDelete"
          >
            {{ $t('table.delete') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;sms:manage:export&quot;]"
            @click.native="exportExcel"
          >
            {{ $t('table.export') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="tableData.records"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      @filter-change="filterChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="40px"
      />
      <el-table-column
        :label="$t(&quot;table.smsTask.templateId&quot;)"
        prop="templateId"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.templateId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.smsTask.receiver&quot;)"
        prop="receiver"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.smsTask.topic&quot;)"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.topic }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.smsTask.content&quot;)"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.smsTask.status&quot;)"
        :filters="statusFilters"
        column-key="status"
        :filter-multiple="false"
        :show-overflow-tooltip="true"
        class-name="status-col"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.sendTime">
            <el-tooltip
              class="item"
              effect="dark"
              :content="&quot;发送时间: &quot;+ scope.row.sendTime"
              placement="top"
            >
              <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status.desc }}</el-tag>
            </el-tooltip>
          </span>
          <span v-else>
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status.desc }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.smsTask.draft&quot;)"
        prop="draft"
        column-key="draft"
        :filters="[{ text: $t(&quot;common.yes&quot;), value: &quot;true&quot; }, { text: $t(&quot;common.no&quot;), value: &quot;false&quot; }]"
        :filter-multiple="false"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>
            <el-tag
              slot
              :type="scope.row.draft?&quot;danger&quot;:&quot;success&quot;"
            >{{ scope.row.draft ? '是' : '否' }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.createTime&quot;)"
        prop="createTime"
        align="center"
        width="170px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.operation&quot;)"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <i
            v-hasPermission="[&quot;sms:manage:view&quot;]"
            class="el-icon-view table-operation"
            style="color: #2db7f5;"
            @click="view(row)"
          />
          <i
            v-show="row.draft"
            v-hasPermission="[&quot;sms:manage:update&quot;]"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            @click="edit(row)"
          />
          <i
            v-hasPermission="[&quot;sms:manage:copy&quot;]"
            class="el-icon-copy-document table-operation"
            style="color: #909399;"
            @click="copy(row)"
          />
          <i
            v-hasPermission="[&quot;sms:manage:delete&quot;]"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />
          <el-link
            v-has-no-permission="[&quot;sms:manage:update&quot;,&quot;sms:manage:delete&quot;,&quot;sms:manage:copy&quot;,&quot;sms:manage:view&quot;]"
            class="no-perm"
          >
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableData.total>0"
      :total="Number(tableData.total)"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="fetch"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import smsTaskApi from '@/api/SmsTask.js'
import { converEnum } from '@/utils/utils'

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
      pagination: {
        size: 10,
        current: 1
      }
    }
  },
  computed: {
    statusFilters () {
      return converEnum(this.$store.state.common.enums.TaskStatus)
    }
  },
  watch: {
    $route () {
      this.fetch()
    }
  },
  mounted () {
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
