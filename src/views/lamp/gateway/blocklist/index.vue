<template>
  <div class="app-container">
    <div class="filter-container">

      <el-date-picker :range-separator="null" class="filter-item search-item date-range-item"
                      end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      type="daterange" v-model="queryParams.timeRange" value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
      <el-button @click="add" class="filter-item" plain type="danger">
<!--      <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['blockList:add']">-->
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click">
<!--      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['blockList:delete', 'blockList:export','blockList:import']">-->
        <el-button>
          {{ $t("table.more") }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete">
<!--          <el-dropdown-item @click.native="batchDelete" v-has-permission="['blockList:delete']">-->
            {{ $t("table.delete") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel">
<!--          <el-dropdown-item @click.native="exportExcel" v-has-permission="['blockList:export']">-->
            {{ $t("table.export") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview">
<!--          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['blockList:export']">-->
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="importExcel">
<!--          <el-dropdown-item @click.native="importExcel" v-has-permission="['blockList:import']">-->
            {{ $t("table.import") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table :data="tableData.records" :key="tableKey" @cell-click="cellClick"
              @filter-change="filterChange" @selection-change="onSelectChange" @sort-change="sortChange"
              border fit row-key="id" ref="table" style="width: 100%;" v-loading="loading">
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
      <el-table-column :label="$t('table.blockList.ip')" :show-overflow-tooltip="true" align="center" prop="ip"
                        width="">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.blockList.requestUri')" :show-overflow-tooltip="true" align="center" prop="requestUri"
                        width="">
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.blockList.requestMethod')" :show-overflow-tooltip="true" align="center" prop="requestMethod"
                        width="">
        <template slot-scope="scope">
          <span>{{ scope.row.requestMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.blockList.limitStart')" :show-overflow-tooltip="true" align="center" prop="limitStart"
                        width="">
        <template slot-scope="scope">
          <span>{{ scope.row.limitStart }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.blockList.limitEnd')" :show-overflow-tooltip="true" align="center" prop="limitEnd"
                        width="">
        <template slot-scope="scope">
          <span>{{ scope.row.limitEnd }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.blockList.state')" :show-overflow-tooltip="true" align="center" prop="state"
                       :filter-multiple="false" column-key="state"
                       :filters="[{ text: $t('common.state.valid'), value: true },{ text: $t('common.state.invalid'), value: false }]"
                        width="">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state ? 'success' : 'danger'" slot>
            {{ scope.row.state ? $t("common.state.valid") : $t("common.state.invalid") }}
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
        :label="$t('table.operation')" align="center" column-key="operation" class-name="small-padding fixed-width" width="100px">
        <template slot-scope="{ row }">
          <i @click="copy(row)" class="el-icon-copy-document table-operation" :title="$t('common.delete')"
             style="color: #2db7f5;" />
<!--             style="color: #2db7f5;" v-hasPermission="['blockList:add']"/>-->
          <i @click="edit(row)" class="el-icon-edit table-operation" :title="$t('common.delete')"
             style="color: #2db7f5;"/>
<!--             style="color: #2db7f5;" v-hasPermission="['blockList:edit']"/>-->
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" :title="$t('common.delete')"
             style="color: #f50;" />
<!--             style="color: #f50;" v-hasPermission="['blockList:delete']"/>-->
<!--          <el-link class="no-perm" v-has-no-permission="['blockList:edit', 'blockList:copy', 'blockList:delete']">-->
<!--            {{ $t("tips.noPermission") }}-->
<!--          </el-link>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current"
      :total="Number(tableData.total)" @pagination="fetch" v-show="tableData.total > 0"/>
    <blockList-edit :dialog-visible="dialog.isVisible" :type="dialog.type"
            @close="editClose" @success="editSuccess" ref="edit"/>
    <blockList-import ref="import" :dialog-visible="fileImport.isVisible" :type="fileImport.type"
            :action="fileImport.action" accept=".xls,.xlsx" @close="importClose" @success="importSuccess" />
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="true"
               title="预览" width="80%" top="50px" :visible.sync="preview.isVisible" v-el-drag-dialog>
      <el-scrollbar>
        <div v-html="preview.context"></div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import elDragDialog from '@/directive/el-drag-dialog'
import BlockListEdit from "./edit";
import blockListApi from "@/api/BlockList.js";
import BlockListImport from "@/components/lamp/Import"
import {downloadFile, loadEnums, initDicts, initQueryParams} from '@/utils/commons'

export default {
  name: "BlockListManage",
  directives: { elDragDialog },
  components: { Pagination, BlockListEdit, BlockListImport},
  filters: {

  },
  data() {
    return {
      // 编辑
      dialog: {
          isVisible: false,
          type: "add"
      },
      // 预览
      preview: {
        isVisible: false,
        context: ''
      },
      // 导入
      fileImport: {
        isVisible: false,
        type: "import",
        action: `${process.env.VUE_APP_BASE_API}/gateway/blockList/import`
      },
      tableKey: 0,
      queryParams: initQueryParams(),
      selection: [],
      loading: false,
      tableData: {
          total: 0
      },
      // 枚举
      enums: {
      },
      // 字典
      dicts: {
      }
    };
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.fetch();

    // 初始化字典和枚举
    const enumList = [];
    const dictList = [];
    loadEnums(enumList, this.enums, 'gateway');
    initDicts(dictList, this.dicts);
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
          ...this.queryParams
      });
    },
    reset() {
      this.queryParams = initQueryParams();
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    exportExcelPreview() {
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
      }
      this.queryParams.extra.fileName = '导出数据';
      blockListApi.preview(this.queryParams).then(response => {
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
      this.queryParams.extra.fileName = '导出数据';
      blockListApi.export(this.queryParams).then(response => {
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
      blockListApi.delete({ ids: ids }).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success"
          });
          this.search();
        }
      });
    },
    add() {
      this.dialog.type = "add";
      this.dialog.isVisible = true;
      this.$refs.edit.setBlockList({ enums: this.enums, dicts: this.dicts});
    },
    copy(row) {
      row.id = null;
      this.$refs.edit.setBlockList({row, enums: this.enums, dicts: this.dicts});
      this.dialog.type = "copy";
      this.dialog.isVisible = true;
    },
    edit(row) {
      this.$refs.edit.setBlockList({row, enums: this.enums, dicts: this.dicts});
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

      blockListApi.page(this.queryParams).then(response => {
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
    filterChange (filters) {
      for (const key in filters) {
        if(key.includes('.')) {
          const val = { };
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
  }
};
</script>
<style lang="scss" scoped></style>
