<template>
  <div class="menu">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div class="filter-container">
            <el-input v-model="menuName" :placeholder="$t('table.menu.menuName')" class="filter-item search-item" />
            <el-button class="filter-item" type="primary" plain @click="search">
              {{ $t('table.search') }}
            </el-button>
            <el-button class="filter-item" type="warning" plain @click="reset">
              {{ $t('table.reset') }}
            </el-button>
            <el-dropdown v-has-any-permission="['menu:add','menu:delete','menu:export']" trigger="click" class="filter-item">
              <el-button>
                {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-has-permission="['menu:add']" @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
                <el-dropdown-item v-has-permission="['menu:delete']" @click.native="deleteMenu">{{ $t('table.delete') }}</el-dropdown-item>
                <el-dropdown-item v-has-permission="['menu:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            ref="menuTree"
            :data="menuTree"
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
            <span>{{ menu.menuId === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form ref="form" :model="menu" :rules="rules" label-position="right" label-width="100px">
              <el-form-item :label="$t('table.menu.parentId')" prop="parentId">
                <el-tooltip class="item" effect="dark" :content="$t('tips.topId')" placement="top-start">
                  <el-input v-model="menu.parentId" readonly />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('table.menu.menuName')" prop="menuName">
                <el-input v-model="menu.menuName" :readonly="menu.menuId === '' ? false : 'readonly'" />
              </el-form-item>
              <el-form-item :label="$t('table.menu.type')" prop="type">
                <el-radio-group v-model="menu.type" :disabled="menu.menuId !== ''">
                  <el-radio label="0">{{ $t('common.menu.menu') }}</el-radio>
                  <el-radio label="1">{{ $t('common.menu.button') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" :label="$t('table.menu.icon')" prop="icon">
                <el-input v-model="menu.icon">
                  <el-button slot="append" icon="el-icon-brush" style="padding-left: 0;" @click="chooseIcons" />
                </el-input>
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" :label="$t('table.menu.path')" prop="path">
                <el-input v-model="menu.path" />
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" :label="$t('table.menu.component')" prop="component">
                <el-input v-model="menu.component" />
              </el-form-item>
              <el-form-item :label="$t('table.menu.perms')" prop="perms">
                <el-input v-model="menu.perms" />
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" :label="$t('table.menu.orderNum')" prop="orderNum">
                <el-input-number v-model="menu.orderNum" :min="0" :max="100" @change="handleNumChange" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" plain @click="submit">{{ menu.menuId === '' ? this.$t('common.add') : this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <Icons
      :dialog-visible="iconVisible"
      @close="iconVisible = false"
      @choose="chooseIcon"
    />
  </div>
</template>
<script>
import Icons from './Icons'

export default {
  name: 'MenuManage',
  components: { Icons },
  data() {
    return {
      iconVisible: false,
      selection: [],
      menuTree: [],
      menuName: '',
      menu: this.initMenu(),
      rules: {
        menuName: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 2, max: 10, message: this.$t('rules.range2to10'), trigger: 'blur' }
        ],
        path: { max: 100, message: this.$t('rules.noMoreThan100'), trigger: 'blur' },
        component: { max: 100, message: this.$t('rules.noMoreThan100'), trigger: 'blur' },
        perms: { max: 50, message: this.$t('rules.noMoreThan50'), trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.initMenuTree()
  },
  methods: {
    initMenuTree() {
      this.$get('system/menu').then((r) => {
        this.menuTree = r.data.data.rows
      })
    },
    initMenu() {
      return {
        menuId: '',
        menuName: '',
        parentId: 0,
        path: '',
        component: '',
        perms: '',
        type: '0',
        orderNum: 0,
        icon: ''
      }
    },
    exportExcel() {
      this.$download('system/menu/excel', {
        menuName: this.menuName
      }, `menu_${new Date().getTime()}.xlsx`)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(data, node, v) {
      this.menu = { ...data }
      this.menu.menuName = this.menu.label
      this.menu.menuId = this.menu.id
      this.$refs.form.clearValidate()
    },
    handleNumChange(val) {
      this.menu.orderNum = val
    },
    chooseIcons() {
      this.iconVisible = true
    },
    chooseIcon(icon) {
      this.menu.icon = icon
      this.iconVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.menu.createTime = this.menu.modifyTime = null
          if (this.menu.menuId) {
            this.$put('system/menu', { ...this.menu }).then(() => {
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.reset()
            })
          } else {
            this.$post('system/menu', { ...this.menu }).then(() => {
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
    reset() {
      this.initMenuTree()
      this.menuName = ''
      this.resetForm()
    },
    search() {
      this.$refs.menuTree.filter(this.menuName)
    },
    add() {
      this.resetForm()
      const checked = this.$refs.menuTree.getCheckedKeys()
      if (checked.length > 1) {
        this.$message({
          message: this.$t('tips.onlyChooseOne'),
          type: 'warning'
        })
      } else if (checked.length > 0) {
        this.menu.parentId = checked[0]
      } else {
        this.menu.parentId = 0
      }
    },
    deleteMenu() {
      const checked = this.$refs.menuTree.getCheckedKeys()
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
          this.menu.menuIds = checked.join(',')
          this.$delete(`system/menu/${this.menu.menuIds}`).then(() => {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.reset()
          })
        }).catch(() => {
          this.$refs.menuTree.setCheckedKeys([])
        })
      }
    },
    resetForm() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.menu = this.initMenu()
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu {
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
