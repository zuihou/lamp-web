<template>
  <div class='app-container'>
    <div class='filter-container'>
      <el-input
        v-model='queryParams.code'
        :placeholder='$t(&quot;table.tenant.code&quot;)'
        class='filter-item search-item'
      />
      <el-input
        v-model='queryParams.name'
        :placeholder='$t(&quot;table.tenant.name&quot;)'
        class='filter-item search-item'
      />
      <el-date-picker
        v-model='queryParams.timeRange'
        :range-separator='null'
        :start-placeholder='$t(&quot;table.createTime&quot;)'
        value-format='yyyy-MM-dd HH:mm:ss'
        format='yyyy-MM-dd HH:mm:ss'
        class='filter-item search-item date-range-item'
        type='daterange'
      />
      <el-button class='filter-item' type='primary' plain @click='search'>{{ $t('table.search') }}</el-button>
      <el-button class='filter-item' type='warning' plain @click='reset'>{{ $t('table.reset') }}</el-button>
      <el-dropdown trigger='click' class='filter-item'>
        <el-button>
          {{ $t('table.more') }}
          <i class='el-icon-arrow-down el-icon--right' />
        </el-button>
        <el-dropdown-menu slot='dropdown'>
          <el-dropdown-item
            icon='el-icon-circle-plus-outline'
            @click.native='add'
          >{{ $t('table.add') }}</el-dropdown-item>
          <el-dropdown-item
            icon='el-icon-delete'
            @click.native='batchDelete'
          >{{ $t('table.delete') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      ref='table'
      :key='tableKey'
      v-loading='loading'
      :data='tableData.records'
      border
      fit
      style='width: 100%;'
      @selection-change='onSelectChange'
      @sort-change='sortChange'
    >
      <el-table-column type='selection' align='center' width='40px' />
      <el-table-column
        :label='$t(&quot;table.tenant.code&quot;)'
        prop='code'
        :show-overflow-tooltip='true'
        align='center'
        width='100px'
      >
        <template slot-scope='scope'>
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label='$t(&quot;table.tenant.name&quot;)'
        prop='name'
        :show-overflow-tooltip='true'
        class-name='status-col'
      >
        <template slot-scope='scope'>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label='$t(&quot;table.tenant.duty&quot;)' class-name='status-col'>
        <template slot-scope='scope'>
          <span>{{scope.row.duty}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label='$t(&quot;table.tenant.type&quot;)'
        :show-overflow-tooltip='true'
        prop='type'
        align='center'
        width='80px'
        :filter-multiple='false'
        :filter-method='typeFilterHandler'
        :filters='typeFilterList'
      >
        <template slot-scope='{row}'>
          <el-tag :type='row.type.code | typeFilter'>{{ row.type.desc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label='$t(&quot;table.tenant.status&quot;)'
        align='center'
        :show-overflow-tooltip='true'
        prop='status'
        width='90px'
        :filter-multiple='false'
        :filter-method='statusFilterHandler'
        :filters='statusFilterList'
      >
        <template slot-scope='{row}'>
          <el-tag :type='row.status.code | statusFilter'>{{ row.status.desc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label='$t(&quot;table.tenant.expirationTime&quot;)'
        prop='expirationTime'
        align='center'
        width='170px'
      >
        <template slot-scope='scope'>
          <span>{{ scope.row.expirationTime ? scope.row.expirationTime : '永久' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :label='$t(&quot;table.createTime&quot;)'
        prop='createTime'
        align='center'
        width='170px'
      >
        <template slot-scope='scope'>
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label='$t(&quot;table.operation&quot;)'
        align='center'
        width='150px'
        class-name='small-padding fixed-width'
      >
        <template slot-scope='{row}'>
          <i class='el-icon-view table-operation' style='color: #87d068;' @click='view(row)' />
          <i class='el-icon-edit table-operation' style='color: #2db7f5;' @click='edit(row)' />
          <i
            class='el-icon-delete table-operation'
            style='color: #f50;'
            @click='singleDelete(row)'
          />
          <el-link
            v-has-no-permission='[&quot;tenant:view&quot;,&quot;tenant:update&quot;,&quot;tenant:delete&quot;]'
            class='no-perm'
          >{{ $t('tips.noPermission') }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show='tableData.total>0'
      :total='Number(tableData.total)'
      :page.sync='pagination.current'
      :limit.sync='pagination.size'
      @pagination='fetch'
    />
    <tenant-edit
      ref='edit'
      :dialog-visible='dialog.isVisible'
      :title='dialog.title'
      @success='editSuccess'
      @close='editClose'
    />
    <tenant-view ref='view' :dialog-visible='tenantViewVisible' @close='viewClose' />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import TenantEdit from './Edit'
import TenantView from './View'
import tenantApi from '@/api/Tenant.js'

export default {
  name: 'TenantManage',
  components: { Pagination, TenantEdit, TenantView },
  filters: {
    typeFilter (status) {
      const map = {
        "CREATE": 'success',
        "REGISTER": 'danger'
      }
      return map[status] || 'info'
    },
    statusFilter (status) {
      const map = {
        "NORMAL": 'success',
        "FORBIDDEN": 'warning',
        "WAITING": 'info',
        'REFUSE': 'danger'
      }
      return map[status] || ''
    }
  },
  data () {
    return {
      dialog: {
        isVisible: false,
        title: ''
      },
      tenantViewVisible: false,
      tableKey: 0,
      total: 0,
      queryParams: {},
      sort: {},
      selection: [],
      // 以下已修改
      loading: false,
      tableData: {
        total: 0
      },
      pagination: {
        size: 10,
        current: 1
      }
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.account.user
    },
    enum () {
      return this.$store.state.common.enums
    },
    typeFilterList () {
      let list = []
      for (let key in this.enum.TenantTypeEnum) {
        list.push({
          value: key,
          text: this.enum.TenantTypeEnum[key]
        })
      }
      return list
    },
    statusFilterList () {
      let list = []

      for (let key in this.enum.TenantStatusEnum) {
        list.push({
          value: key,
          text: this.enum.TenantStatusEnum[key]
        })
      }
      return list
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    typeFilterHandler (value, row, column) {
      const property = column['property']
      return row[property]['code'] === value
    },
    statusFilterHandler (value, row, column) {
      const property = column['property']
      return row[property]['code'] === value
    },
    viewClose () {
      this.tenantViewVisible = false
    },
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
        ...this.queryParams,
        ...this.sort
      })
    },
    reset () {
      this.queryParams = {}
      this.sort = {}
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    add () {
      this.$refs.edit.type = 'add'
      this.dialog.title = this.$t('common.add')
      this.dialog.isVisible = true
    },
    singleDelete (row) {
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
      let contain = false
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const ids = this.selection.map(item => item.id)
        this.delete(ids)
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (ids) {
      tenantApi.remove({ ids: ids })
        .then((res) => {
          if (res.isSuccess) {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.search()
          }
        })
    },
    view (row) {
      this.$refs.view.setTenant(row)
      this.tenantViewVisible = true
    },
    edit (row) {
      this.$refs.edit.setTenant(row)
      this.$refs.edit.type = 'edit'
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
    },
    fetch (params = {}) {
      this.loading = true
      params.size = this.pagination.size
      params.current = this.pagination.current
      if (this.queryParams.timeRange) {
        params.startCreateTime = this.queryParams.timeRange[0]
        params.endCreateTime = this.queryParams.timeRange[1]
      }
      tenantApi.findTenantPage(params)
        .then((r) => {
          if (r.isError) {
            return
          }
          this.tableData = r.data
          this.loading = false
        })
    },
    sortChange (val) {
      this.sort.field = val.prop
      this.sort.order = val.order
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
