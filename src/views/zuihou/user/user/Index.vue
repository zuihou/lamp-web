<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.username"
        :placeholder="$t(&quot;table.user.username&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.deptName"
        :placeholder="$t(&quot;table.user.dept&quot;)"
        class="filter-item search-item"
      />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="$t(&quot;table.user.createTime&quot;)"
        value-format="yyyy-MM-dd"
        class="filter-item search-item date-range-item"
        type="daterange"
      />
      <el-button class="filter-item" type="primary" plain @click="search">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{ $t('table.reset') }}</el-button>
      <el-dropdown
        v-has-any-permission="[&quot;user:add&quot;,&quot;user:delete&quot;,&quot;user:reset&quot;,&quot;user:export&quot;]"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-has-permission="[&quot;user:add&quot;]"
            @click.native="add"
          >{{ $t('table.add') }}</el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;user:delete&quot;]"
            @click.native="batchDelete"
          >{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;user:reset&quot;]"
            @click.native="resetPassword"
          >{{ $t('table.resetPassword') }}</el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;user:export&quot;]"
            @click.native="exportExcel"
          >{{ $t('table.export') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="tableData.records"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column
        :label="$t(&quot;table.user.username&quot;)"
        prop="name"
        :show-overflow-tooltip="true"
        align="center"
        min-width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.sex&quot;)"
        prop="sex.desc"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.sex.code | sexFilter">{{ row.sex.desc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.email&quot;)"
        :show-overflow-tooltip="true"
        align="center"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t(&quot;table.user.dept&quot;)" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.orgId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.status&quot;)"
        :filters="[{ text: $t(&quot;common.status.valid&quot;), value: &quot;1&quot; }, { text: $t(&quot;common.status.invalid&quot;), value: &quot;0&quot; }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag
            :type="row.status | statusFilter"
          >{{ row.status === '1' ? $t('common.status.valid') : $t('common.status.invalid') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.createTime&quot;)"
        prop="createTime"
        align="center"
        min-width="180px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.operation&quot;)"
        align="center"
        min-width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <i
            v-hasPermission="[&quot;user:view&quot;]"
            class="el-icon-view table-operation"
            style="color: #87d068;"
            @click="view(row)"
          />
          <i
            v-hasPermission="[&quot;user:update&quot;]"
            class="el-icon-setting table-operation"
            style="color: #2db7f5;"
            @click="edit(row)"
          />
          <i
            v-hasPermission="[&quot;user:delete&quot;]"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />
          <el-link
            v-has-no-permission="[&quot;user:view&quot;,&quot;user:update&quot;,&quot;user:delete&quot;]"
            class="no-perm"
          >{{ $t('tips.noPermission') }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableData.total>0"
      :total="Number(tableData.total)"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="fetch"
    />
    <user-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <user-view ref="view" :dialog-visible="userViewVisible" @close="viewClose" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import UserEdit from './Edit'
import UserView from './View'
import userApi from '@/api/User.js'

export default {
  name: 'UserManage',
  components: { Pagination, UserEdit, UserView },
  filters: {
    sexFilter (status) {
      const map = {
        "W": 'success',
        "M": 'danger'
      }
      return map[status] || 'info'
    },
    statusFilter (status) {
      const map = {
        "0": 'danger',
        "1": 'success'
      }
      return map[status] || 'success'
    }
  },
  data () {
    return {
      dialog: {
        isVisible: false,
        title: ''
      },
      userViewVisible: false,
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
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    transSex (sex) {
      switch (sex) {
        case '0':
          return this.$t('common.sex.male')
        case '1':
          return this.$t('common.sex.female')
        default:
          return this.$t('common.sex.secret')
      }
    },
    filterStatus (value, row) {
      return row.status === value
    },
    filterSex (value, row) {
      return row.sex === value
    },
    viewClose () {
      this.userViewVisible = false
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
    exportExcel () {
      this.$download('system/user/excel', {
        size: this.pagination.size,
        current: this.pagination.current,
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    add () {
      this.dialog.title = this.$t('common.add')
      this.dialog.isVisible = true
    },
    resetPassword () {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmRestPassword'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const userNames = []
        this.selection.forEach((u) => {
          userNames.push(u.username)
        })
        this.$put('system/user/password/reset', {
          usernames: userNames.join(',')
        }).then(() => {
          this.$message({
            message: this.$t('tips.resetPasswordSuccess'),
            type: 'success'
          })
          this.clearSelections()
        })
      }).catch(() => {
        this.clearSelections()
      })
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
        const userIds = []
        this.selection.forEach((u) => {
          if (u.userId === this.currentUser.userId) {
            contain = true
            return
          }
          userIds.push(u.userId)
        })
        if (contain) {
          this.$message({
            message: this.$t('tips.containCurrentUser'),
            type: 'warning'
          })
          this.clearSelections()
        } else {
          this.delete(userIds)
        }
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (userIds) {
      this.$delete(`system/user/${userIds}`).then(() => {
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.search()
      })
    },
    view (row) {
      this.$refs.view.setUser(row)
      this.userViewVisible = true
    },
    edit (row) {
      let roleId = []
      if (row.roleId && typeof row.roleId === 'string') {
        roleId = row.roleId.split(',')
        row.roleId = roleId
      }
      this.$refs.edit.setUser(row)
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
      userApi.findUserPage(params)
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
