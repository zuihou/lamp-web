<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams.model" class="demo-form-inline">
        <el-form-item label="待办类型">
          <el-select v-model="isHist" placeholder="待办类型">
            <el-option
              v-for="item in isHistType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.ruTaskModel.name')">
          <el-input
            :placeholder="$t('table.ruTaskModel.name')"
            class="filter-item search-item"
            v-model="queryParams.model.name"
          />
        </el-form-item>
      </el-form>
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
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
        :label="$t('table.ruTaskModel.id')"
        :show-overflow-tooltip="true"
        align="left"
        prop="id"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ruTaskModel.name')"
        :show-overflow-tooltip="true"
        align="center"
        width="250px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ruTaskModel.reasonReimbursement')"
        :show-overflow-tooltip="true"
        align="center"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.biz.data.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ruTaskModel.typeReimbursement')"
        :show-overflow-tooltip="true"
        align="center"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.biz.data.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ruTaskModel.suspendStateName')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSuspended != null" :type="scope.row.isSuspended ? 'warning' : 'success'">{{ scope.row.isSuspended ? '已挂起' : '已激活' }}</el-tag>
          <el-tag v-else type="info"> 已结束 </el-tag>
        </template>

      </el-table-column>
      <el-table-column
        label="备注"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.item && scope.row.item.data ? scope.row.item.data.itemRemake : '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.ruTaskModel.startUser')"
        :show-overflow-tooltip="true"
        align="center"
        width="250px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.inst.data.startUser.data }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ruTaskModel.createTime')"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.inst.data.startTime }}</span>
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
            v-if="!isHist"
            title="转办"
            @click="singleTransView(row)"
            class="el-icon-d-arrow-right table-operation"
            style="color: #f50;"
          />
          <!-- <i
            v-if="row.isSuspended"
            @click="singleUpdate(row)"
            class="el-icon-video-pause table-operation"
            style="color: #5f0;"
          />
          <i
            v-if="!row.isSuspended"
            @click="singleUpdate(row)"
            class="el-icon-video-play table-operation"
            style="color: #f50;"
          />
          <i
            @click="singlePublish(row)"
            class="el-icon-s-promotion table-operation"
            style="color: #f50;"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
          /> -->
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
    <ModelEdit ref="modelEdit"></ModelEdit>
    <el-dialog
      title="转办"
      :visible.sync="taskTransVisible"
      @close="taskTransVisibleClose">
      <div id="userView" class="edit-view">
          <el-select v-model="targetUser" placeholder="待办类型">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="singleTrans" class="filter-item" plain type="primary">
            确定
          </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import ModelEdit from "./Edit";
import activitiApi from "@/api/Activiti.js";
import userApi from "@/api/User.js";
import { renderSize } from "@/utils/utils";
import { onlinePreview } from "@/settings";
import { downloadFile, initQueryParams } from '@/utils/commons'

export default {
  name: "RuTaskManage",
  components: { Pagination, ModelEdit },
  filters: {},
  data() {
    return {
      dialogVisible: false,
      taskTransVisible: false,
      dialogImageUrl: "",
      dialog: {
        isVisible: false,
        type: "add"
      },
      tableKey: 0,
      isHist: false,
      queryParams: initQueryParams({
        model:{}
      }),
      suspendStateType: {
        start: '1',
        stop: '2'
      },
      isHistType: [{
        value: false, label: '待办任务'
      }, {
        value: true, label: '已办任务'
      }],
      users: [],
      selection: [],
      loading: false,
      tableData: {
        records: [],
        total: 0
      },
      targetUser: null,
      targetRow: null,
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
      var api;
      if (this.isHist) {
        api = activitiApi.pageHiTaskReimbursement(this.queryParams)
      } else {
        api = activitiApi.pageTaskReimbursement(this.queryParams)
      }
      api.then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.tableData.records = res.data.records;
          this.tableData.total = res.data.total;
        }
      }).finally(() => this.loading = false);
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
    },
    editClose() {
      this.reset()
    },
    taskTransVisibleClose() {
      this.reset()
      this.targetUser = null
      this.targetRow = null
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
    singleTransView(row) {
      const vm = this;
      vm.taskTransVisible = true;
      this.targetRow = row
      userApi.find({}).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          vm.users = res.data;
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          });
        }
      }).finally(() => this.loading = false);
    },
    singleTrans(row) {
      const vm = this;
      var data = {
        taskId: vm.targetRow.id,
        userId: vm.targetUser
      }
      activitiApi.updateAssignee(data).then(response => {
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
    singleUpdate(row) {
      const vm = this;
      var data = {
        instId: row.procInstId,
        suspendState: row.suspendState
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
      activitiApi.deleteInst(data).then(response => {
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
div{
  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
