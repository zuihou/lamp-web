<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.activitiModel.name')"
        clearable
        class="filter-item search-item"
        v-model="queryParams.model.name"
      />
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
      <el-button @click="singleAddView" class="filter-item" plain type="danger">
        {{ $t("table.add") }}
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
        :label="$t('table.activitiModel.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
        width="250px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.activitiModel.key')"
        :show-overflow-tooltip="true"
        align="center"
        width="300px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.activitiModel.description')"
        :show-overflow-tooltip="true"
        align="center"
        width="300px"
      >
        <template slot-scope="scope">
          <span>{{ JSON.parse(scope.row.metaInfo).description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.activitiModel.version')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag type="success">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.activitiModel.status')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.deploymentId ? 'success' : 'warning'">{{ scope.row.deploymentId ? "已发布" : "未发布" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        :show-overflow-tooltip="true"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.activitiModel.lastUpdateTime')"
        align="center"
        prop="createTime"
        sortable="custom"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastUpdateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        column-key="operation"
        class-name="small-padding fixed-width"
        width="150px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <i
            title="编辑模型"
            @click="singleEdit(row)"
            class="el-icon-setting table-operation"
            style="color: #f50;"
          />
          <i
            title="流程发布"
            @click="singlePublish(row)"
            class="el-icon-s-promotion table-operation"
            style="color: #00e1ff;"
          />
          <i
            title="导出流程ZIP"
            @click="singleExport(row)"
            class="el-icon-download table-operation"
            style="color: #59ff00;"
          />
          <i
            title="删除"
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #ff0000;"
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

    <el-dialog
      title="新增模型"
      :visible.sync="addVisible"
      @close="addClose">
      <div style="margin-top:30px;">
        <el-form id="model" :model="subForm" label-position="left" label-width="80px" ref="form" :inline="true"  style="text-align:left">
          <el-row  style="margin: 0 auto;width:80%;">
            <el-col :span="12">
              <el-form-item label="模型名:" prop="name">
                <el-input
                  v-model="subForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型KEY:" prop="key">
                <el-input
                  v-model="subForm.key"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="描述:" prop="description">
                <el-input
                  v-model="subForm.description"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item size="large" align="center" style="text-align:center;width:100%">
            <el-button @click="addClose" plain type="warning">{{ $t('common.cancel') }}</el-button>
            <el-button @click="singleAdd" plain type="primary">{{ $t('common.confirm') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import ModelEdit from "./edit";
import activitiApi from "@/api/Activiti.js";
import {  initQueryParams } from '@/utils/commons'
function subForm() {
  return {
    name: '',
    key: '',
    description: '',
  }
}
export default {
  name: "ModelManage",
  components: { Pagination, ModelEdit },
  filters: {},
  data() {
    return {
      dialogVisible: false,
      addVisible: false,
      dialogImageUrl: "",
      subForm: subForm(),
      dialog: {
        isVisible: false,
        type: "add"
      },
      tableKey: 0,
      queryParams: initQueryParams({
        model:{}
      }),
      url: process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX,
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

      activitiApi.pageModel(this.queryParams).then(response => {
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
    addClose() {
      this.addVisible = false
      this.subForm = subForm()
    },
    search() {
      this.fetch({
        ...this.queryParams
      });
    },
    reset() {
      this.queryParams = initQueryParams({
        model:{}
      });
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    singleAddView() {
      this.addVisible = true
    },
    singleAdd() {
      const vm = this
      activitiApi.addModel(vm.subForm).then(response => {
        const res = response.data;
          if (res.isSuccess) {
            this.$message({
              message: this.$t("tips.createSuccess"),
              type: 'success'
            });
            vm.$refs.modelEdit.open(res.data)
            vm.addClose()
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            });
          }
      }).finally();
    },
    singleEdit(row) {
      this.$refs.modelEdit.open(row.id)
    },
    singleDelete(row) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        })
        .then(() => {
          this.delete(row);
        })
        .catch(() => {
          this.reset();
        });
    },
    singlePublish(row) {
      const vm = this
      this.$confirm(this.$t("tips.confirmPublish"), this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        })
        .then(() => {
          this.publish(row);
        })
        .catch((err) => {
          this.reset();
        });
    },
    singleExport(row) {
      const vm = this
      this.export(row);
    },
    export(row) {
      const vm = this
      var url = `/api/activiti/static/exportXMLByModelId?modelId=${row.id}`;
      window.location.href = url;
    },
    delete(row) {
      activitiApi.deleteModel({modelId: row.id}).then(response => {
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
      }).finally();
    },
    publish(row) {
      activitiApi.publishModel({modelId: row.id}).then(response => {
        const res = response.data;
          if (res.isSuccess) {
            this.$message({
              message: this.$t("tips.publishSuccess"),
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

/deep/.el-table:not(.el-table--scrollable-x) {
    .el-table__fixed-right {
        height: calc(100% - 1px) !important;
    }
}
</style>
