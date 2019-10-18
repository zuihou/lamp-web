<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.clientId" placeholder="clientId" class="filter-item search-item" />
      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t('table.reset') }}
      </el-button>
      <el-dropdown v-has-any-permission="['user:add','user:delete','user:reset','user:export']" trigger="click" class="filter-item">
        <el-button>
          {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['client:add']" @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['client:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      :highlight-current-row="true"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column label="clientId" prop="clientId" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="clientSecret" prop="clientSecret" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template>
          <span>******</span>
        </template>
      </el-table-column>
      <el-table-column label="scope" prop="scope" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column label="authorizedGrantTypes" prop="authorizedGrantTypes" :show-overflow-tooltip="true" align="center" min-width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.authorizedGrantTypes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="accessTokenValidity" prop="accessTokenValidity" :show-overflow-tooltip="true" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.accessTokenValidity }} s</span>
        </template>
      </el-table-column>
      <el-table-column label="refreshTokenValidity" prop="refreshTokenValidity" :show-overflow-tooltip="true" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ (scope.row.refreshTokenValidity) ? (scope.row.refreshTokenValidity + 's') : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="webServerRedirectUri" prop="webServerRedirectUri" :show-overflow-tooltip="true" align="center" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.webServerRedirectUri }}</span>
        </template>
      </el-table-column>
      <el-table-column label="autoapprove" prop="autoapprove" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="{row}">
          <el-tag v-if="row.autoapprove !== null" :type="row.autoapprove | approveFilter">
            {{ transApprove(row.autoapprove) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="150px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <i v-hasPermission="['client:decrypt']" class="el-icon-unlock table-operation" style="color: #87d068;" @click="unlock(row)" />
          <i v-hasPermission="['client:update']" class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i v-hasPermission="['client:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['client:decrypt','client:update','client:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="fetch" />
    <client-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import ClientEdit from './Edit'

export default {
  name: 'ClientManage',
  components: { Pagination, ClientEdit },
  filters: {
    approveFilter(status) {
      const map = {
        1: 'success',
        0: 'danger'
      }
      return map[status]
    }
  },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: '',
        type: ''
      },
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      selection: [],
      pagination: {
        size: 10,
        num: 1
      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    transApprove(v) {
      switch (v) {
        case 0:
          return 'false'
        case 1:
          return 'true'
        default:
          return ''
      }
    },
    editSuccess() {
      this.search()
    },
    editClose() {
      this.dialog.isVisible = false
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    add() {
      this.dialog.title = this.$t('common.add')
      this.dialog.isVisible = true
      this.dialog.type = 'add'
    },
    edit(row) {
      this.$refs.edit.setClient(row)
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
      this.dialog.type = 'edit'
    },
    unlock(row) {
      this.$get(`auth/client/secret/${row.clientId}`).then((r) => {
        this.$message({
          showClose: true,
          message: this.$t('tips.clientOriginSecret') + r.data.data,
          duration: 0,
          type: 'success'
        })
      })
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
        const clientIds = []
        this.selection.forEach((c) => {
          clientIds.push(c.clientId)
        })
        this.delete(clientIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    delete(clientIds) {
      this.$delete(`auth/client`, { clientIds }).then(() => {
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.search()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    reset() {
      this.queryParams = {}
      this.search()
    },
    fetch(params = {}) {
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      this.loading = true
      this.$get('auth/client', {
        ...params
      }).then((r) => {
        const data = r.data.data
        this.total = data.total
        this.list = data.rows
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
