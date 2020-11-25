<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.smsTemplate.appId')" size="small" class="filter-item search-item" v-model="queryParams.model.appId" />
      <el-input :placeholder="$t('table.smsTemplate.customCode')" size="small" class="filter-item search-item" v-model="queryParams.model.customCode" />
      <el-input :placeholder="$t('table.smsTemplate.name')" size="small" class="filter-item search-item" v-model="queryParams.model.name" />
      <el-input :placeholder="$t('table.smsTemplate.templateCode')" size="small" class="filter-item search-item" v-model="queryParams.model.templateCode" />
      <el-input :placeholder="$t('table.smsTemplate.signName')" size="small" class="filter-item search-item" v-model="queryParams.model.signName" />
      <el-date-picker size="small"
        :range-separator="null"
        class="filter-item search-item date-range-item"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        type="daterange"
        v-model="queryParams.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" size="small" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" size="small" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
      <el-button @click="add" size="small" class="filter-item" plain type="danger" v-has-permission="['msg:smsTemplate:add']">
        {{ $t("table.add") }}
      </el-button>
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['msg:smsTemplate:delete','msg:smsTemplate:export']">
        <el-button size="small" >
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['msg:smsTemplate:delete']">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['msg:smsTemplate:export']">{{ $t('table.export') }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['msg:smsTemplate:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="importExcel" v-has-permission="['msg:smsTemplate:import']">
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
      <el-table-column align="center" type="selection" width="40px" />
      <el-table-column
        :filter-multiple="false"
        :filters="providerTypeFilters"
        column-key="providerType"
        :label="$t('table.smsTemplate.providerType')"
        :show-overflow-tooltip="true"
        align="center"
        prop="providerType"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.providerType.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.appId')" :show-overflow-tooltip="true" align="center" prop="appId">
        <template slot-scope="scope">
          <span>{{ scope.row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.appSecret')" :show-overflow-tooltip="true" align="center" prop="appSecret">
        <template slot-scope="scope">
          <span>{{ scope.row.appSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.name')" :show-overflow-tooltip="true" align="center" prop="name" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.customCode')" :show-overflow-tooltip="true" align="center" prop="customCode">
        <template slot-scope="scope">
          <span>{{ scope.row.customCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.templateCode')" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.templateCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.signName')" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.signName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.smsTemplate.templateDescribe')" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.templateDescribe }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" align="center" prop="createTime" sortable="custom" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" column-key="operation" class-name="small-padding fixed-width" width="100px">
        <template slot-scope="{row}">
          <i @click="edit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;" v-hasPermission="['msg:smsTemplate:edit']" />
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;" v-hasPermission="['msg:smsTemplate:delete']" />
          <el-link class="no-perm" v-has-no-permission="['msg:smsTemplate:edit','msg:smsTemplate:delete']">{{ $t('tips.noPermission') }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current" :total="Number(tableData.total)" @pagination="fetch" v-show="tableData.total>0" />
    <sms-template-edit :dialog-visible="dialog.isVisible" :type="dialog.type" @close="editClose" @success="editSuccess" ref="edit" />
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
import Pagination from '@/components/Pagination'
import SmsTemplateEdit from './edit'
import smsTemplateApi from '@/api/SmsTemplate.js'
import { convertEnum } from '@/utils/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import FileImport from "@/components/lamp/Import"
import { downloadFile, initDicts, initMsgEnums, initQueryParams } from '@/utils/commons'

export default {
  name: 'SmsTemplateManage',
  directives: { elDragDialog },
  components: { Pagination, SmsTemplateEdit, FileImport },
  filters: {
    statusFilter (status) {
      const map = {
        false: 'danger',
        true: 'success'
      }
      return map[status] || 'success'
    }
  },
  data () {
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
        action: `${process.env.VUE_APP_BASE_API}/msg/smsTemplate/import`
      },
      tableKey: 0,
      queryParams: initQueryParams({
        model:{}
      }),
      selection: [],
      loading: false,
      tableData: {
        total: 0
      },
      enums:{
        ProviderType: {}
      },
    }
  },
  computed: {
    providerTypeFilters () {
      return convertEnum(this.enums.ProviderType)
    }
  },
  mounted () {
    initMsgEnums(['ProviderType'], this.enums)
    this.fetch()
  },
  methods: {
    editClose () {
      this.dialog.isVisible = false
    },
    editSuccess () {
      this.search()
    },
    onSelectChange (selection) {
      this.selection = selection
    },
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      this.queryParams = initQueryParams({
        model:{}
      })
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    exportExcelPreview() {
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
      }
      this.queryParams.extra.fileName = '导出用户数据';
      smsTemplateApi.preview(this.queryParams).then(response => {
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
      this.queryParams.extra.fileName = '导出用户数据';
      smsTemplateApi.export(this.queryParams).then(response => {
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
    singleDelete (row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete () {
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
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (ids) {
      smsTemplateApi.delete({ ids: ids })
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
    add () {
      this.dialog.type = 'add'
      this.dialog.isVisible = true
      this.$refs.edit.setSmsTemplate({enums: this.enums})
    },
    edit (row) {
      this.$refs.edit.setSmsTemplate({row, enums: this.enums})
      this.dialog.type = 'edit'
      this.dialog.isVisible = true
    },
    fetch (params = {}) {
      this.loading = true;
      if (this.queryParams.timeRange) {
        this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
        this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
      }

      this.queryParams.current = params.current ? params.current : this.queryParams.current;
      this.queryParams.size = params.size ? params.size : this.queryParams.size;

      smsTemplateApi.page(this.queryParams).then(response => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
