<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.station.name')" class="filter-item search-item"
                v-model="queryParams.model.name"/>
      <treeselect
        :clear-value-text="$t('common.clear')"
        :load-options="loadListOptions"
        :multiple="false"
        :options="orgList"
        :placeholder="$t('table.station.orgId')"
        :searchable="true"
        class="filter-item search-item"
        v-model="queryParams.model.org.key"
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
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t("table.search") }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t("table.reset") }}</el-button>
      <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['authority:station:add']">
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click"
                   v-has-any-permission="['authority:station:delete','authority:station:export','authority:station:import']">
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['authority:station:delete']">
            {{ $t("table.delete") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['authority:station:export']">
            {{ $t("table.export") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['authority:station:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="importExcel" v-has-permission="['authority:station:import']">
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
          <span>
            {{ scope.row.org.data ? scope.row.org.data.label : scope.row.org.key }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        column-key="state"
        :filters="[
          { text: $t('common.state.valid'), value: true },
          { text: $t('common.state.invalid'), value: false }
        ]"
        :label="$t('table.station.state')"
        class-name="status-col"
        width="70px"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.state | stateFilter">{{
            row.state ? $t("common.state.valid") : $t("common.state.invalid")
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
        width="100px"
      >
        <template slot-scope="{ row }">
          <i
            @click="edit(row)"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            v-hasPermission="['authority:station:edit']"
          />
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-hasPermission="['authority:station:delete']"
          />
          <el-link
            class="no-perm"
            v-has-no-permission="['authority:station:edit', 'authority:station:delete']"
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
    <station-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
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
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import elDragDialog from '@/directive/el-drag-dialog'
  import FileImport from "@/components/lamp/Import"
  import Pagination from "@/components/Pagination";
  import StationEdit from "./edit";
  import stationApi from "@/api/Station.js";
  import orgApi from "@/api/Org.js";
  import {downloadFile, initQueryParams} from '@/utils/commons'

  export default {
    name: "StationManage",
    directives: {elDragDialog},
    components: {Pagination, StationEdit, Treeselect, FileImport},
    filters: {
      stateFilter(state) {
        const map = {
          false: "danger",
          true: "success"
        };
        return map[state] || "success";
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
          action: `${process.env.VUE_APP_BASE_API}/authority/station/import`
        },
        tableKey: 0,
        orgList: [],
        queryParams: initQueryParams({
          model: {
            org: {
              key: null
            },
          }
        }),
        selection: [],
        loading: false,
        tableData: {
          total: 0
        },
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
          .allTree({state: true})
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
      loadListOptions({callback}) {
        callback();
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
          model: {
            org: {key: null}
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
        this.queryParams.extra.fileName = '导出岗位数据';
        stationApi.preview({...this.queryParams, ...{size: 10000}}).then(response => {
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
        this.queryParams.extra.fileName = '导出岗位数据';
        stationApi.export({...this.queryParams, ...{size: 10000}}).then(response => {
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
        stationApi.delete({ids: ids}).then(response => {
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
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        stationApi.page(this.queryParams).then(response => {
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
