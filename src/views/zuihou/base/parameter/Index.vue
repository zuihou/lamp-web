<template>
  <div class="app-container">
    <div class="filter-container">

          <el-input
        :placeholder="$t('table.parameter.key')"
        class="filter-item search-item"
        v-model="queryParams.key"
      />
      <el-input
        :placeholder="$t('table.parameter.name')"
        class="filter-item search-item"
        v-model="queryParams.name"
      />
      <el-input
        :placeholder="$t('table.parameter.value')"
        class="filter-item search-item"
        v-model="queryParams.value"
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
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['parameter:add',
        'parameter:delete', 'parameter:export']">
        <el-button>
          {{ $t("table.more") }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add" v-has-permission="['parameter:add']">
            {{ $t("table.add") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['parameter:delete']">
            {{ $t("table.delete") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['parameter:export']">
            {{ $t("table.export") }}
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
      border
      fit
      ref="table"
      style="width: 100%;"
      v-loading="loading">
      <el-table-column align="center" type="selection" width="40px" />
      <el-table-column :label="$t('table.parameter.key')" :show-overflow-tooltip="true" align="center"
                       prop="key" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.parameter.name')" :show-overflow-tooltip="true" align="center"
                       prop="name" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.parameter.value')" :show-overflow-tooltip="true" align="center"
                       prop="value" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.parameter.describe')" :show-overflow-tooltip="true" align="center"
                       prop="describe" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.parameter.status')" :show-overflow-tooltip="true" align="center"
                       :filter-multiple="false" column-key="status"
                       :filters="[{ text: $t('common.status.valid'), value: true },{ text: $t('common.status.invalid'), value: false }]"
                       prop="status" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'" slot>
            {{ scope.row.status ? $t("common.status.valid") : $t("common.status.invalid") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.parameter.readonly')" :show-overflow-tooltip="true" align="center"
                       :filter-multiple="false" column-key="readonly"
                       :filters="[{ text: $t('common.yes'), value: 'true' }, { text: $t('common.no'), value: 'false' }]"
                       prop="readonly" width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.readonly ? 'success' : 'danger'" slot>
            {{ scope.row.readonly ? $t("common.yes") : $t("common.no") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        prop="createTime"
        sortable="custom"
        width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')" align="center" class-name="small-padding fixed-width" width="100px">
        <template slot-scope="{ row }">
          <i @click="copy(row)" class="el-icon-copy-document table-operation" :title="$t('common.delete')"
             style="color: #2db7f5;" v-hasPermission="['parameter:copy']"/>
          <i @click="edit(row)" class="el-icon-edit table-operation" :title="$t('common.delete')"
             style="color: #2db7f5;" v-hasPermission="['parameter:update']"/>
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" :title="$t('common.delete')"
             style="color: #f50;" v-hasPermission="['parameter:delete']"/>
          <el-link class="no-perm" v-has-no-permission="['parameter:update', 'parameter:copy', 'parameter:delete']">
            {{ $t("tips.noPermission") }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :limit.sync="pagination.size"
      :page.sync="pagination.current"
      :total="Number(tableData.total)"
      @pagination="fetch"
      v-show="tableData.total > 0"/>
    <parameter-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"/>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import ParameterEdit from "./Edit";
import parameterApi from "@/api/Parameter.js";

export default {
  name: "ParameterManage",
  components: { Pagination, ParameterEdit },
  filters: {

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
  },
  mounted() {
    this.fetch();
  },
  methods: {
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
        const ids = this.selection.map(u => u.id);
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
      parameterApi.delete({ ids: ids }).then(response => {
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
      this.$refs.edit.setParameter(false);
    },
    copy(row) {
      this.$refs.edit.setParameter(row);
      this.dialog.type = "copy";
      this.dialog.isVisible = true;
    },
    edit(row) {
      this.$refs.edit.setParameter(row);
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

      parameterApi.page(params).then(response => {
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
    filterChange (filters) {
      for (const key in filters) {
        this.queryParams[key] = filters[key][0]
      }
      this.search()
    }
  }
};
</script>
<style lang="scss" scoped></style>
