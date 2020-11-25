<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.smsSendStatus.receiver')" class="filter-item search-item"
                v-model="queryParams.model.receiver"/>
      <el-input :placeholder="$t('table.smsSendStatus.bizId')" class="filter-item search-item"
                v-model="queryParams.model.bizId"/>
      <el-input :placeholder="$t('table.smsSendStatus.ext')" class="filter-item search-item" v-model="queryParams.model.ext"/>
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
    </div>

    <el-table
      :data="tableData.records"
      :key="tableKey"
      @filter-change="filterChange"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      @cell-click="cellClick"
      border fit row-key="id"
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
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
    <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current" :total="Number(tableData.total)"
                @pagination="fetch" v-show="tableData.total>0"/>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import smsSendStatusApi from '@/api/SmsSendStatus.js'
  import {convertEnum} from '@/utils/utils'
  import { initMsgEnums, initQueryParams } from '@/utils/commons'

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
        queryParams: initQueryParams({
          model: {taskId: 0}
        }),
        selection: [],
        // 以下已修改
        loading: false,
        tableData: {
          total: 0
        },
        enums: {SendStatus: {}}

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
      initMsgEnums('SendStatus', this.enums)
    },
    methods: {
      onSelectChange(selection) {
        this.selection = selection
      },
      search() {
        this.fetch({
          ...this.queryParams
        })
      },
      setTaskId(taskId) {
        this.queryParams.model.taskId = taskId
        this.fetch({
          ...this.queryParams
        })
      },
      reset() {
        const taskId = this.queryParams.model.taskId
        this.queryParams = initQueryParams({
          model: {taskId: taskId}
        })
        this.$refs.table.clearSort()
        this.$refs.table.clearFilter()
        this.search()
      },
      clearSelections() {
        this.$refs.table.clearSelection()
      },
      fetch(params = {}) {
        this.loading = true;
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        smsSendStatusApi.page(this.queryParams).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.tableData = res.data;
          }
        }).finally(() => this.loading = false);
      },
      sortChange(val) {
        this.queryParams.sort = val.prop;
        this.queryParams.order = val.order;
        if (this.queryParams.sort) {
          this.search();
        }
      },
      filterChange(filters) {
        for (const key in filters) {
          if (key.includes('.')) {
            const val = {};
            val[key.split('.')[1]] = filters[key][0];
            this.queryParams.model[key.split('.')[0]] = val;
          } else {
            this.queryParams.model[key] = filters[key][0]
          }
        }
        this.search()
      },
      cellClick (row, column) {
        if (column['columnKey'] === "operation") {
          return;
        }
        let flag = false;
        this.selection.forEach((item)=>{
          if(item.id === row.id) {
            flag = true;
            this.$refs.table.toggleRowSelection(row);
          }
        })
        if(!flag){
          this.$refs.table.toggleRowSelection(row, true);
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
