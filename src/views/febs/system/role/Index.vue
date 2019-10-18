<template>
  <div class="role">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="14">
        <div class="app-container">
          <div class="filter-container">
            <el-input v-model="queryParams.roleName" :placeholder="$t('table.role.roleName')" class="filter-item search-item" />
            <el-button class="filter-item" type="primary" plain @click="search">
              {{ $t('table.search') }}
            </el-button>
            <el-button class="filter-item" type="warning" plain @click="reset">
              {{ $t('table.reset') }}
            </el-button>
            <el-dropdown v-has-any-permission="['role:add','role:delete','role:export']" trigger="click" class="filter-item">
              <el-button>
                {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-has-permission="['role:add']" @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
                <el-dropdown-item v-has-permission="['role:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
                <el-dropdown-item v-has-permission="['role:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
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
            @selection-change="onSelectChange"
            @sort-change="sortChange"
          >
            <el-table-column type="selection" align="center" width="40px" />
            <el-table-column :label="$t('table.role.roleName')" prop="username" :show-overflow-tooltip="true" align="center" min-width="100px">
              <template slot-scope="scope">
                <span>{{ scope.row.roleName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.role.remark')" prop="remark" :show-overflow-tooltip="true" align="center" min-width="200px">
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.role.createTime')" prop="createTime" :show-overflow-tooltip="true" align="center" min-width="180px" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.operation')" align="center" width="150px" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <i v-has-permission="['role:update']" class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
                <i v-has-permission="['role:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
                <el-link v-has-no-permission="['role:update','role:delete']" class="no-perm">
                  {{ $t('tips.noPermission') }}
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="fetch" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ role.roleId === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form ref="form" :model="role" :rules="rules" label-position="right" label-width="100px">
              <el-form-item :label="$t('table.role.roleName')" prop="roleName">
                <el-input v-model="role.roleName" :readonly="role.roleId === '' ? false : 'readonly'" />
              </el-form-item>
              <el-form-item :label="$t('table.role.remark')" prop="remark">
                <el-input v-model="role.remark" type="textarea" rows="3" />
              </el-form-item>
              <el-form-item :label="$t('table.role.perms')" prop="remark">
                <el-tree
                  ref="permsTree"
                  :data="permsTree"
                  :check-strictly="true"
                  show-checkbox
                  accordion
                  node-key="id"
                  highlight-current
                />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" plain @click="submit">{{ role.roleId === '' ? this.$t('common.add') : this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'RoleManage',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      loading: false,
      list: null,
      selection: [],
      total: 0,
      permsTree: [],
      queryParams: {},
      sort: {},
      pagination: {
        size: 10,
        num: 1
      },
      role: this.initRole(),
      rules: {
        roleName: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 3, max: 10, message: this.$t('rules.range3to10'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (!this.role.roleId) {
              this.$get(`system/role/check/${value}`).then((r) => {
                if (!r.data) {
                  callback(this.$t('rules.roleNameExist'))
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        remark: { max: 50, message: this.$t('rules.noMoreThan50'), trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.fetch()
    this.initMenuTree()
  },
  methods: {
    initRole() {
      return {
        roleId: '',
        roleName: '',
        remark: ''
      }
    },
    initMenuTree() {
      this.$get('system/menu').then((r) => {
        this.permsTree = r.data.data.rows
      })
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    exportExcel() {
      this.$download('system/role/excel', {
        pageSize: this.pagination.size,
        pageNum: this.pagination.num,
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    },
    edit(row) {
      this.$refs.form.clearValidate()
      this.role = { ...row }
      if (this.role.menuIds) {
        this.$refs.permsTree.setCheckedKeys(this.role.menuIds.split(','))
      } else {
        this.$refs.permsTree.setCheckedKeys([])
      }
    },
    singleDelete(row) {
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
        const roleIds = []
        this.selection.forEach((r) => {
          roleIds.push(r.roleId)
        })
        this.delete(roleIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    delete(roleIds) {
      this.$delete(`system/role/${roleIds}`).then(() => {
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.search()
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.role.roleId) {
            this.role.menuIds = this.$refs.permsTree.getCheckedKeys().join(',')
            this.role.createTime = this.role.modifyTime = null
            this.$put('system/role', { ...this.role }).then(() => {
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.reset()
            })
          } else {
            this.role.menuIds = this.$refs.permsTree.getCheckedKeys().join(',')
            this.$post('system/role', { ...this.role }).then(() => {
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.reset()
            })
          }
        } else {
          return false
        }
      })
    },
    add() {
      this.resetForm()
    },
    sortChange(val) {
      this.sort.field = val.prop
      this.sort.order = val.order
      this.search()
    },
    reset() {
      this.resetForm()
      this.queryParams = {}
      this.sort = {}
      this.$refs.table.clearSort()
      this.search()
    },
    resetForm() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.role = this.initRole()
      this.$refs.permsTree.setCheckedKeys([])
    },
    search() {
      this.resetForm()
      this.fetch({
        ...this.queryParams,
        ...this.sort
      })
    },
    fetch(params = {}) {
      this.loading = true
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      this.$get('system/role', { ...params }).then((r) => {
        const data = r.data.data
        this.list = data.rows
        this.total = data.total
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .role {
    margin: 10px;
    .app-container {
      margin: 0 0 10px 0 !important;
    }
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card {
    border-radius: 0;
    border: none;
    .el-card__header {
      padding: 10px 20px !important;
      border-bottom: 1px solid #f1f1f1 !important;
    }
  }
</style>

