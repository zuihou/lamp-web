<template>
  <div class="dept">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div class="filter-container">
            <el-input v-model="deptName" :placeholder="$t('table.dept.deptName')" class="filter-item search-item" />
            <el-button class="filter-item" type="primary" plain @click="search">
              {{ $t('table.search') }}
            </el-button>
            <el-button class="filter-item" type="warning" plain @click="reset">
              {{ $t('table.reset') }}
            </el-button>
            <el-dropdown v-has-any-permission="['dept:add','dept:delete','dept:export']" trigger="click" class="filter-item">
              <el-button>
                {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-has-permission="['dept:add']" @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
                <el-dropdown-item v-has-permission="['dept:delete']" @click.native="deleteDept">{{ $t('table.delete') }}</el-dropdown-item>
                <el-dropdown-item v-has-permission="['dept:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            ref="deptTree"
            :data="deptTree"
            :check-strictly="true"
            show-checkbox
            accordion
            node-key="id"
            highlight-current
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ dept.deptId === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form ref="form" :model="dept" :rules="rules" label-position="right" label-width="100px">
              <el-form-item :label="$t('table.dept.parentId')" prop="parentId">
                <el-tooltip class="item" effect="dark" :content="$t('tips.topId')" placement="top-start">
                  <el-input v-model="dept.parentId" readonly />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('table.dept.deptName')" prop="deptName">
                <el-input v-model="dept.deptName" :readonly="dept.deptId === '' ? false : 'readonly'" />
              </el-form-item>
              <el-form-item :label="$t('table.dept.orderNum')" prop="orderNum">
                <el-input-number v-model="dept.orderNum" :min="0" :max="100" @change="handleNumChange" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" plain @click="submit">{{ dept.deptId === '' ? this.$t('common.add') : this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'DeptManager',
  data() {
    return {
      deptName: '',
      deptTree: [],
      dept: this.initDept(),
      rules: {
        deptName: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 3, max: 10, message: this.$t('rules.range3to10'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initDeptTree()
  },
  methods: {
    initDept() {
      return {
        deptId: '',
        deptName: '',
        parentId: 0,
        orderNum: 0
      }
    },
    initDeptTree() {
      this.$get('system/dept').then((r) => {
        this.deptTree = r.data.data.rows
      })
    },
    exportExcel() {
      this.$download('system/dept/excel', {
        deptName: this.deptName
      }, `dept_${new Date().getTime()}.xlsx`)
    },
    handleNumChange(val) {
      this.dept.orderNum = val
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(data) {
      this.dept = { ...data }
      this.dept.deptName = this.dept.label
      this.dept.deptId = this.dept.id
      this.$refs.form.clearValidate()
    },
    add() {
      this.resetForm()
      const checked = this.$refs.deptTree.getCheckedKeys()
      if (checked.length > 1) {
        this.$message({
          message: this.$t('tips.onlyChooseOne'),
          type: 'warning'
        })
      } else if (checked.length > 0) {
        this.dept.parentId = checked[0]
      } else {
        this.dept.parentId = 0
      }
    },
    deleteDept() {
      const checked = this.$refs.deptTree.getCheckedKeys()
      if (checked.length === 0) {
        this.$message({
          message: this.$t('tips.noNodeSelected'),
          type: 'warning'
        })
      } else {
        this.$confirm(this.$t('tips.confirmDeleteNode'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.dept.deptIds = checked.join(',')
          this.$delete(`system/dept/${this.dept.deptIds}`).then(() => {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.reset()
          })
        }).catch(() => {
          this.$refs.deptTree.setCheckedKeys([])
        })
      }
    },
    search() {
      this.$refs.deptTree.filter(this.deptName)
    },
    reset() {
      this.initDeptTree()
      this.deptName = ''
      this.resetForm()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dept.createTime = this.dept.modifyTime = null
          if (this.dept.deptId) {
            this.$put('system/dept', { ...this.dept }).then(() => {
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.reset()
            })
          } else {
            this.$post('system/dept', { ...this.dept }).then(() => {
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
    resetForm() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.dept = this.initDept()
    }
  }
}
</script>
<style lang="scss" scoped>
  .dept {
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
