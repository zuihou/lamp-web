<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.role.code')"
        class="filter-item search-item"
        v-model="queryParams.code"
      />
      <el-input
        :placeholder="$t('table.role.name')"
        class="filter-item search-item"
        v-model="queryParams.name"
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
        v-has-any-permission="['role:add', 'role:delete', 'role:export']"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="add"
            v-has-permission="['role:add']"
            >{{ $t("table.add") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchDelete"
            v-has-permission="['role:delete']"
            >{{ $t("table.delete") }}</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="exportExcel"
            v-has-permission="['role:export']"
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
        :label="$t('table.role.code')"
        align="center"
        prop="code"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.role.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.role.describe')"
        :show-overflow-tooltip="true"
        align="center"
        prop="describe"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.role.dsType')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dsType.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.role.readonly')"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.readonly ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterStatus"
        :filters="[
          { text: $t('common.status.valid'), value: true },
          { text: $t('common.status.invalid'), value: false }
        ]"
        :label="$t('table.role.status')"
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
        width="160px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        class-name="small-padding fixed-width"
        width="140px"
      >
        <template slot-scope="{ row }">
          <i
            @click="edit(row)"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            title="修改"
            v-hasPermission="['role:update']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            title="删除"
            v-hasPermission="['role:delete']"
          />
          <i
            @click="authUser(row)"
            class="el-icon-user table-operation"
            style="color: #87d068;"
            title="授权用户"
            v-hasPermission="['role:auth']"
          />
          <i
            @click="authResource(row)"
            class="el-icon-setting table-operation"
            style="color: #E6A23C"
            title="分配权限"
            v-hasPermission="['role:config']"
          />

          <!-- dropdown 有时候会有bug，不知道这么解决 -->

          <!-- <el-dropdown v-has-any-permission="['role:delete','role:auth','role:config']">
            <span class="el-dropdown-link">
              {{ $t('table.more') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>            
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="singleDelete(row)" icon="el-icon-delete" v-hasPermission="['role:delete']">删除</el-dropdown-item>
              <el-dropdown-item @click.native="authUser(row)" icon="el-icon-user" v-hasPermission="['role:auth']">授权</el-dropdown-item>
              <el-dropdown-item @click.native="authResource(row)" icon="el-icon-setting" v-hasPermission="['role:config']">配置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <el-link
            class="no-perm"
            v-has-no-permission="[
              'role:update',
              'role:delete',
              'role:auth',
              'role:config'
            ]"
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
    <role-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
    />
    <user-role
      :dialog-visible="userRoleDialog.isVisible"
      @close="userRoleClose"
      @success="userRoleSuccess"
      ref="userRole"
    />
    <role-authority
      :dialog-visible="roleAuthorityDialog.isVisible"
      @close="roleAuthorityClose"
      @success="roleAuthoritySuccess"
      ref="roleAuthority"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import RoleEdit from "./Edit";
import UserRole from "./UserRole";
import RoleAuthority from "./RoleAuthority";
import roleApi from "@/api/Role.js";

export default {
  name: "RoleManage",
  components: { Pagination, RoleEdit, UserRole, RoleAuthority },
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
      userRoleDialog: {
        isVisible: false
      },
      roleAuthorityDialog: {
        isVisible: false
      },
      tableKey: 0,
      // total: 0,
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
  mounted() {
    this.fetch();
  },
  methods: {
    filterStatus(value, row) {
      return row.status === value;
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    userRoleClose() {
      this.userRoleDialog.isVisible = false;
    },
    roleAuthorityClose() {
      this.roleAuthorityDialog.isVisible = false;
    },
    editSuccess() {
      this.search();
    },
    userRoleSuccess() {
      this.search();
    },
    roleAuthoritySuccess() {
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
      roleApi.delete({ ids: ids }).then(response => {
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
      this.$refs.edit.setRole(false);
    },
    edit(row) {
      this.$refs.edit.setRole(row);
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
      roleApi.page(params).then(response => {
        const res = response.data;
        this.loading = false;
        this.tableData = res.data;
      });
    },
    sortChange(val) {
      this.sort.field = val.prop;
      this.sort.order = val.order;
      this.search();
    },
    authResource(row) {
      this.roleAuthorityDialog.isVisible = true;
      this.$refs.roleAuthority.setRoleAuthority(row);
    },
    authUser(row) {
      this.userRoleDialog.isVisible = true;
      this.$refs.userRole.setUserRole(row);
    }
  }
};
</script>
<style lang="scss" scoped></style>
