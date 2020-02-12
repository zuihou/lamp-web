<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.smsSendStatus.receiver')" class="filter-item search-item"
                v-model="queryParams.receiver"/>
      <el-input :placeholder="$t('table.smsSendStatus.bizId')" class="filter-item search-item"
                v-model="queryParams.bizId"/>
      <el-input :placeholder="$t('table.smsSendStatus.ext')" class="filter-item search-item" v-model="queryParams.ext"/>
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
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
      <el-table-column align="center" type="selection" width="40px"/>
      <el-table-column :label="$t('table.smsSendStatus.receiver')" :show-overflow-tooltip="true" align="center"
                       prop="receiver" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="sendStatusFilters"
        :label="$t('table.smsSendStatus.sendStatus')"
        :show-overflow-tooltip="true"
        align="center"
        column-key="sendStatus"
        prop="sendStatus"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sendStatus.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.smsSendStatus.bizId')" :show-overflow-tooltip="true" align="center"
                       prop="bizId">
        <template slot-scope="scope">
          <span>{{ scope.row.bizId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsSendStatus.ext')" :show-overflow-tooltip="true" align="center" prop="ext"
                       width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.ext }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsSendStatus.code')" :show-overflow-tooltip="true" align="center" prop="code"
                       width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsSendStatus.message')" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsSendStatus.fee')" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" align="center" prop="createTime" sortable="custom" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="pagination.size" :page.sync="pagination.current" :total="Number(tableData.total)"
                @pagination="fetch" v-show="tableData.total>0"/>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import smsSendStatusApi from '@/api/SmsSendStatus.js'
  import {convertEnum} from '@/utils/utils'
  import {initMsgsEnums} from '@/utils/commons'

  export default {
    name: 'SmsSendStatusManage',
    components: {Pagination},
    filters: {
      statusFilter(status) {
        const map = {
          false: 'danger',
          true: 'success'
        }
        return map[status] || 'success'
      }
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialog: {
          isVisible: false,
          type: 'add'
        },
        tableKey: 0,
        // total: 0,
        queryParams: {
          taskId: 0
        },
        sort: {},
        selection: [],
        // 以下已修改
        loading: false,
        tableData: {
          total: 0
        },
        enums: {SendStatus: {}},
        pagination: {
          size: 10,
          current: 1
        }
      }
    },
    computed: {
      sendStatusFilters() {
        return convertEnum(this.enums.SendStatus)
      },
      isVisible: {
        get() {
          return this.dialogVisible
        },
        set() {
          // this.close()
          // this.reset()
        }
      },
    },
    mounted() {
      initMsgsEnums('SendStatus', this.enums)
    },
    methods: {
      onSelectChange(selection) {
        this.selection = selection
      },
      search() {
        this.fetch({
          ...this.queryParams,
          ...this.sort
        })
      },
      setTaskId(taskId) {
        this.queryParams.taskId = taskId
        this.fetch({
          ...this.queryParams,
          ...this.sort
        })
      },
      reset() {
        const taskId = this.queryParams.taskId
        this.queryParams = {taskId: taskId}
        this.sort = {}
        this.$refs.table.clearSort()
        this.$refs.table.clearFilter()
        this.search()
      },
      clearSelections() {
        this.$refs.table.clearSelection()
      },
      fetch(params = {}) {
        this.loading = true
        params.size = this.pagination.size
        params.current = this.pagination.current
        smsSendStatusApi.page(params)
          .then((response) => {
            const res = response.data
            this.loading = false
            this.tableData = res.data
          })
      },
      sortChange(val) {
        this.sort.field = val.prop
        this.sort.order = val.order
        this.search()
      },
      filterChange(filters) {
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
