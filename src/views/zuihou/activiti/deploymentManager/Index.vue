<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.definitionModel.name')"
        class="filter-item search-item"
        v-model="queryParams.model.name"
      />
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>

      <el-button @click="upload" class="filter-item" plain type="danger" v-has-permission="['file:add']">
        {{ $t("table.upload") }}
      </el-button>
    </div>


    <div class="filter-container">
    </div>
    <el-table
      :data="tableData.records"
      :key="tableKey"
      border fit row-key="id"
      ref="table"
      style="width: 100%;"
      v-loading="loading"
      id="imgs"
    >
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
      <el-table-column
        :label="$t('table.definitionModel.tenantId')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.tenantId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.definitionModel.id')"
        :show-overflow-tooltip="true"
        align="left"
        prop="id"
        width="350px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.definitionModel.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
        width="350px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.definitionModel.key')"
        :show-overflow-tooltip="true"
        align="center"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.definitionModel.version')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag type="success">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.definitionModel.suspendStateName')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.suspendState === suspendStateType.start ? 'success' : 'warning'">{{ scope.row.suspendStateName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.definitionModel.deploymentTime')"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deploymentTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        column-key="operation"
        class-name="small-padding fixed-width"
        width="200px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <i
            title="映射模型"
            @click="singleMappingrow(row)"
            class="el-icon-sort table-operation"
            style="color: #5f0;"
          />
          <i
            title="修改状态"
            v-if="row.suspendState === suspendStateType.start"
            @click="singleEdit(row)"
            class="el-icon-video-pause table-operation"
            style="color: #5f0;"
          />
          <i
            title="修改状态"
            v-if="row.suspendState === suspendStateType.stop"
            @click="singleEdit(row)"
            class="el-icon-video-play table-operation"
            style="color: #f50;"
          />
          <i
            title="查看流程图"
            @click="singleView(row)"
            class="el-icon-picture-outline table-operation"
            style="color: #f50;"
          />
          <i
            title="查看流程XML"
            @click="singleViewXML(row)"
            class="el-icon-picture-outline table-operation"
            style="color: #f50;"
          />
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
    <el-dialog
      title="流程图"
      :visible.sync="viewTag" :fullscreen="true" >
      <iframe  v-if="viewTag" :src="viewUrl" style="width: 100%; height:700px" ></iframe>
    </el-dialog>
    <el-dialog
      title="上传"
      :visible.sync="uploadTag" :fullscreen="true">
      <el-upload
        class="upload-demo"
        drag
        action="/api/activiti/definition/upload"
        :on-success="fetch"
        :headers="headers"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <XmlView ref="XmlView"></XmlView>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import XmlView from "./XmlView";
import activitiApi from "@/api/Activiti.js";
import { renderSize } from "@/utils/utils";
import { onlinePreview } from "@/settings";
import { downloadFile, initQueryParams } from '@/utils/commons'
import db from '@/utils/localstorage'


export default {
  name: "DeploymentManage",
  components: { Pagination, XmlView },
  filters: {},
  data() {
    return {
      viewUrl: null,
      viewXMLTag: false,
      uploadTag: false,
      viewTag: false,
      url: process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX,
      suspendStateType: {
        start: '1',
        stop: '2'
      },
      tableKey: 0,
      queryParams: initQueryParams({
        model:{}
      }),
      selection: [],
      loading: false,
      tableData: {
        records: [],
        total: 0
      }
    };
  },
  computed: {
    headers() {
      return {
        token: 'Bearer ' + db.get("TOKEN", ""),
        tenant: db.get("TENANT", "") || "",
        Authorization: `Basic ${Base64.encode(`${process.env.VUE_APP_CLIENT_ID}:${process.env.VUE_APP_CLIENT_SECRET}`)}`
      };
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      this.queryParams.current = params.current ? params.current : this.queryParams.current;
      this.queryParams.size = params.size ? params.size : this.queryParams.size;

      activitiApi.pageDefinition(this.queryParams).then(response => {
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
    singleEdit(row) {
      const vm = this;
      var data = {
        depId: row.deploymentId,
        suspendState: row.suspendState
      }
      // if (row.suspendState === vm.suspendStateType.stop) {
      //   data.suspendState = vm.suspendStateType.start;
      // } else {
      //   data.suspendState = vm.suspendStateType.stop;
      // }

      activitiApi.updateSuspendState(data).then(response => {
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
    singleDelete(row) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        })
        .then(() => {
          this.delete({ids: [row.deploymentId]});
        })
        .catch(() => {
          this.reset();
        });
    },
    singleView(row) {
      const vm = this;
      vm.viewTag = true;
      vm.viewUrl = `${vm.url}/api/activiti/static/readResource?pdid=${row.id}&resourceName=${row.diagramResourceName}`;
    },
    singleViewXML(row) {
      const vm = this;
      vm.$refs.XmlView.open(row)
    },
    delete(data) {
      activitiApi.deleteDefinition(data).then(response => {
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
    upload() {
      this.uploadTag = true
    },
    singleMappingrow(row) {
      activitiApi.saveModelByPro({processDefinitionId: row.id}).then(response => {
        const res = response.data;
          if (res.isSuccess) {
            this.$message({
              message: this.$t("tips.mappingSuccess"),
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
