<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.account"
        :placeholder="$t(&quot;table.user.account&quot;)"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.orgId"
        :placeholder="$t(&quot;table.user.orgId&quot;)"
        class="filter-item search-item"
      />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        class="filter-item search-item date-range-item"
        type="daterange"
      />
      <el-button
        class="filter-item"
        type="primary"
        plain
        @click="search"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        type="warning"
        plain
        @click="reset"
      >
        {{ $t('table.reset') }}
      </el-button>
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
          >
            {{ $t('table.add') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;user:delete&quot;]"
            @click.native="batchDelete"
          >
            {{ $t('table.delete') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;user:reset&quot;]"
            @click.native="resetPassword"
          >
            {{ $t('table.resetPassword') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-has-permission="[&quot;user:export&quot;]"
            @click.native="exportExcel"
          >
            {{ $t('table.export') }}
          </el-dropdown-item>
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
      <el-table-column
        type="selection"
        align="center"
        width="40px"
      />
      <el-table-column
        :label="$t(&quot;table.user.avatar&quot;)"
        prop="avatar"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <el-avatar
            :key="scope.row.avatar"
            fit="fill"
            :src="scope.row.avatar"
          >
            <el-avatar>{{ scope.row.name | userAvatarFilter }}</el-avatar>
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.account&quot;)"
        prop="account"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.name&quot;)"
        prop="name"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.sex&quot;)"
        prop="sex.desc"
        class-name="status-col"
        width="70px"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.sex.code | sexFilter">
            {{ row.sex.desc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.email&quot;)"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.orgId&quot;)"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orgId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.stationId&quot;)"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.stationId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.status&quot;)"
        :filters="[{ text: $t(&quot;common.status.valid&quot;), value: true }, { text: $t(&quot;common.status.invalid&quot;), value: false }]"
        :filter-method="filterStatus"
        class-name="status-col"
        width="70px"
      >
        <template slot-scope="{row}">
          <el-tag
            :type="row.status | statusFilter"
          >
            {{ row.status ? $t('common.status.valid') : $t('common.status.invalid') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.user.createTime&quot;)"
        prop="createTime"
        align="center"
        width="170px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(&quot;table.operation&quot;)"
        align="center"
        width="100px"
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
            class="el-icon-edit table-operation"
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
          >
            {{ $t('tips.noPermission') }}
          </el-link>
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
      :type="dialog.type"
      @success="editSuccess"
      @close="editClose"
    />
    <user-view
      ref="view"
      :dialog-visible="userViewVisible"
      @close="viewClose"
    />
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
    userAvatarFilter (name) {
      return name.charAt(0)
    },
    sexFilter (status) {
      const map = {
        'W': 'success',
        'M': 'danger',
        'N': 'info'
      }
      return map[status] || 'info'
    },
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
      userViewVisible: false,
      tableKey: 0,
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
    filterStatus (value, row) {
      return row.status === value
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
      this.$message({
        message: '待完善',
        type: 'warning'
      })
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
        const ids = []
        this.selection.forEach((u) => {
          ids.push(u.id)
        })
        userApi.reset({ 'ids': ids })
          .then((response) => {
            const res = response.data
            if (res.isSuccess) {
              this.$message({
                message: this.$t('tips.resetPasswordSuccess'),
                type: 'success'
              })
            }
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
        const ids = []
        this.selection.forEach((u) => {
          if (u.id === this.currentUser.id) {
            contain = true
            return
          }
          ids.push(u.id)
        })
        if (contain) {
          this.$message({
            message: this.$t('tips.containCurrentUser'),
            type: 'warning'
          })
          this.clearSelections()
        } else {
          this.delete(ids)
        }
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections () {
      this.$refs.table.clearSelection()
    },
    delete (ids) {
      userApi.delete({ 'ids': ids })
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
      this.$refs.edit.setUser(false)
    },
    view (row) {
      this.$refs.view.setUser(row)
      this.userViewVisible = true
    },
    edit (row) {
      this.$refs.edit.setUser(row)
      this.dialog.type = 'edit'
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
      window.location.hash = '/login'
      userApi.findUserPage(params)
        .then((response) => {
          const res = response.data
          this.loading = false
          if (res.isSuccess) {
            this.tableData = res.data
          }
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
