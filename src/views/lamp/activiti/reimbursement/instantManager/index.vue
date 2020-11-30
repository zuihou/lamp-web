<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams.model" class="demo-form-inline">
        <el-form-item label="查看范围">
          <el-select v-model="queryParams.model.isMine" placeholder="查看范围">
            <el-option
              v-for="item in isMine"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成状态">
          <el-select v-model="queryParams.model.isOver" placeholder="完成状态">
            <el-option
              v-for="item in isOver"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label="$t('table.instantReimbursementModel.name')">
          <el-input
            :placeholder="$t('table.instantReimbursementModel.name')"
            clearable
            class="filter-item search-item"
            v-model="queryParams.model.name"
          />
        </el-form-item>
        <el-button @click="search" class="filter-item" plain type="primary">
          {{ $t("table.search") }}
        </el-button>
        <el-button @click="reset" class="filter-item" plain type="warning">
          {{ $t("table.reset") }}
        </el-button>
        <el-button @click="singleFormView({})" class="filter-item" plain type="primary">
          {{ $t("table.add") }}
        </el-button>
      </el-form>
    </div>

    <el-table
      :data="tableData.records"
      :key="tableKey"
      border fit row-key="id"
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
      <el-table-column
        :label="$t('table.instantReimbursementModel.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.instantReimbursementModel.type')"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.instantReimbursementModel.amount')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
        width="250px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.instantReimbursementModel.isOver')"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isOver ? '已完成' : '未完成' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.instantReimbursementModel.suspendStateName')"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >

        <template slot-scope="scope">
          <el-tag v-if="scope.row.inst.data && scope.row.inst.data.id"
                  :type=" scope.row.inst.data.suspendState === suspendStateType.start ? 'success' : 'warning'">
            {{ scope.row.inst.data.suspendState === suspendStateType.start ? '已激活' : '已挂起'}}
          </el-tag>
          <el-tag v-else type="info"> 已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.instantReimbursementModel.createTime')"
        align="center"
        :show-overflow-tooltip="true"
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
        width="120px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <i
            title="查看详情"
            @click="singleDetail(row)"
            class="el-icon-view table-operation"
            style="color: #f50;"
          />
          <i
            title="修改状态"
            v-if="row.inst.data && row.inst.data.suspendState === suspendStateType.start"
            @click="singleUpdate(row)"
            class="el-icon-video-pause table-operation"
            style="color: #5f0;"
          />
          <i
            title="修改状态"
            v-if="row.inst.data && row.inst.data.suspendState === suspendStateType.stop"
            @click="singleUpdate(row)"
            class="el-icon-video-play table-operation"
            style="color: #f50;"
          />
          <!-- <i
            @click="singlePublish(row)"
            class="el-icon-s-promotion table-operation"
            style="color: #f50;"
          /> -->
          <i
            title="删除"
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="Number(tableData.total)"
      @pagination="fetch"
      v-show="tableData.total > 0"
      align="center"
    />
    <ModelEdit
      ref="edit"
    />
    <ModelEdit ref="modelEdit"></ModelEdit>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import ModelEdit from "./edit";
import activitiApi from "@/api/Activiti.js";
import {initQueryParams} from '@/utils/commons'

function subForm() {
  return {
    model: {
      isMine: true,
      isOver: null
    }
  }
}

export default {
  name: "InstantManage",
  components: {Pagination, ModelEdit},
  filters: {},
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      dialog: {
        isVisible: false,
        type: "add"
      },
      tableKey: 0,
      queryParams: initQueryParams(subForm()),
      suspendStateType: {
        start: '1',
        stop: '2'
      },
      isMine: [{
        value: true, label: '自己'
      }, {
        value: false, label: '所有人'
      }],
      isOver: [{
        value: null, label: '所有'
      }, {
        value: true, label: '已完成'
      }, {
        value: false, label: '未完成'
      }],
      selection: [],
      loading: false,
      tableData: {
        records: [],
        total: 0
      },
    };
  },
  computed: {},
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      this.queryParams.current = params.current ? params.current : this.queryParams.current;
      this.queryParams.size = params.size ? params.size : this.queryParams.size;

      activitiApi.pageInstantReimbursement(this.queryParams).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.tableData.records = res.data.records;
          this.tableData.total = res.data.total;
        }
      }).finally(() => this.loading = false);
    },
    cellClick(row, column) {
      if (column['columnKey'] === "operation") {
        return;
      }
      let flag = false;
      this.selection.forEach((item) => {
        if (item.id === row.id) {
          flag = true;
          this.$refs.table.toggleRowSelection(row);
        }
      })

      if (!flag) {
        this.$refs.table.toggleRowSelection(row, true);
      }
    },
    editClose() {
      this.reset()
    },
    search() {
      this.fetch({
        ...this.queryParams
      });
    },
    reset() {
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    singleUpdate(row) {
      const vm = this;
      var data = {
        instId: row.inst.data.id,
        suspendState: row.inst.data.suspendState
      }
      activitiApi.updateSuspendStateInst(data).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.$message({
            message: this.$t("tips.updateSuccess"),
            type: 'success'
          });
          this.search();
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          });
        }
      }).finally(() => this.loading = false);
    },
    singleFormView(row) {
      this.$refs.modelEdit.open(row)
    },
    singleDelete(row) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.delete({ids: [row.id]});
        })
        .catch(() => {
          this.reset();
        });
    },
    delete(data) {
      activitiApi.deleteInstReimbursement(data).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: 'success'
          });
          this.search();
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          });
        }
      }).finally(() => this.loading = false);
    },
    singleDetail(row) {
      this.singleFormView(row)
    },
    getFormQuery() {
      activitiApi.formQuery({}).then(response => {
        const res = response.data;
      }).finally(() => this.loading = false);
    }
  }
};
</script>
<style lang="scss" scoped>
.file-breadcrumb {
  margin: 10px 0px 20px;
}

.page {
  text-align: center;
  margin-top: 5px;
}

.button-list {
  margin-right: 10px;
  font-size: 20px !important;
  color: #22a2ed;
  vertical-align: middle;
}

.title {
  color: #777;
  font-size: 2em;
  border-bottom: 1px solid #e5e5e5;
}

div {
  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}

/deep/.el-table:not(.el-table--scrollable-x) {
    .el-table__fixed-right {
        height: calc(100% - 1px) !important;
    }
}
</style>
