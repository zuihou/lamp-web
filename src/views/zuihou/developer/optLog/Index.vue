<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.userName"
        :placeholder="$t(&quot;table.optLog.userName&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.requestIp"
        :placeholder="$t(&quot;table.optLog.requestIp&quot;)"
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
        v-has-any-permission="[&quot;optLog:delete&quot;,&quot;optLog:export&quot;]"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-has-permission="[&quot;optLog:delete&quot;]"
            @click.native="batchDelete"
          >
            {{ $t('table.delete') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;optLog:export&quot;]"
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
        :label="$t(&quot;table.optLog.userName&quot;)"
        prop="userName"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.optLog.requestUri&quot;)"
        prop="requestUri"
        :show-overflow-tooltip="true"
        align="left"
        min-width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.optLog.httpMethod&quot;)"
        prop="httpMethod"
        column-key="httpMethod"
        :filters="httpMethodFilters"
        :filter-multiple="false"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.httpMethod.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.optLog.requestIp&quot;)"
        prop="requestIp"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestIp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.optLog.description&quot;)"
        prop="description"
        :show-overflow-tooltip="true"
        align="center"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t(&quot;table.optLog.type&quot;)"
        prop="type"
        column-key="type"
        :show-overflow-tooltip="true"
        :filters="typeFilters"
        :filter-multiple="false"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <span>
            <el-badge
              is-dot
              class="item"
              :type="(scope.row.type && scope.row.type.code == &quot;OPT&quot;)? &quot;success&quot;:&quot;danger&quot; "
            />
            {{ scope.row.type.desc }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.optLog.actionMethod&quot;)"
        prop="actionMethod"
        :show-overflow-tooltip="true"
        align="center"
        min-width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.classPath + '.' + scope.row.actionMethod }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t(&quot;table.optLog.startTime&quot;)"
        prop="startTime"
        :show-overflow-tooltip="true"
        align="center"
        width="170px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.optLog.consumingTime&quot;)"
        prop="consumingTime"
        :show-overflow-tooltip="true"
        align="center"
        width="110px"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.consumingTime | timeFilter">
            {{ transTime(row.consumingTime) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="ua"
        label="终端 | 浏览器"
        width="120"
        :formatter="uaForamt"
      />
      <el-table-column
        :label="$t(&quot;table.operation&quot;)"
        align="center"
        width="110px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <i
            v-has-permission="[&quot;optLog:delete&quot;]"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />
          <i
            v-has-permission="[&quot;optLog:view&quot;]"
            class="el-icon-view table-operation"
            style="color: #f50;"
            @click="onView(row)"
          />
          <el-link
            v-has-no-permission="[&quot;optLog:delete&quot;,&quot;optLog:view&quot;]"
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

    <el-drawer
      v-model="currentRow"
      :visible.sync="drawer"
      :before-close="closeDrawer"
      direction="rtl"
    >
      <div
        slot="title"
        class="clearfix"
      >
        <el-badge
          is-dot
          class="item"
          :type="(currentRow.type && currentRow.type.code == &quot;OPT&quot;)? &quot;success&quot;:&quot;danger&quot; "
        />
        {{ currentRow.type ? currentRow.type.desc : '' }}
        {{ currentRow.requestUri }}
      </div>
      <el-scrollbar style="height: 100%;">
        <el-card class="box-card">
          <div class="box-item">
            <span class="field-label">执行方法:</span>
            <aside>{{ currentRow.classPath + '.' + currentRow.actionMethod + '()' }}</aside>
          </div>

          <div class="box-item">
            <span class="field-label">请求参数:</span>
            <aside style>
              {{ currentRow.params }}
            </aside>
          </div>

          <div class="box-item">
            <span class="field-label">响应信息:</span>
            <aside style>
              <pre style="white-space: pre-wrap;">{{ currentRow.result ? JSON.stringify(JSON.parse(currentRow.result), null, 4) : '' }}</pre>
            </aside>
          </div>
          <div
            v-if="currentRow.type && currentRow.type[&quot;code&quot;]===&quot;EX&quot;"
            class="box-item"
          >
            <span class="field-label">错误信息:</span>
            <aside>{{ currentRow.exDetail }}</aside>
          </div>
        </el-card>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { readUserAgent } from '@/utils/utils'
import optLogApi from '@/api/OptLog.js'

export default {
  name: 'OptLog',
  components: { Pagination },
  filters: {
    timeFilter (time) {
      if (time < 500) {
        return 'success'
      } else if (time < 1000) {
        return ''
      } else if (time < 1500) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  data () {
    return {
      tableKey: 0,
      loading: false,
      queryParams: {
        type: null,
        httpMethod: null
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
    typeFilters () {
      return this.conver(this.$store.state.common.enums.LogType)
    },
    httpMethodFilters () {
      return this.conver(this.$store.state.common.enums.HttpMethod)
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    conver (obj) {
      const list = []
      if (obj) {
        for (let key in obj) {
          list.push({
            text: obj[key],
            value: key
          })
        }
      }
      return list
    },
    onSelectChange (selection) {
      this.selection = selection
    },
    exportExcel () {

    },
    // filterHttpMethod (value, row) {
    //   return row.httpMethod.code === value
    // },
    // filterStatus (value, row) {
    //   return row.type.code === value
    // },
    fetch (params = {}) {
      params.current = this.pagination.current
      params.size = this.pagination.size
      if (this.queryParams.timeRange) {
        params.startCreateTime = this.queryParams.timeRange[0]
        params.endCreateTime = this.queryParams.timeRange[1]
      }
      this.loading = true

      optLogApi.page(params)
        .then((r) => {
          this.tableData = r.data
          this.loading = false
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
      optLogApi.delete({ ids: logIds })
        .then(() => {
          this.$message({
            message: this.$t('tips.deleteSuccess'),
            type: 'success'
          })
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
    transTime (time) {
      return `${time} ms`
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
    uaForamt (row) {
      let ua = readUserAgent(row.ua)
      return ua.terminal + '  |  ' + ua.browser
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
