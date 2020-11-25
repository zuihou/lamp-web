<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.application.clientId')" class="filter-item search-item"
                v-model="queryParams.model.clientId"/>
      <el-input :placeholder="$t('table.application.name')" class="filter-item search-item"
                v-model="queryParams.model.name"/>
      <el-date-picker
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        v-model="queryParams.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
      <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['authority:application:add']">
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click"
                   v-has-any-permission="['authority:application:delete','authority:application:export']">
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['authority:application:delete']">{{ $t('table.delete')
            }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['authority:application:export']">
            {{ $t("table.export") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['authority:application:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="tableData.records"
      :key="tableKey"
      @cell-click="cellClick"
      @filter-change="filterChange"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      border fit row-key="id"
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
      <el-table-column :label="$t('table.application.clientId')" column-key="clientId" :show-overflow-tooltip="true"
                       align="center" prop="clientId">
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.application.name')" :show-overflow-tooltip="true" align="left"
                       min-width="120px" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.application.website')" :show-overflow-tooltip="true" align="left"
                       min-width="120px" prop="website">
        <template slot-scope="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.application.appType')" :show-overflow-tooltip="true" align="center"
                       min-width="50px" prop="appType">
        <template slot-scope="scope">
          <span>{{ scope.row.appType ? scope.row.appType.desc : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.application.state')" :show-overflow-tooltip="true" align="center"
                       prop="state" width="70px">
        <template slot-scope="scope">
          <el-badge :type="scope.row.state ? 'success' :'danger'" class="state-item" is-dot/>
          <span>{{ scope.row.state? $t('common.state.valid') : $t('common.state.invalid') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.application.describe')" :show-overflow-tooltip="true" align="left"
                       min-width="120px" prop="describe">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.createTime')" :show-overflow-tooltip="true" sortable="custom" align="center"
                       prop="className" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" column-key="operation"
                       class-name="small-padding fixed-width" fixed="right" width="110px">
        <template slot-scope="{row}">
          <i @click="edit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;"
             v-has-permission="['authority:application:edit']"/>
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;"
             v-has-permission="['authority:application:delete']"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current" :total="Number(tableData.total)"
                @pagination="fetch" v-show="tableData.total>0"/>

    <application-edit :dialog-visible="dialog.isVisible" :type="dialog.type" @close="editClose" @success="editSuccess"
                      ref="edit"/>
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
  import Pagination from '@/components/Pagination'
  import ApplicationEdit from './edit'
  import applicationApi from '@/api/Application.js'
  import elDragDialog from '@/directive/el-drag-dialog'
  import {downloadFile, initQueryParams} from '@/utils/commons'
  import {copy} from '@/utils/utils'

  export default {
    name: 'Application',
    directives: {elDragDialog},
    components: {Pagination, ApplicationEdit},
    filters: {},
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
        tableKey: 0,
        loading: false,
        queryParams: initQueryParams({
          model: {}
        }),
        selection: [],
        tableData: {
          total: 0
        },
      }
    },
    computed: {},
    mounted() {
      this.fetch()
    },
    methods: {
      onSelectChange(selection) {
        this.selection = selection
      },
      exportExcelPreview() {
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.extra.fileName = '导出应用数据';
        applicationApi.preview(this.queryParams).then(response => {
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
        this.queryParams.extra.fileName = '导出应用数据';
        applicationApi.export(this.queryParams).then(response => {
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

        applicationApi.page(this.queryParams).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.tableData = res.data;
          }
        }).finally(() => this.loading = false);
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

        const isPersist = this.selection.findIndex(item => item.isPersist)
        if (isPersist > -1) {
          this.$message({
            message: "不能删除内置数据",
            type: 'warning'
          })
          return
        }

        this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          const logIds = this.selection.map(item => item.id)
          this.delete(logIds)
        }).catch(() => {
          this.clearSelections()
        })
      },
      clearSelections() {
        this.$refs.table.clearSelection()
      },
      delete(logIds) {
        applicationApi.delete({ids: logIds})
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
      search() {
        this.fetch({
          ...this.queryParams,
        })
      },
      reset() {
        this.queryParams = initQueryParams({
          model: {}
        });
        this.$refs.table.clearSort()
        this.$refs.table.clearFilter()
        this.search()
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
      closeDrawer(done) {
        done()
        this.currentRow = {}
      },
      cellClick(row, column) {
        if (column['columnKey'] === "operation") {
          return;
        }
        if (column['columnKey'] === "clientId") {
          copy(row[column.property]);
          this.$message({
            message: this.$t('tips.copySelected'),
            type: 'success'
          })
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
      },
      editClose() {
        this.dialog.isVisible = false
      },
      editSuccess() {
        this.search()
      },
      add() {
        this.dialog.type = 'add'
        this.dialog.isVisible = true
        this.$refs.edit.setApplication(false)
      },
      edit(row) {
        this.$refs.edit.setApplication(row)
        this.dialog.type = 'edit'
        this.dialog.isVisible = true
      }

    }
  }
</script>
<style lang="scss" scoped>
  .item {
    margin-top: 7px;
  }

  .box-item {
    margin-top: 15px;

    aside {
      word-wrap: break-word;
      margin-top: 15px;
    }

    pre {
      white-space: pre-wrap;
      font-size: 0.8em;
      line-height: 1.5em;
    }
  }
</style>
