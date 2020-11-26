<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.msg.title')"
        class="filter-item search-item"
        v-model="queryParams.model.title"
      />
      <el-input
        :placeholder="$t('table.msg.content')"
        class="filter-item search-item"
        v-model="queryParams.model.content"
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
      <router-link :to="{ path: '/resources/msg/edit', query: { type: 'add' } }">
        <el-button class="filter-item" plain type="danger" v-has-permission="['msg:msg:add']">
          {{ $t("table.add") }}
        </el-button>
      </router-link>
      <el-dropdown
        class="filter-item"
        trigger="click"
        v-has-any-permission="['msg:msg:delete', 'msg:msg:export']"
      >
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link :to="{ path: '/resources/msg/edit', query: { type: 'add' } }">-->
          <!--            <el-dropdown-item v-has-permission="['msg:msg:add']">-->
          <!--              {{ $t("table.add") }}-->
          <!--            </el-dropdown-item>-->
          <!--          </router-link>-->
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['msg:msg:delete']">
            {{ $t("table.delete") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="batchMark" v-has-permission="['msg:msg:mark']">
            标记已读
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['msg:msg:export']">
            {{ $t("table.export") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['msg:msg:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="importExcel" v-has-permission="['msg:msg:import']">
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
        :label="$t('table.msg.title')"
        :show-overflow-tooltip="true"
        align="center"
        prop="templateId"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.msg.content')"
        :show-overflow-tooltip="true"
        align="center"
        prop="receiver"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.msg.author')"
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
        :label="$t('table.msg.bizType')"
        :show-overflow-tooltip="true"
        align="center"
        column-key="bizType.code"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bizType ? scope.row.bizType.desc : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="msgTypeFilters"
        :label="$t('table.msg.msgType')"
        :show-overflow-tooltip="true"
        class-name="status-col"
        column-key="msgType.code"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.msgType
              ? scope.row.msgType.desc
              : scope.row.msgType
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="[
          { text: '已读', value: 'true' },
          { text: '未读', value: 'false' }
        ]"
        :label="$t('table.msg.isRead')"
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
        column-key="operation"
      >
        <template slot-scope="{ row }">
          <i
            @click="view(row)"
            class="el-icon-view table-operation"
            style="color: #2db7f5;"
            v-hasPermission="['msg:msg:view']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-hasPermission="['msg:msg:delete']"
          />
          <el-link
            class="no-perm"
            v-has-no-permission="['msg:msg:view', 'msg:msg:delete']"
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
  import msgApi from "@/api/Msg.js";
  import {convertEnum} from "@/utils/utils";
  import elDragDialog from '@/directive/el-drag-dialog'
  import FileImport from "@/components/lamp/Import"
  import {downloadFile, initMsgEnums, initQueryParams} from '@/utils/commons'


  export default {
    name: "MsgList",
    directives: {elDragDialog},
    components: {Pagination, FileImport},
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
        preview: {
          isVisible: false,
          context: ''
        },
        fileImport: {
          isVisible: false,
          type: "import",
          action: `${process.env.VUE_APP_BASE_API}/msg/msg/import`
        },
        tableKey: 0,
        queryParams: initQueryParams({
          model: {
            msgType: {code: null},
            bizType: {code: null},
          }
        }),
        selection: [],
        loading: false,
        tableData: {
          total: 0
        },
        enums: {
          MsgType: {},
          MsgBizType: {},
        },
      };
    },
    computed: {
      msgTypeFilters() {
        return convertEnum(this.enums.MsgType);
      },
      bizTypeFilters() {
        return convertEnum(this.enums.MsgBizType);
      }
    },
    watch: {
      '$route'(to) {
        if (to.path === '/resources/msg') {
          this.fetch();
        }
      }
    },
    mounted() {
      initMsgEnums(['MsgType', 'MsgBizType'], this.enums)
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
          ...this.queryParams
        });
      },
      reset() {
        this.queryParams = initQueryParams({
          model:{
            msgType: {code: null},
            bizType: {code: null},
          }
        });
        this.$refs.table.clearSort();
        this.$refs.table.clearFilter();
        this.search();
      },
      exportExcelPreview() {
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.extra.fileName = '导出消息数据';
        msgApi.preview(this.queryParams).then(response => {
          const res = response.data;
          this.preview.isVisible = true;
          this.preview.context = res.data;
        });
      },
      exportExcel() {
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.extra.fileName = '导出消息数据';
        msgApi.export(this.queryParams).then(response => {
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
        msgApi.delete({ids: ids}).then(response => {
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
            this.mark(ids, ()=>{
              this.search();
            });
          })
          .catch(() => {
            this.clearSelections();
          });
      },
      mark(ids, callback) {
        msgApi.mark({msgCenterIds: ids}).then(response => {
          const res = response.data;
          if (typeof callback === "function") {
            callback(ids);
          }
        });
      },
      view(row) {
        if (row.isRead) {
          this.$router.push({
            path: "/resources/msg/edit",
            query: {
              id: row.id,
              type: "view"
            }
          });
        } else {
          this.mark([row.id], ids => {
            this.$router.push({
              path: "/resources/msg/edit",
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
          path: "/resources/msg/edit",
          query: {
            id: row.id,
            type: "edit"
          }
        });
      },
      fetch(params = {}) {
        this.loading = true;
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        msgApi.page(this.queryParams).then(response => {
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
      cellClick(row, column) {
        if (column['columnKey'] === "operation") {
          return;
        }
        let flag = false;
        this.selection.forEach((item) => {
          if (item.id === row.id) {
            flag = true;
            this.$refs.table.toggleRowSelection(row);
          }
        })

        if (!flag) {
          this.$refs.table.toggleRowSelection(row, true);
        }
      }
    }
  };
</script>
<style lang="scss" scoped></style>
