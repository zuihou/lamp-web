<template>
  <div class="app-container">
    <div v-if="queryParams.dictionaryId === -1">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-input :placeholder="$t('table.dictionaryItem.code')" size="small" class="filter-item search-item"
                  v-model="queryParams.model.code"/>
        <el-input :placeholder="$t('table.dictionaryItem.name')" size="small" class="filter-item search-item"
                  v-model="queryParams.model.name"/>
        <el-button @click="search" class="filter-item" plain type="primary" size="small">{{ $t('table.search') }}</el-button>
        <el-button @click="reset" class="filter-item" plain type="warning" size="small">{{ $t('table.reset') }}</el-button>
        <el-dropdown class="filter-item" trigger="click"
                     v-has-any-permission="['dict:add','dict:delete','dict:export']">
          <el-button size="small">
            {{ $t('table.more') }}
            <i class="el-icon-arrow-down el-icon--right"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="add" v-has-permission="['dict:add']">{{ $t('table.add') }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="batchDelete" v-has-permission="['dict:delete']">{{ $t('table.delete') }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel" v-has-permission="['dict:export']">{{ $t('table.export') }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['dict:export']">
              {{ $t("table.exportPreview") }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="importExcel" v-has-permission="['dict:import']">
              {{ $t("table.import") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table :data="tableData.records" :key="tableKey" @selection-change="onSelectChange" @sort-change="sortChange"  @cell-click="cellClick" @filter-change="filterChange"
                border fit row-key="id" ref="table" size="mini" style="width: 100%;" v-loading="loading">
        <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
        <el-table-column :label="$t('table.dictionaryItem.code')" :show-overflow-tooltip="true" align="center"
                         prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.dictionaryItem.name')" :show-overflow-tooltip="true" align="center"
                         prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.dictionaryItem.describe')" :show-overflow-tooltip="true" align="center"
                         prop="describe">
          <template slot-scope="scope">
            <span>{{ scope.row.describe }}</span>
          </template>
        </el-table-column>
        <el-table-column
          column-key="status"
          :filter-multiple="false"
          :filters="[{ text: $t('common.status.valid'), value: true }, { text: $t('common.status.invalid'), value: false }]"
          :label="$t('table.dictionaryItem.status')"
          class-name="status-col"
          width="70px"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">{{ row.status ? $t('common.status.valid') :
              $t('common.status.invalid') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.createTime')" align="center" prop="createTime" sortable="custom"
                         width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')"  column-key="operation" sortable="custom" align="center" class-name="small-padding fixed-width"
                         width="100px">
          <template slot-scope="{row}">
            <i @click="edit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;"
               v-hasPermission="['dict:update']"/>
            <i @click="singleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;"
               v-hasPermission="['dict:delete']"/>
            <el-link class="no-perm" v-has-no-permission="['dict:update','dict:delete']">{{ $t('tips.noPermission') }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current" :total="Number(tableData.total)"
                  @pagination="fetch" v-show="tableData.total>0"/>
      <dictionaryItem-edit :dialog-visible="dialog.isVisible" :type="dialog.type" @close="editClose"
                           @success="editSuccess" ref="edit"/>
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
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import DictionaryItemEdit from './DictionaryItemEdit'
  import dictionaryItemApi from '@/api/DictionaryItem.js'
  import elDragDialog from '@/directive/el-drag-dialog'
  import FileImport from "@/components/zuihou/Import"
  import {downloadFile, initQueryParams} from '@/utils/commons'

  export default {
    name: 'DictionaryItemManage',
    directives: {elDragDialog},
    components: {Pagination, DictionaryItemEdit, FileImport},
    filters: {
      statusFilter(status) {
        const map = {
          false: 'danger',
          true: 'success'
        }
        return map[status] || 'success'
      }
    },
    data() {
      return {
        dialog: {
          isVisible: false,
          type: 'add'
        },
        preview: {
          isVisible: false,
          context: ''
        },
        fileImport: {
          isVisible: false,
          type: "import",
          action: `${process.env.VUE_APP_BASE_API}/authority/dictionaryItem/import`
        },
        tableKey: 0,
        queryParams: initQueryParams({
          model: {
            dictionaryId: -1
          },
          sort: 'sortValue',
          order:'ascending'
        }),
        selection: [],
        loading: false,
        dictionary: {
          id: null,
          code: ''
        },
        tableData: {
          total: 0
        },
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.fetch({
        ...this.queryParams
      })
    },
    methods: {
      editClose() {
        this.dialog.isVisible = false
      },
      editSuccess() {
        this.search()
      },
      onSelectChange(selection) {
        this.selection = selection
      },
      search() {
        this.fetch({
          ...this.queryParams
        })
      },
      reset() {
        this.queryParams = initQueryParams({
          model: {dictionaryId: this.dictionary.id}
        })
        this.$refs.table.clearSort()
        this.$refs.table.clearFilter()
        this.search()
      },
      exportExcelPreview() {
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.map.fileName = '导出字典数据';
        dictionaryItemApi.preview(this.queryParams).then(response => {
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
        this.queryParams.map.fileName = '导出字典数据';
        dictionaryItemApi.export(this.queryParams).then(response => {
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
        this.$refs.table.toggleRowSelection(row, true)
        this.batchDelete()
      },
      batchDelete() {
        if (!this.selection.length) {
          this.$message({
            message: this.$t('tips.noDataSelected'),
            type: 'warning'
          })
          return
        }
        this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          const ids = []
          this.selection.forEach((u) => {
            ids.push(u.id)
          })
          this.delete(ids)
        }).catch(() => {
          this.clearSelections()
        })
      },
      clearSelections() {
        this.$refs.table.clearSelection()
      },
      delete(ids) {
        dictionaryItemApi.delete({'ids': ids})
          .then((response) => {
            const res = response.data
            if (res.isSuccess) {
              this.$message({
                message: this.$t('tips.deleteSuccess'),
                type: 'success'
              })
            }
            this.search()
          })
      },
      add() {
        this.dialog.type = 'add'
        this.dialog.isVisible = true
        this.$refs.edit.setDictionaryItem({
          id: null,
          status: true,
          dictionaryId: this.dictionary.id,
          dictionaryType: this.dictionary.type
        })
      },
      edit(row) {
        this.$refs.edit.setDictionaryItem(row)
        this.dialog.type = 'edit'
        this.dialog.isVisible = true
      },
      fetch(params = {}) {
        this.loading = true;
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        dictionaryItemApi.page(this.queryParams).then(response => {
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
      dictionaryClick(dictionary) {
        this.queryParams.model.dictionaryId = dictionary.id
        this.dictionary = dictionary
        this.search()
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
