<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.msgs.title')"
        class="filter-item search-item"
        v-model="queryParams.title"
      />
      <el-input
        :placeholder="$t('table.msgs.content')"
        class="filter-item search-item"
        v-model="queryParams.content"
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
        }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{
        $t("table.reset")
        }}
      </el-button>
      <el-dropdown
        class="filter-item"
        trigger="click"
        v-has-any-permission="['msgs:add', 'msgs:delete', 'msgs:export']"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link :to="{ path: '/msgs/sendMsgs', query: { type: 'add' } }">
            <el-dropdown-item v-has-permission="['msgs:add']">{{
              $t("table.add")
              }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item
            @click.native="batchDelete"
            v-has-permission="['msgs:delete']"
          >{{ $t("table.delete") }}
          </el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchMark"
            v-has-permission="['msgs:mark']"
          >标记已读
          </el-dropdown-item
          >
          <el-dropdown-item
            @click.native="exportExcel"
            v-has-permission="['msgs:export']"
          >{{ $t("table.export") }}
          </el-dropdown-item
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
      border
      fit
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px"/>
      <el-table-column
        :label="$t('table.msgs.title')"
        :show-overflow-tooltip="true"
        align="center"
        prop="templateId"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.msgs.content')"
        :show-overflow-tooltip="true"
        align="center"
        prop="receiver"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.msgs.author')"
        :show-overflow-tooltip="true"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="bizTypeFilters"
        :label="$t('table.msgs.bizType')"
        :show-overflow-tooltip="true"
        align="center"
        column-key="bizType"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bizType ? scope.row.bizType.desc : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="msgsCenterTypeFilters"
        :label="$t('table.msgs.msgsCenterType')"
        :show-overflow-tooltip="true"
        class-name="status-col"
        column-key="msgsCenterType"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.msgsCenterType
              ? scope.row.msgsCenterType.desc
              : scope.row.msgsCenterType
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="[
          { text: '已读', value: 'true' },
          { text: '未读', value: 'false' }
        ]"
        :label="$t('table.msgs.isRead')"
        align="center"
        column-key="isRead"
        prop="isRead"
        width="100px"
      >
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.isRead ? 'success' : 'danger'" slot>{{
              scope.row.isRead ? "已读" : "未读"
            }}</el-tag>
          </span>
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
            @click="view(row)"
            class="el-icon-view table-operation"
            style="color: #2db7f5;"
            v-hasPermission="['msgs:view']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-hasPermission="['msgs:delete']"
          />
          <el-link
            class="no-perm"
            v-has-no-permission="['msgs:view', 'msgs:delete']"
          >{{ $t("tips.noPermission") }}
          </el-link
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
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import msgsApi from "@/api/Msgs.js";
  import {convertEnum} from "@/utils/utils";
  import {initMsgsEnums} from "@/utils/commons";

  export default {
    name: "MsgsList",
    components: {Pagination},
    filters: {
      statusFilter(status) {
        const map = {
          WAITING: "danger",
          SUCCESS: "success",
          FAIL: "error"
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
        queryParams: {},
        sort: {},
        selection: [],
        // 以下已修改
        loading: false,
        tableData: {
          total: 0
        },
        enums:{
          MsgsCenterType:{},
          MsgsBizType:{},
        },
        pagination: {
          size: 10,
          current: 1
        }
      };
    },
    computed: {
      msgsCenterTypeFilters() {
        return convertEnum(this.enums.MsgsCenterType);
      },
      bizTypeFilters() {
        return convertEnum(this.enums.MsgsBizType);
      }
    },
    watch: {
      '$route' (to) {
        if(to.path === '/msgs/myMsgs'){
          this.fetch();
        }
      }
    },
    mounted() {
      initMsgsEnums(['MsgsCenterType', 'MsgsBizType'], this.enums)
      this.fetch();
    },
    methods: {
      filterStatus(value, row) {
        return row.status === value;
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
        msgsApi.delete({ids: ids}).then(response => {
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

      batchMark() {
        if (!this.selection.length) {
          this.$message({
            message: this.$t("tips.noDataSelected"),
            type: "warning"
          });
          return;
        }
        this.$confirm("确认全部标记为已读吗？", this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        })
          .then(() => {
            const ids = [];
            this.selection.forEach(u => {
              ids.push(u.id);
            });
            this.mark(ids);
          })
          .catch(() => {
            this.clearSelections();
          });
      },
      mark(ids, callback) {
        msgsApi.mark({msgCenterIds: ids}).then(response => {
          const res = response.data;
          if (typeof callback === "function") {
            callback(ids);
          }
        });
      },
      view(row) {
        if (row.isRead) {
          this.$router.push({
            path: "/msgs/sendMsgs",
            query: {
              id: row.id,
              type: "view"
            }
          });
        } else {
          this.mark([row.id], ids => {
            this.$router.push({
              path: "/msgs/sendMsgs",
              query: {
                id: row.id,
                type: "view"
              }
            });
          });
        }
      },
      edit(row) {
        this.$router.push({
          path: "/msgs/sendMsgs",
          query: {
            id: row.id,
            type: "edit"
          }
        });
      },
      fetch(params = {}) {
        this.loading = true;
        params.size = this.pagination.size;
        params.current = this.pagination.current;
        if (this.queryParams.timeRange) {
          params.startCreateTime = this.queryParams.timeRange[0];
          params.endCreateTime = this.queryParams.timeRange[1];
        }
        msgsApi.page(params).then(response => {
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
      },
      filterChange(filters) {
        for (const key in filters) {
          this.queryParams[key] = filters[key][0];
        }
        this.search();
      }
    }
  };
</script>
<style lang="scss" scoped></style>
