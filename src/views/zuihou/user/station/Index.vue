<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.station.name')"
        class="filter-item search-item"
        v-model="queryParams.name"
      />
      <treeselect
        :clear-value-text="$t('common.clear')"
        :load-options="loadListOptions"
        :multiple="false"
        :options="orgList"
        :placeholder="$t('table.station.orgId')"
        :searchable="true"
        class="filter-item search-item"
        v-model="queryParams.orgId"
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
      <el-button @click="search" class="filter-item" plain type="primary">{{
        $t("table.search")
      }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{
        $t("table.reset")
      }}</el-button>
      <el-dropdown
        class="filter-item"
        trigger="click"
        v-has-any-permission="[
          'station:add',
          'station:delete',
          'station:export'
        ]"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="add"
            v-has-permission="['station:add']"
            >{{ $t("table.add") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchDelete"
            v-has-permission="['station:delete']"
            >{{ $t("table.delete") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="exportExcel"
            v-has-permission="['station:export']"
            >{{ $t("table.export") }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :data="tableData.records"
      :key="tableKey"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      border
      fit
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px" />
      <el-table-column
        :label="$t('table.station.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.station.describe')"
        :show-overflow-tooltip="true"
        align="center"
        prop="describe"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.station.orgId')"
        align="center"
        :show-overflow-tooltip="true"
        width="180px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.org.data ? scope.row.org.data.label : scope.row.org.key
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterStatus"
        :filters="[
          { text: $t('common.status.valid'), value: true },
          { text: $t('common.status.invalid'), value: false }
        ]"
        :label="$t('table.station.status')"
        class-name="status-col"
        width="70px"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{
            row.status ? $t("common.status.valid") : $t("common.status.invalid")
          }}</el-tag>
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
        align="center"
        class-name="small-padding fixed-width"
        width="100px"
      >
        <template slot-scope="{ row }">
          <i
            @click="edit(row)"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            v-hasPermission="['station:update']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-hasPermission="['station:delete']"
          />
          <el-link
            class="no-perm"
            v-has-no-permission="['station:update', 'station:delete']"
            >{{ $t("tips.noPermission") }}</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :limit.sync="pagination.size"
      :page.sync="pagination.current"
      :total="Number(tableData.total)"
      @pagination="fetch"
      v-show="tableData.total > 0"
    />
    <station-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Pagination from "@/components/Pagination";
import StationEdit from "./Edit";
import stationApi from "@/api/Station.js";
import orgApi from "@/api/Org.js";

export default {
  name: "StationManage",
  components: { Pagination, StationEdit, Treeselect },
  filters: {
    statusFilter(status) {
      const map = {
        false: "danger",
        true: "success"
      };
      return map[status] || "success";
    }
  },
  data() {
    return {
      dialog: {
        isVisible: false,
        type: "add"
      },
      tableKey: 0,
      // total: 0,
      orgList: [],
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
    };
  },
  computed: {},
  watch: {
    $route() {
      if (this.$route.path === "/user/station") {
        this.initOrg();
      }
    }
  },
  mounted() {
    this.initOrg();
    this.fetch();
  },
  methods: {
    initOrg() {
      orgApi
        .allTree({ status: true })
        .then(response => {
          const res = response.data;
          this.orgList = res.data;
        })
        .catch(() => {
          this.$message({
            message: this.$t("tips.getDataFail"),
            type: "error"
          });
        });
    },
    loadListOptions({ callback }) {
      callback();
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
        ...this.queryParams,
        ...this.sort
      });
    },
    reset() {
      this.queryParams = {};
      this.sort = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    exportExcel() {
      this.$message({
        message: "待完善",
        type: "warning"
      });
    },
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true);
      this.batchDelete();
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
    delete(ids) {
      stationApi.delete({ ids: ids }).then(response => {
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
    add() {
      this.dialog.type = "add";
      this.dialog.isVisible = true;
      this.$refs.edit.setStation(false, this.orgList);
    },
    edit(row) {
      this.$refs.edit.setStation(row, this.orgList);
      this.dialog.type = "edit";
      this.dialog.isVisible = true;
    },
    fetch(params = {}) {
      this.loading = true;
      params.size = this.pagination.size;
      params.current = this.pagination.current;
      if (this.queryParams.timeRange) {
        params.startCreateTime = this.queryParams.timeRange[0];
        params.endCreateTime = this.queryParams.timeRange[1];
      }

      stationApi.page(params).then(response => {
        const res = response.data;
        this.loading = false;
        if (res.isError) {
          return;
        }
        this.tableData = res.data;
      });
    },
    sortChange(val) {
      this.sort.field = val.prop;
      this.sort.order = val.order;
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped></style>
