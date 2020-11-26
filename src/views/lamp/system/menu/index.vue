<template>
  <div class="menu">
    <el-row :gutter="10">
      <el-col :sm="6" :xs="24">
        <div class="app-container">
          <div class="filter-container">
            <el-input :placeholder="$t('table.menu.label')" @keyup.enter.native="search" class="filter-item search-item"
                      clearable v-model="label"/>
            <el-tooltip class="item" content="新增/删除时，请先勾选菜单" effect="dark" placement="right">
              <el-dropdown class="filter-item" trigger="click"
                           v-has-any-permission="['authority:menu:add','authority:menu:delete','authority:menu:export']">
                <el-button>
                  {{ $t('table.more') }}
                  <i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="add" v-has-permission="['authority:menu:add']">
                    {{ $t('table.add') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="deleteMenu" v-has-permission="['authority:menu:delete']">
                    {{ $t('table.delete') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>
          </div>
          <commonTree :tree-data="menuTree" @nodeClick="nodeClick" ref="menuTree">
            <template slot-scope="treeNode">
              <span class="tree-icon">
<!--                <i :class="treeNode.data.icon ? treeNode.data.icon : 'el-icon-document'"/>-->
                <e-icon :icon-name="treeNode.data.icon ? treeNode.data.icon : 'el-icon-document'" class="sub-el-icon"/>
              </span>
              <span class="tree-icon">
                <el-badge :type="treeNode.data.state ? 'success' :'danger'" class="status-item" is-dot/>
              </span>
            </template>
          </commonTree>
        </div>
      </el-col>
      <el-col :sm="8" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>{{ menu.id === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form :model="menu" :rules="rules" label-position="right" label-width="80px" ref="form">
              <el-form-item :label="$t('table.menu.parentId')" prop="parentId">
                <el-tooltip :content="$t('tips.topId')" class="item" effect="dark" placement="right">
                  <el-input readonly v-model="menu.parentId"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('table.menu.label')" prop="label">
                <el-input v-model="menu.label"/>
              </el-form-item>
              <el-form-item :label="$t('table.menu.path')" prop="path">
                <el-input @keyup.native="menuPath" v-model="menu.path"/>
              </el-form-item>
              <el-form-item :label="$t('table.menu.component')" prop="component">
                <el-input v-model="menu.component"/>
                <span>{{ menuComponent }}</span>
              </el-form-item>
              <el-form-item :label="$t('table.menu.icon')" prop="icon">
<!--                <el-input v-model="menu.icon">-->
<!--                  <el-button @click="chooseIcons" icon="el-icon-brush" slot="append" style="padding-left: 0;"/>-->
<!--                </el-input>-->
                <e-icon-picker v-model="menu.icon"/>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('table.state')" prop="state">
                    <el-switch :active-text="$t('common.state.valid')" :inactive-text="$t('common.state.invalid')"
                               v-model="menu.state"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('table.menu.isGeneral')" prop="isGeneral">
                    <el-switch :active-text="$t('common.yes')" :inactive-text="$t('common.no')"
                               v-model="menu.isGeneral"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$t('table.menu.sortValue')" prop="sortValue">
                <el-input-number :max="100" :min="0" @change="handleNumChange" v-model="menu.sortValue"/>
              </el-form-item>
              <el-form-item :label="$t('table.menu.group')" prop="group">
                <el-tooltip class="item" content="用于区分多组菜单" effect="dark" placement="right">
                  <el-input v-model="menu.group"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('table.menu.describe')" prop="describe">
                <el-input v-model="menu.describe"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button @click="submit" plain type="primary">{{ menu.id === '' ? this.$t('common.add') :
                this.$t('common.edit') }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :sm="10" :xs="24">
        <el-card class="box-card">
          <div class="app-container">
            <div class="filter-container">
              <el-input :placeholder="$t('table.resource.code')" class="filter-item search-item" clearable
                        v-model="resourceQueryParams.model.code"/>
              <el-input :placeholder="$t('table.resource.name')" class="filter-item search-item" clearable
                        v-model="resourceQueryParams.model.name"/>
              <el-button @click="resourceSearch" class="filter-item" plain type="primary">{{ $t('table.search') }}
              </el-button>
              <el-dropdown class="filter-item" trigger="click"
                           v-has-any-permission="['authority:resource:add','authority:resource:delete']">
                <el-button>
                  {{ $t('table.more') }}
                  <i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="!menu.id" @click.native="resourceAdd"
                                    v-has-permission="['authority:resource:add']">{{ $t('table.add') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="resourceBatchDelete" v-has-permission="['authority:resource:delete']">{{
                    $t('table.delete') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <el-table
              :data="resourceTableData.records"
              :key="resourceTableKey"
              @selection-change="onResourceSelectChange"
              @sort-change="resourceSortChange"
              @filter-change="resourceFilterChange"
              border
              fit
              ref="resourceTable"
              style="width: 100%;"
              v-loading="resourceLoading"
            >
              <el-table-column align="center" type="selection" width="40px"/>
              <el-table-column :label="$t('table.resource.code')" :show-overflow-tooltip="true" align="center"
                               prop="code">
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.resource.name')" :show-overflow-tooltip="true" align="center"
                               prop="name">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.operation')" align="center" class-name="small-padding fixed-width"
                               width="100px">
                <template slot-scope="{row}">
                  <i @click="resourceEdit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;"
                     v-hasPermission="['authority:resource:edit']"/>
                  <i @click="resourceSingleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;"
                     v-hasPermission="['authority:resource:delete']"/>
                  <el-link class="no-perm" v-has-no-permission="['authority:resource:edit','authority:resource:delete']">{{
                    $t('tips.noPermission') }}
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :limit.sync="resourceQueryParams.size"
              :page.sync="resourceQueryParams.current"
              :total="Number(resourceTableData.total)"
              @pagination="resourceFetch"
              v-show="resourceTableData.total>0"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <Icons :dialog-visible="iconVisible" @choose="chooseIcon" @close="iconVisible = false"/>
    <resource-edit :dialog-visible="dialog.isVisible" :type="dialog.type" @close="resourceEditClose"
                   @success="resourceEditSuccess" ref="resourceEdit"/>
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
  import commonTree from '@/components/lamp/CommonTree.vue'
  import Icons from './icons'
  import ResourceEdit from './edit'
  import Pagination from '@/components/Pagination'
  import elDragDialog from '@/directive/el-drag-dialog'
  import menuApi from '@/api/Menu.js'
  import resourceApi from '@/api/Resource.js'
  import { initQueryParams} from '@/utils/commons'

  export default {
    name: 'MenuManage',
    directives: {elDragDialog},
    components: {Icons, commonTree, Pagination, ResourceEdit},
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
        iconVisible: false,
        menuTree: [],
        label: '',
        menu: this.initMenu(),
        resourceQueryParams: initQueryParams({
          model:{
            menuId: null
          }
        }),
        resourceTableKey: 0,
        resourceLoading: false,
        resourceSelection: [],
        resourceTableData: {
          total: 0
        },
        rules: {
          label: [
            {required: true, message: this.$t('rules.require'), trigger: 'blur'},
            {min: 1, max: 255, message: this.$t('rules.range2to10'), trigger: 'blur'}
          ],
          path: [{max: 255, message: this.$t('rules.noMoreThan100'), trigger: 'blur'},
            {required: true, message: this.$t('rules.require'), trigger: 'blur'},
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
      menuComponent() {
        let comp = ''
        if (this.menu.path && this.menu.path !== '/') {
          const isUrl = this.isUrl(this.menu.path)
          if (isUrl) {
            comp = `跳转地址：${this.menu.path}`
          } else {
            comp = `组件路径：src/views/${this.menu.component}.vue`
          }
        } else {
          comp = `组件路径：src/views/lamp/index.vue`
        }
        return comp
      }
    },
    watch: {
      'menu.path': function () {
        this.computedComponent()
      }
    },
    mounted() {
      this.initMenuTree()
    },
    methods: {
      isUrl(path) {
        const urls = ['http://', '/http://', 'https://', '/https://', 'www.', '/www.']
        const urlIndex = urls.findIndex(item => {
          return path.startsWith(item)
        })
        return urlIndex >= 0
      },
      menuPath() {
        const isUrl = this.isUrl(this.menu.path)
        if (!isUrl && !this.menu.path.startsWith('/')) {
          this.menu.path = '/' + this.menu.path
        } else if (isUrl) {
          if (this.menu.path.startsWith('/')) {
            this.menu.path = this.menu.path.substr(1)
          }
        }
      },
      computedComponent() {
        const isUrl = this.isUrl(this.menu.path)
        if (isUrl) {
          this.menu.component = 'Layout'
        } else if(this.menu.id === ""){
          if (this.menu.path) {
            this.menu.component = `lamp${this.menu.path}/index`
          } else {
            this.menu.component = `lamp/index`
          }
        }
      },
      initMenuTree() {
        menuApi.allTree().then((response) => {
          const res = response.data
          this.menuTree = res.data
        })
      },
      initMenu() {
        return {
          id: '',
          label: '',
          describe: '',
          code: '',
          isGeneral: false,
          path: '',
          component: '',
          state: true,
          sortValue: '',
          parentId: 0,
          icon: '',
          group: ''
        }
      },
      nodeClick(data) {
        this.menu = {...data}
        this.$refs.form.clearValidate()

        this.resourceQueryParams.model.menuId = data.id
        this.resourceSearch()
      },
      handleNumChange(val) {
        this.menu.sortValue = val
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
      save() {
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
      update() {
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
      reset() {
        this.initMenuTree()
        this.label = ''
        this.resetForm()
      },
      search() {
        this.$refs.menuTree.$refs.treeRef.filter(this.label)
      },
      add() {
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
        this.resourceQueryParams.model.menuId = null
        this.resourceReset()
      },
      deleteMenu() {
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
            menuApi.delete({ids: checked})
              .then((response) => {
                const res = response.data
                if (res.isSuccess) {
                  this.$message({
                    message: this.$t('tips.deleteSuccess'),
                    type: 'success'
                  })
                }
                this.reset()
                this.resourceQueryParams.model.menuId = null
                this.resourceReset()
              })
          }).catch(() => {
            this.$refs.menuTree.$refs.treeRef.setCheckedKeys([])
          })
        }
      },
      resetForm() {
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
        this.menu = this.initMenu()
      },
      resourceAdd() {
        this.dialog.type = 'add'
        this.dialog.isVisible = true
        this.$refs.resourceEdit.setResource({
          menuId: this.menu.id
        })
      },
      resourceEdit(row) {
        this.dialog.type = 'edit'
        this.dialog.isVisible = true
        row.menuId = this.menu.id
        this.$refs.resourceEdit.setResource(row)
      },
      resourceSingleDelete(row) {
        this.$refs.resourceTable.clearSelection()
        this.$refs.resourceTable.toggleRowSelection(row, true)
        this.resourceBatchDelete()
      },
      resourceBatchDelete() {
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
          resourceApi.delete({ids: ids}).then((response) => {
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
      resourceReset() {
        this.resourceQueryParams = initQueryParams({
          model:{
            menuId: this.resourceQueryParams.menuId
          }
        });
        this.$refs.resourceTable.clearSort()
        this.$refs.resourceTable.clearFilter()
        this.resourceSearch()
      },
      resourceSearch() {
        this.resourceFetch({
          ...this.resourceQueryParams
        })
      },
      resourceFetch(params = {}) {
        if (this.resourceQueryParams.timeRange) {
          this.resourceQueryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.resourceQueryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }

        this.resourceQueryParams.current = params.current ? params.current : this.resourceQueryParams.current;
        this.resourceQueryParams.size = params.size ? params.size : this.resourceQueryParams.size;

        if (this.resourceQueryParams.model.menuId) {
          this.resourceLoading = true
          resourceApi.page(this.resourceQueryParams)
            .then((response) => {
              const res = response.data
              if (res.isSuccess) {
                this.resourceTableData = res.data
              }
            })
            .finally(() => this.resourceLoading = false);
        } else {
          this.resourceTableData = {}
        }

      },
      resourceSortChange(val) {
        this.resourceQueryParams.sort = val.prop;
        this.resourceQueryParams.order = val.order;
        if (this.resourceQueryParams.sort) {
          this.resourceSearch();
        }
      },
      resourceFilterChange(filters) {
        for (const key in filters) {
          if (key.includes('.')) {
            const val = {};
            val[key.split('.')[1]] = filters[key][0];
            this.resourceQueryParams.model[key.split('.')[0]] = val;
          } else {
            this.resourceQueryParams.model[key] = filters[key][0]
          }
        }
        this.resourceSearch()
      },
      onResourceSelectChange(selection) {
        this.resourceSelection = selection
      },
      resourceEditClose() {
        this.dialog.isVisible = false
      },
      resourceEditSuccess() {
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
