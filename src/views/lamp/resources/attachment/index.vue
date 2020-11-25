<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.attachment.submittedFileName')"
        class="filter-item search-item"
        v-model="queryParams.model.submittedFileName"
      />
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
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
      <el-button @click="upload" class="filter-item" plain type="danger" v-has-permission="['file:attachment:add']">
        {{ $t("table.upload") }}
      </el-button>
      <el-dropdown
        class="filter-item"
        trigger="click"
        v-has-any-permission="['file:attachment:delete', 'file:attachment:download']"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="batchDelete"
            v-has-permission="['file:attachment:delete']"
            >{{ $t("table.delete") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchDownload"
            v-has-permission="['file:attachment:download']"
            >{{ $t("table.download") }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
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
      <el-table-column
        :label="$t('table.attachment.submittedFileName')"
        :show-overflow-tooltip="true"
        align="left"
        prop="submittedFileName"
      >
        <template slot-scope="scope">
          <div @click="onView(scope.row)" class="hover-effect">
            <i :class="scope.row.icon" class="button-list" />
            <span>{{ scope.row.submittedFileName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.attachment.dataType')"
        :show-overflow-tooltip="true"
        align="center"
        prop="dataType"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dataType.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.attachment.bizType')"
        :show-overflow-tooltip="true"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bizType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.attachment.bizId')"
        :show-overflow-tooltip="true"
        align="center"
        width="180px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bizId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.attachment.size')"
        align="center"
        :show-overflow-tooltip="true"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ formatSize(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        prop="createTime"
        sortable="custom"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center" column-key="operation"
        class-name="small-padding fixed-width"
        width="100px"
      >
        <template slot-scope="{ row }">
          <i
            @click="singleDownload(row)"
            class="el-icon-download table-operation"
            style="color: #f50;"
            v-hasPermission="['file:attachment:download']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-hasPermission="['file:attachment:delete']"
          />
          <el-link
            class="no-perm"
            v-has-no-permission="['file:attachment:edit', 'file:attachment:delete']"
            >{{ $t("tips.noPermission") }}</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="Number(tableData.total)"
      @pagination="fetch"
      v-show="tableData.total > 0"
    />
    <attachment-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
    />
    <el-dialog :visible.sync="dialogVisible">
      <img
        :key="dialogImageUrl"
        :src="dialogImageUrl"
        @error="errorImage()"
        alt="图片飞到火星了"
        height="500px"
        v-if="dialogImageUrl"
        width="100%"
      />
      <span v-else>图片飞到火星了~</span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import AttachmentEdit from "./edit";
import attachmentApi from "@/api/Attachment.js";
import { renderSize } from "@/utils/utils";
import { onlinePreview } from "@/settings";
import { downloadFile, initQueryParams } from '@/utils/commons'

export default {
  name: "AttachmentManage",
  components: { Pagination, AttachmentEdit },
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
      queryParams: initQueryParams({
        model:{}
      }),
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
    errorImage() {
      let img = event.srcElement;
      img.src = require("@/assets/404_images/404_image.jpeg");
      img.onerror = null; //防止闪图
    },
    formatSize(row) {
      return renderSize(row.size);
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.search();
    },
    onSelectChange(selection) {
      this.selection = selection;
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
    singleDownload(row) {
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row, true);
      this.batchDownload();
    },
    singleDelete(row) {
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row, true);
      this.batchDelete();
    },
    batchDownload() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning"
        });
        return;
      }
      this.$confirm("确认下载吗？", this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          const ids = [];
          this.selection.forEach(u => {
            ids.push(u.id);
          });
          this.download(ids);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning"
        });
        return;
      }
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          const ids = [];
          this.selection.forEach(u => {
            ids.push(u.id);
          });
          this.delete(ids);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    download(ids) {
      attachmentApi.download({ ids: ids }).then(response => {
        downloadFile(response);
        this.clearSelections();
      });
    },
    delete(ids) {
      attachmentApi.delete({ ids: ids }).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          });
        }
        this.search();
      });
    },
    onView(row) {
      if (row.url) {
        window.open(onlinePreview + encodeURIComponent(row.url));
      }
    },
    upload() {
      this.dialog.type = "upload";
      this.dialog.isVisible = true;
      this.$refs.edit.setAttachment(false);
    },
    edit(row) {
      this.$refs.edit.setAttachment(row);
      this.dialog.type = "edit";
      this.dialog.isVisible = true;
    },
    fetch(params = {}) {
      this.loading = true;
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
      }

      this.queryParams.current = params.current ? params.current : this.queryParams.current;
      this.queryParams.size = params.size ? params.size : this.queryParams.size;

      attachmentApi.page(this.queryParams).then(response => {
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
