<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.user.account')"
        class="filter-item search-item"
        v-model="queryParams.account"
      />
      <treeselect
        :clear-value-text="$t('common.clear')"
        :load-options="loadListOptions"
        :multiple="false"
        :options="orgList"
        :searchable="true"
        class="filter-item search-item"
        placeholder="组织"
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
          'user:add',
          'user:delete',
          'user:reset',
          'user:export'
        ]"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="add"
            v-has-permission="['user:add']"
            >{{ $t("table.add") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchDelete"
            v-has-permission="['user:delete']"
            >{{ $t("table.delete") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="resetPassword"
            v-has-permission="['user:reset']"
            >{{ $t("table.resetPassword") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="exportExcel"
            v-has-permission="['user:export']"
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
        :label="$t('table.user.avatar')"
        align="center"
        prop="avatar"
        width="100px"
      >
        <template slot-scope="scope">
          <el-avatar
            :key="scope.row.avatar"
            :src="myAvatar(scope.row.avatar)"
            fit="fill"
          >
            <el-avatar>{{ scope.row.name | userAvatarFilter }}</el-avatar>
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.account')"
        :show-overflow-tooltip="true"
        align="center"
        prop="account"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.sex')"
        class-name="status-col"
        prop="sex.desc"
        width="70px"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.sex.code | sexFilter">{{ row.sex.desc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.email')"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.orgId')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.org["data"] ? scope.row.org.data.name : scope.row.org.key
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.stationId')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.station["data"]
              ? scope.row.station.data.name
              : scope.row.station.key
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterStatus"
        :filters="[
          { text: $t('common.status.valid'), value: true },
          { text: $t('common.status.invalid'), value: false }
        ]"
        :label="$t('table.user.status')"
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
        :label="$t('table.user.createTime')"
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
            @click="view(row)"
            class="el-icon-view table-operation"
            style="color: #87d068;"
            v-hasPermission="['user:view']"
          />
          <i
            @click="edit(row)"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            v-hasPermission="['user:update']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-hasPermission="['user:delete']"
          />
          <el-link
            class="no-perm"
            v-has-no-permission="['user:view', 'user:update', 'user:delete']"
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
    <user-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
    />
    <user-view
      :dialog-visible="userViewVisible"
      @close="viewClose"
      ref="view"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import UserEdit from "./Edit";
import UserView from "./View";
import userApi from "@/api/User.js";
import orgApi from "@/api/Org.js";

export default {
  name: "UserManage",
  components: { Pagination, UserEdit, UserView, Treeselect },
  filters: {
    userAvatarFilter(name) {
      return name.charAt(0);
    },
    sexFilter(status) {
      const map = {
        W: "success",
        M: "danger",
        N: "info"
      };
      return map[status] || "info";
    },
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
      orgList: [],
      dialog: {
        isVisible: false,
        type: "add"
      },
      userViewVisible: false,
      tableKey: 0,
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
  computed: {
    currentUser() {
      return this.$store.state.account.user;
    }
  },
  watch: {
    $route() {
      if (this.$route.path === "/user/user") {
        this.initOrg();
      }
    }
  },
  mounted() {
    console.log("init mounted");
    this.fetch();
    this.initOrg();
  },
  methods: {
    initOrg() {
      orgApi.allTree({ status: true }).then(response => {
        const res = response.data;
        this.orgList = res.data;
      });
    },
    myAvatar(avatar) {
      if (!avatar) {
        return require(`@/assets/avatar/default.jpg`);
      } else {
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
          return avatar;
        } else {
          return require(`@/assets/avatar/${avatar}`);
        }
      }
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    viewClose() {
      this.userViewVisible = false;
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
    loadListOptions({ callback }) {
      callback();
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
    resetPassword() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning"
        });
        return;
      }
      this.$confirm(
        this.$t("tips.confirmRestPassword"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          const ids = [];
          this.selection.forEach(u => {
            ids.push(u.id);
          });
          userApi.reset({ ids: ids }).then(response => {
            const res = response.data;
            if (res.isSuccess) {
              this.$message({
                message: this.$t("tips.resetPasswordSuccess"),
                type: "success"
              });
            }
            this.clearSelections();
          });
        })
        .catch(() => {
          this.clearSelections();
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
      let contain = false;
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          const ids = [];
          this.selection.forEach(u => {
            if (u.id === this.currentUser.id) {
              contain = true;
              return;
            }
            ids.push(u.id);
          });
          if (contain) {
            this.$message({
              message: this.$t("tips.containCurrentUser"),
              type: "warning"
            });
            this.clearSelections();
          } else {
            this.delete(ids);
          }
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(ids) {
      userApi.delete({ ids: ids }).then(response => {
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
      this.$refs.edit.setUser(false, this.orgList);
    },
    view(row) {
      this.$refs.view.setUser(row, this.orgList);
      this.userViewVisible = true;
    },
    edit(row) {
      this.$refs.edit.setUser(row, this.orgList);
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
      userApi.page(params).then(response => {
        const res = response.data;
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
        }
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
