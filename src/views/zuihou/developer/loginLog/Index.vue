<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.account"
        :placeholder="$t(&quot;table.loginLog.account&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.location"
        :placeholder="$t(&quot;table.loginLog.location&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.requestIp"
        :placeholder="$t(&quot;table.loginLog.requestIp&quot;)"
        class="filter-item search-item"
      />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="$t(&quot;table.createTime&quot;)"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        class="filter-item search-item date-range-item"
        type="datetimerange"
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
        v-has-any-permission="[&quot;loginLog:delete&quot;,&quot;loginLog:export&quot;]"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-has-permission="[&quot;loginLog:delete&quot;]"
            @click.native="batchDelete"
          >
            {{ $t('table.delete') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;loginLog:export&quot;]"
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
    >
      <el-table-column
        type="selection"
        align="center"
        width="40px"
      />
      <el-table-column
        :label="$t(&quot;table.loginLog.userName&quot;)"
        prop="userName"
        :show-overflow-tooltip="true"
        align="center"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.loginLog.requestIp&quot;)"
        prop="requestIp"
        :show-overflow-tooltip="true"
        align="center"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestIp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.loginLog.browser&quot;)"
        prop="browser"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.loginLog.browserVersion&quot;)"
        prop="browserVersion"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.browserVersion }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t(&quot;table.loginLog.operatingSystem&quot;)"
        prop="operatingSystem"
        :show-overflow-tooltip="true"
        align="center"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.operatingSystem }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.loginLog.location&quot;)"
        prop="location"
        :show-overflow-tooltip="true"
        align="center"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.loginLog.loginDate&quot;)"
        prop="createTime"
        :show-overflow-tooltip="true"
        align="center"
        width="170px"
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
            v-has-permission="[&quot;loginLog:delete&quot;]"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />

          <el-link
            v-has-no-permission="[&quot;loginLog:delete&quot;]"
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
import loginLogApi from '@/api/LoginLog.js'

export default {
  name: 'LoginLog',
  components: { Pagination },
  filters: {

  },
  data () {
    return {
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

      loginLogApi.page(params)
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
      loginLogApi.delete({ ids: logIds })
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
    }
  }
}
</script>

