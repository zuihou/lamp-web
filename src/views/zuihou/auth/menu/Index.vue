<template>
  <div class="menu">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="6"
      >
        <div class="app-container">
          <div class="filter-container">
            <el-input
              v-model="name"
              :placeholder="$t(&quot;table.menu.name&quot;)"
              class="filter-item search-item"
              clearable
              @keyup.enter.native="search"
            />
            <!-- <el-button
              class='filter-item'
              type='primary'
              plain
              @click='search'
            >{{ $t('table.search') }}</el-button>-->
            <!-- <el-button
              class='filter-item'
              type='warning'
              plain
              @click='reset'
            >{{ $t('table.reset') }}</el-button>-->
            <el-tooltip
              class="item"
              effect="dark"
              content="新增/删除时，请先勾选菜单"
              placement="right"
            >
              <el-dropdown
                v-has-any-permission="[&quot;menu:add&quot;,&quot;menu:delete&quot;,&quot;menu:export&quot;]"
                trigger="click"
                class="filter-item"
              >
                <el-button>
                  {{ $t('table.more') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-has-permission="[&quot;menu:add&quot;]"
                    @click.native="add"
                  >
                    {{ $t('table.add') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-has-permission="[&quot;menu:delete&quot;]"
                    @click.native="deleteMenu"
                  >
                    {{ $t('table.delete') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-has-permission="[&quot;menu:export&quot;]"
                    @click.native="exportExcel"
                  >
                    {{ $t('table.export') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>
          </div>
          <commonTree
            ref="menuTree"
            :tree-data="menuTree"
            @nodeClick="nodeClick"
          >
            <template scope="treeNode">
              <span class="tree-icon">
                <i :class="treeNode.data.icon ? treeNode.data.icon : &quot;el-icon-document&quot;" />
              </span>
              <span class="tree-icon">
                <el-badge
                  is-dot
                  class="status-item"
                  :type="treeNode.data.isEnable ? &quot;success&quot; :&quot;danger&quot;"
                />
              </span>
            </template>
          </commonTree>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="8"
      >
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span>{{ menu.id === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form
              ref="form"
              :model="menu"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-form-item
                :label="$t(&quot;table.menu.parentId&quot;)"
                prop="parentId"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t(&quot;tips.topId&quot;)"
                  placement="right"
                >
                  <el-input
                    v-model="menu.parentId"
                    readonly
                  />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.menu.name&quot;)"
                prop="name"
              >
                <el-input v-model="menu.name" />
              </el-form-item>
              <!-- <el-form-item :label='$t("table.menu.type")' prop='type'>
                <el-radio-group v-model='menu.type'>
                  <el-radio label='DIR'>目录</el-radio>
                  <el-radio label='MENU'>菜单</el-radio>
                </el-radio-group>
              </el-form-item>-->
              <el-form-item
                :label="$t(&quot;table.menu.path&quot;)"
                prop="path"
              >
                <el-input
                  v-model="menu.path"
                  @keyup.native="menuPath"
                />
                <span>{{ menuComponent }}</span>
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.menu.icon&quot;)"
                prop="icon"
              >
                <el-input v-model="menu.icon">
                  <el-button
                    slot="append"
                    icon="el-icon-brush"
                    style="padding-left: 0;"
                    @click="chooseIcons"
                  />
                </el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :label="$t(&quot;table.status&quot;)"
                    prop="isEnable"
                  >
                    <el-switch
                      v-model="menu.isEnable"
                      :active-text="$t(&quot;common.status.valid&quot;)"
                      :inactive-text="$t(&quot;common.status.invalid&quot;)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t(&quot;table.menu.isPublic&quot;)"
                    prop="isPublic"
                  >
                    <el-switch
                      v-model="menu.isPublic"
                      :active-text="$t(&quot;common.yes&quot;)"
                      :inactive-text="$t(&quot;common.no&quot;)"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                :label="$t(&quot;table.menu.sortValue&quot;)"
                prop="sortValue"
              >
                <el-input-number
                  v-model="menu.sortValue"
                  :min="0"
                  :max="100"
                  @change="handleNumChange"
                />
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.menu.group&quot;)"
                prop="group"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="用于区分多组菜单"
                  placement="right"
                >
                  <el-input v-model="menu.group" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.menu.describe&quot;)"
                prop="describe"
              >
                <el-input v-model="menu.describe" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card
          class="box-card"
          style="margin-top: -2rem;"
        >
          <el-row>
            <el-col
              :span="24"
              style="text-align: right"
            >
              <el-button
                type="primary"
                plain
                @click="submit"
              >
                {{ menu.id === '' ? this.$t('common.add') : this.$t('common.edit') }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="10"
      >
        <el-card class="box-card">
          <div class="app-container">
            <div class="filter-container">
              <el-input
                v-model="resourceQueryParams.code"
                :placeholder="$t(&quot;table.resource.code&quot;)"
                class="filter-item search-item"
              />
              <el-input
                v-model="resourceQueryParams.name"
                :placeholder="$t(&quot;table.resource.name&quot;)"
                class="filter-item search-item"
              />
              <el-button
                class="filter-item"
                type="primary"
                plain
                @click="resourceSearch"
              >
                {{ $t('table.search') }}
              </el-button>
              <el-dropdown
                v-has-any-permission="[&quot;resource:add&quot;,&quot;resource:delete&quot;]"
                trigger="click"
                class="filter-item"
              >
                <el-button>
                  {{ $t('table.more') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-has-permission="[&quot;resource:add&quot;]"
                    :disabled="!menu.id"
                    @click.native="resourceAdd"
                  >
                    {{ $t('table.add') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-has-permission="[&quot;resource:delete&quot;]"
                    @click.native="resourceBatchDelete"
                  >
                    {{ $t('table.delete') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <el-table
              ref="resourceTable"
              :key="resourceTableKey"
              v-loading="resourceLoading"
              :data="resourceTableData.records"
              border
              fit
              style="width: 100%;"
              @selection-change="onResourceSelectChange"
              @sort-change="resourceSortChange"
            >
              <el-table-column
                type="selection"
                align="center"
                width="40px"
              />
              <el-table-column
                :label="$t(&quot;table.resource.code&quot;)"
                prop="code"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t(&quot;table.resource.name&quot;)"
                prop="name"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
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
                    v-hasPermission="[&quot;resource:update&quot;]"
                    class="el-icon-edit table-operation"
                    style="color: #2db7f5;"
                    @click="resourceEdit(row)"
                  />
                  <i
                    v-hasPermission="[&quot;resource:delete&quot;]"
                    class="el-icon-delete table-operation"
                    style="color: #f50;"
                    @click="resourceSingleDelete(row)"
                  />
                  <el-link
                    v-has-no-permission="[&quot;resource:update&quot;,&quot;resource:delete&quot;]"
                    class="no-perm"
                  >
                    {{ $t('tips.noPermission') }}
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="resourceTableData.total>0"
              :total="Number(resourceTableData.total)"
              :page.sync="resourcePagination.current"
              :limit.sync="resourcePagination.size"
              @pagination="resourceFetch"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <Icons
      :dialog-visible="iconVisible"
      @close="iconVisible = false"
      @choose="chooseIcon"
    />
    <resource-edit
      ref="resourceEdit"
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @success="resourceEditSuccess"
      @close="resourceEditClose"
    />
  </div>
</template>
<script>
import commonTree from '@/components/zuihou/CommonTree.vue'
import Icons from './Icons'
import ResourceEdit from './Edit'
import Pagination from '@/components/Pagination'
import menuApi from '@/api/Menu.js'
import resourceApi from '@/api/Resource.js'

export default {
  name: 'MenuManage',
  components: { Icons, commonTree, Pagination, ResourceEdit },
  data () {
    return {
      dialog: {
        isVisible: false,
        type: 'add'
      },
      iconVisible: false,
      menuTree: [],
      name: '',
      menu: this.initMenu(),
      resourceQueryParams: {
        menuId: null
      },
      resourceTableKey: 0,
      resourceSort: {},
      resourceLoading: false,
      resourceSelection: [],
      resourceTableData: {
        total: 0
      },
      resourcePagination: {
        size: 10,
        current: 1
      },
      rules: {
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('rules.range2to10'), trigger: 'blur' }
        ],
        path: [{ max: 255, message: this.$t('rules.noMoreThan100'), trigger: 'blur' },
        { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            const isUrl = this.isUrl(this.menu.path)

            if (value === '/' || (!isUrl && value.endsWith('/'))) {
              callback('请填写有效的路由地址')
            } else {
              callback()
            }
          }, trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    menuComponent () {
      let comp = ''
      if (this.menu.path && this.menu.path !== '/') {
        const isUrl = this.isUrl(this.menu.path)
        if (isUrl) {
          comp = `跳转地址：${this.menu.path}`
        } else {
          comp = `前端组件：zuihou${this.menu.path}/Index.vue`
        }
      } else {
        comp = `前端组件：zuihou/Index.vue`
      }
      return comp
    }
  },
  watch: {
    'menu.path': function () {
      this.computedComponent()
    }
  },
  mounted () {
    this.initMenuTree()
  },
  methods: {
    isUrl (path) {
      const urls = ['http://', '/http://', 'https://', '/https://', 'www.', '/www.']
      const urlIndex = urls.findIndex(item => {
        return path.startsWith(item)
      })
      return urlIndex >= 0
    },
    menuPath () {
      const isUrl = this.isUrl(this.menu.path)
      if (!isUrl && !this.menu.path.startsWith('/')) {
        this.menu.path = '/' + this.menu.path
      } else if (isUrl) {
        if (this.menu.path.startsWith('/')) {
          this.menu.path = this.menu.path.substr(1)
        }
      }
    },
    computedComponent () {
      const isUrl = this.isUrl(this.menu.path)
      if (isUrl) {
        this.menu.component = 'Layout'
      } else {
        if (this.menu.path) {
          this.menu.component = `zuihou${this.menu.path}/Index`
        } else {
          this.menu.component = `zuihou/Index`
        }
      }
    },
    initMenuTree () {
      menuApi.allTree().then((response) => {
        const res = response.data
        this.menuTree = res.data
      })
    },
    initMenu () {
      return {
        id: '',
        name: '',
        describe: '',
        code: '',
        isPublic: false,
        path: '',
        component: '',
        isEnable: true,
        sortValue: '',
        parentId: 0,
        icon: '',
        group: ''
      }
    },
    exportExcel () {
      this.$message({
        message: '带完善',
        type: 'success'
      })
    },
    nodeClick (data) {
      this.menu = { ...data }
      this.menu.name = this.menu.label
      this.$refs.form.clearValidate()

      this.resourceQueryParams.menuId = data.id
      this.resourceSearch()
    },
    handleNumChange (val) {
      this.menu.sortValue = val
    },
    chooseIcons () {
      this.iconVisible = true
    },
    chooseIcon (icon) {
      this.menu.icon = icon
      this.iconVisible = false
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.menu.createTime = this.menu.updateTime = null
          if (this.menu.id) {
            this.update()
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    save () {
      console.log(this.menu.component)
      menuApi.save(this.menu)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.$message({
              message: this.$t('tips.createSuccess'),
              type: 'success'
            })
          }
          this.reset()
        })

    },
    update () {
      console.log(this.menu)
      menuApi.update(this.menu)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
          }
          this.reset()
        })
    },
    reset () {
      this.initMenuTree()
      this.name = ''
      this.resetForm()
    },
    search () {
      this.$refs.menuTree.$refs.treeRef.filter(this.name)
    },
    add () {
      this.resetForm()
      const checked = this.$refs.menuTree.$refs.treeRef.getCheckedKeys()
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
      this.resourceQueryParams.menuId = null
      this.resourceReset()
    },
    deleteMenu () {
      const checked = this.$refs.menuTree.$refs.treeRef.getCheckedKeys()
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
          menuApi.delete({ ids: checked })
            .then((response) => {
              const res = response.data
              if (res.isSuccess) {
                this.$message({
                  message: this.$t('tips.deleteSuccess'),
                  type: 'success'
                })
              }
              this.reset()
              this.resourceQueryParams.menuId = null
              this.resourceReset()
            })
        }).catch(() => {
          this.$refs.menuTree.$refs.treeRef.setCheckedKeys([])
        })
      }
    },
    resetForm () {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.menu = this.initMenu()
    },
    resourceAdd () {
      this.dialog.type = 'add'
      this.dialog.isVisible = true
      this.$refs.resourceEdit.setResource({
        menuId: this.menu.id
      })
    },
    resourceEdit (row) {
      this.dialog.type = 'edit'
      this.dialog.isVisible = true
      row.menuId = this.menu.id
      this.$refs.resourceEdit.setResource(row)
    },
    resourceSingleDelete (row) {
      this.$refs.resourceTable.toggleRowSelection(row, true)
      this.resourceBatchDelete()
    },
    resourceBatchDelete () {
      if (!this.resourceSelection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmDeleteNode'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const ids = this.resourceSelection.map((item) => item.id)
        resourceApi.delete({ ids: ids }).then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
          }
          this.resourceReset()
        })
      })

    },
    resourceReset () {
      this.resourceQueryParams = {
        menuId: this.resourceQueryParams.menuId
      }
      this.resourceSort = {}
      this.$refs.resourceTable.clearSort()
      this.$refs.resourceTable.clearFilter()
      this.resourceSearch()
    },
    resourceSearch () {
      this.resourceFetch({
        ...this.resourceQueryParams,
        ...this.resourceSort
      })
    },
    resourceFetch (params = {}) {
      params.size = this.resourcePagination.size
      params.current = this.resourcePagination.current

      params = { ...this.resourceQueryParams, ...params }
      if (params.menuId) {
        this.resourceLoading = true
        resourceApi.findPage(params)
          .then((response) => {
            const res = response.data
            this.resourceTableData = res.data
            this.resourceLoading = false
          })
      } else {
        this.resourceTableData = {}
      }

    },
    resourceSortChange (val) {
      this.resourceSort.field = val.prop
      this.resourceSort.order = val.order
      this.resourceSearch()
    },
    onResourceSelectChange (selection) {
      this.resourceSelection = selection
    },
    resourceEditClose () {
      this.dialog.isVisible = false
    },
    resourceEditSuccess () {
      this.resourceSearch()
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
