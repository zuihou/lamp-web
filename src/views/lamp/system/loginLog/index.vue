<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.loginLog.account')"
                class="filter-item search-item" v-model="queryParams.model.account"/>
      <el-input :placeholder="$t('table.loginLog.location')" class="filter-item search-item"
                v-model="queryParams.model.location"/>
      <el-input :placeholder="$t('table.loginLog.requestIp')"
                class="filter-item search-item" v-model="queryParams.model.requestIp"/>
      <el-date-picker
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        v-model="queryParams.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click"
                   v-has-any-permission="['authority:loginLog:delete', 'authority:loginLog:export']">
        <el-button>
          {{ $t("table.more") }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['authority:loginLog:delete']">
            {{ $t("table.delete") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['authority:loginLog:export']">
            {{ $t("table.export") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['authority:loginLog:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['authority:loginLog:delete']">
        <el-button>
          清理日志
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="clear(1)" >
           保留一个月
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(2)" >
            保留三个月
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(3)" >
            保留六个月
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(4)" >
            保留一年
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(5)" >
            保留一千条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(6)" >
            保留一万条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(7)" >
            保留三万条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(8)" >
            保留十万条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(9)" >
            清空所有
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
        sortable="custom"
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
        prop="description">
        <template slot-scope="scope">
          <span>
            <el-badge
              :type="scope.row.description && scope.row.description == '登录成功' ? 'success' : 'danger'"
              class="item" is-dot/>
            {{ scope.row.description }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.operation')"
        column-key="operation"
        align="center"
        class-name="small-padding fixed-width"
        width="100px"
      >
        <template slot-scope="{ row }">
          <i
            @click="singleDelete(row)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            v-has-permission="['authority:loginLog:delete']"
          />

          <el-link class="no-perm" v-has-no-permission="['authority:loginLog:delete']">{{
            $t("tips.noPermission")
            }}
          </el-link>
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
  import loginLogApi from "@/api/LoginLog.js";
  import elDragDialog from '@/directive/el-drag-dialog'
  import {downloadFile, initQueryParams} from '@/utils/commons'

  export default {
    name: "LoginLog",
    directives: {elDragDialog},
    components: {Pagination},
    filters: {},
    data() {
      return {
        preview: {
          isVisible: false,
          context: ''
        },
        tableKey: 0,
        loading: false,
        queryParams: initQueryParams(),
        selection: [],
        tableData: {
          total: 0
        },
        enums: {},
        dicts: {}
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
      exportExcelPreview() {
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.extra.fileName = '导出登录日志数据';
        loginLogApi.preview(this.queryParams).then(response => {
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
        this.queryParams.extra.fileName = '导出登录日志数据';
        loginLogApi.export(this.queryParams).then(response => {
          downloadFile(response);
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

        loginLogApi.page(this.queryParams).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.tableData = res.data;
          }
        }).finally(() => this.loading = false);
      },
      singleDelete(row) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row, true);
        this.batchDelete();
      },
      clear(type) {
        this.$confirm('确认要清除日志吗？', this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        })
          .then(() => {
            loginLogApi.clear({type: type}).then(response => {
              const res = response.data;
              if (res.isSuccess) {
                this.$message({
                  message: this.$t("tips.deleteSuccess"),
                  type: "success"
                });
              }

              this.search();
            });

          })
          .catch(() => {
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
        loginLogApi.delete({ids: logIds}).then(response => {
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
          ...this.queryParams
        });
      },
      reset() {
        this.queryParams = initQueryParams();
        this.$refs.table.clearSort();
        this.$refs.table.clearFilter();
        this.search();
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
  .item {
    margin-top: 7px;
  }
</style>
