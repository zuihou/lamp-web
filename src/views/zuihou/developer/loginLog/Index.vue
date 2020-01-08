<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.loginLog.account')"
        class="filter-item search-item"
        v-model="queryParams.account"
      />
      <el-input
        :placeholder="$t('table.loginLog.location')"
        class="filter-item search-item"
        v-model="queryParams.location"
      />
      <el-input
        :placeholder="$t('table.loginLog.requestIp')"
        class="filter-item search-item"
        v-model="queryParams.requestIp"
      />
      <el-date-picker
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
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
        v-has-any-permission="['loginLog:delete', 'loginLog:export']"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="batchDelete"
            v-has-permission="['loginLog:delete']"
            >{{ $t("table.delete") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="exportExcel"
            v-has-permission="['loginLog:export']"
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
        :label="$t('table.loginLog.userName')"
        :show-overflow-tooltip="true"
        align="center"
        min-width="80px"
        prop="userName"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.loginLog.requestIp')"
        :show-overflow-tooltip="true"
        align="center"
        min-width="80px"
        prop="requestIp"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestIp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.loginLog.browser')"
        :show-overflow-tooltip="true"
        align="center"
        prop="browser"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.loginLog.browserVersion')"
        :show-overflow-tooltip="true"
        align="center"
        prop="browserVersion"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.browserVersion }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.loginLog.operatingSystem')"
        :show-overflow-tooltip="true"
        align="center"
        prop="operatingSystem"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.operatingSystem }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.loginLog.location')"
        :show-overflow-tooltip="true"
        align="center"
        min-width="150px"
        prop="location"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.loginLog.loginDate')"
        :show-overflow-tooltip="true"
        align="center"
        prop="createTime"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.loginLog.description')"
        :show-overflow-tooltip="true"
        align="left"
        column-key="description"
        prop="description"
      >
        <template slot-scope="scope">
          <span>
            <el-badge
              :type="
                scope.row.description && scope.row.description == '登录成功'
                  ? 'success'
                  : 'danger'
              "
              class="item"
              is-dot
            />
            {{ scope.row.description }}
          </span>
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
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-has-permission="['loginLog:delete']"
          />

          <el-link class="no-perm" v-has-no-permission="['loginLog:delete']">{{
            $t("tips.noPermission")
          }}</el-link>
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import loginLogApi from "@/api/LoginLog.js";

export default {
  name: "LoginLog",
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      loading: false,
      queryParams: {},
      sort: {},
      selection: [],
      tableData: {},
      pagination: {
        size: 10,
        current: 1
      }
    };
  },
  computed: {},
  mounted() {
    this.fetch();
  },
  methods: {
    onSelectChange(selection) {
      this.selection = selection;
    },
    exportExcel() {},

    fetch(params = {}) {
      params.current = this.pagination.current;
      params.size = this.pagination.size;
      if (this.queryParams.timeRange) {
        params.startCreateTime = this.queryParams.timeRange[0];
        params.endCreateTime = this.queryParams.timeRange[1];
      }
      this.loading = true;

      loginLogApi.page(params).then(response => {
        const res = response.data;
        this.loading = false;
        this.tableData = res.data;
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
          const logIds = this.selection.map(item => item.id);
          this.delete(logIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(logIds) {
      loginLogApi.delete({ ids: logIds }).then(response => {
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
    sortChange(val) {
      this.sort.field = val.prop;
      this.sort.order = val.order;
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped>
.item {
  margin-top: 7px;
}
</style>
