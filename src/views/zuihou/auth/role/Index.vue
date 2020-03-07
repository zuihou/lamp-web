<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.role.code')" class="filter-item search-item" v-model="queryParams.model.code"/>
      <el-input :placeholder="$t('table.role.name')" class="filter-item search-item" v-model="queryParams.model.name"/>
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
      <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['user:add']">
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click"
                   v-has-any-permission="[ 'role:delete', 'role:export', 'role:import']">
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['role:delete']">
            {{ $t("table.delete") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['role:export']">
            {{ $t("table.export") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['role:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="importExcel" v-has-permission="['role:import']">
            {{ $t("table.import") }}
          </el-dropdown-item>
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
        :filter-multiple="false"
        :filters="dsTypeList"
        column-key="dsType.code"
        :label="$t('table.role.dsType')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dsType ? scope.row.dsType.desc : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        column-key="readonly"
        :filters="[
          { text: $t('common.yes'), value: true },
          { text: $t('common.no'), value: false }
        ]"
        :label="$t('table.role.readonly')"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.readonly ? $t('common.yes') : $t('common.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        column-key="status"
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
            }}
          </el-tag>
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
        column-key="operation"
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
          >{{ $t("tips.noPermission") }}
          </el-link
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
    <file-import
      :dialog-visible="fileImport.isVisible"
      :type="fileImport.type"
      :action="fileImport.action" accept=".xls,.xlsx"
      @close="importClose"
      @success="importSuccess"
      ref="import"
    />
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      title="预览"
      width="80%"
      top="50px"
      :visible.sync="preview.isVisible"
      v-el-drag-dialog
    >
      <el-scrollbar>
        <div v-html="preview.context"></div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import elDragDialog from '@/directive/el-drag-dialog'
  import RoleEdit from "./Edit";
  import UserRole from "./UserRole";
  import FileImport from "@/components/zuihou/Import"
  import RoleAuthority from "./RoleAuthority";
  import roleApi from "@/api/Role.js";
  import {convertEnum} from '@/utils/utils'
  import {downloadFile, initEnums, initQueryParams} from '@/utils/commons'

  export default {
    name: "RoleManage",
    directives: {elDragDialog},
    components: {Pagination, RoleEdit, UserRole, RoleAuthority, FileImport},
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
        preview: {
          isVisible: false,
          context: ''
        },
        fileImport: {
          isVisible: false,
          type: "import",
          action: `${process.env.VUE_APP_BASE_API}/authority/role/import`
        },
        userRoleDialog: {
          isVisible: false
        },
        roleAuthorityDialog: {
          isVisible: false
        },
        tableKey: 0,
        queryParams: initQueryParams({
          model: {
            dsType: {
              code: null
            }
          }
        }),
        selection: [],
        loading: false,
        tableData: {
          total: 0
        },
        enums: {
          DataScopeType: {}
        },
        dicts: {}
      };
    },
    computed: {
      dsTypeList() {
        return convertEnum(this.enums.DataScopeType)
      }
    },
    mounted() {
      initEnums('DataScopeType', this.enums);
      this.fetch();
    },
    methods: {
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
          ...this.queryParams
        });
      },
      reset() {
        this.queryParams = initQueryParams({
          model: {
            dsType: {
              code: null
            }
          }
        });
        this.$refs.table.clearSort();
        this.$refs.table.clearFilter();
        this.search();
      },
      exportExcelPreview() {
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.map.fileName = '导出角色数据';
        roleApi.preview(this.queryParams).then(response => {
          const res = response.data;
          this.preview.isVisible = true;
          this.preview.context = res.data;
        });
      },
      exportExcel() {
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.map.fileName = '导出角色数据';
        roleApi.export(this.queryParams).then(response => {
          downloadFile(response);
        });
      },
      importExcel() {
        this.fileImport.type = "upload";
        this.fileImport.isVisible = true;
        this.$refs.import.setModel(false);
      },
      importSuccess() {
        this.search();
      },
      importClose() {
        this.fileImport.isVisible = false;
      },
      singleDelete(row) {
        this.$refs.table.clearSelection()
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
        roleApi.delete({ids: ids}).then(response => {
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
        this.$refs.edit.setRole({ enums: this.enums});
      },
      edit(row) {
        this.$refs.edit.setRole({row, enums: this.enums});
        this.dialog.type = "edit";
        this.dialog.isVisible = true;
      },
      fetch(params = {}) {
        this.loading = true;
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        roleApi.page(this.queryParams).then(response => {
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
  }
  ;
</script>
<style lang="scss" scoped></style>
