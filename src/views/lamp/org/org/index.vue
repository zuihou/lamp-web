<template>
  <div class="org">
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="app-container">
          <div class="filter-container">
            <el-input :placeholder="$t('table.org.label')" class="filter-item search-item" v-model="label"/>
            <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
            <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
            <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['authority:org:add']">{{
              $t("table.add") }}
            </el-button>
            <el-dropdown class="filter-item" trigger="click"
                         v-has-any-permission="['authority:org:delete','authority:org:export', 'authority:org:import']">
              <el-button>
                {{ $t('table.more') }}
                <i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="deleteOrg" v-has-permission="['authority:org:delete']">{{ $t('table.delete') }}
                </el-dropdown-item>
                <el-dropdown-item @click.native="exportExcel" v-has-permission="['authority:org:export']">
                  {{ $t("table.export") }}
                </el-dropdown-item>
                <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['authority:org:export']">
                  {{ $t("table.exportPreview") }}
                </el-dropdown-item>
                <el-dropdown-item @click.native="importExcel" v-has-permission="['authority:org:import']">
                  {{ $t("table.import") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree :check-strictly="true" :data="orgTree" :filter-node-method="filterNode" @node-click="nodeClick"
                   default-expand-all highlight-current node-key="id" ref="orgTree" show-checkbox/>
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>{{ org.id === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form :model="org" :rules="rules" label-position="right" label-width="100px" ref="form">
              <el-form-item :label="$t('table.org.parentId')" prop="parentId">
                <el-tooltip :content="$t('tips.topId')" class="item" effect="dark" placement="top-start">
                  <el-input readonly v-model="org.parentId"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('table.org.label')" prop="label">
                <el-input v-model="org.label"/>
              </el-form-item>
              <el-form-item :label="$t('table.org.abbreviation')" prop="abbreviation">
                <el-input v-model="org.abbreviation"/>
              </el-form-item>
              <el-form-item :label="$t('table.org.type')" prop="type">
                <el-radio-group v-model="org.type.key">
                  <el-radio-button :key="index" :label="item.code" :value="item.code" v-for="(item, key, index) in dicts.ORG_TYPE">{{item.name}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('table.org.describe')" prop="describe">
                <el-input v-model="org.describe"/>
              </el-form-item>
              <el-form-item :label="$t('table.org.state')" prop="state">
                <el-radio-group v-model="org.state">
                  <el-radio-button :label="true">{{ $t('common.state.valid') }}</el-radio-button>
                  <el-radio-button :label="false">{{ $t('common.state.invalid') }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('table.org.sortValue')" prop="sortValue">
                <el-input-number :max="100" :min="0" @change="handleNumChange" v-model="org.sortValue"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button @click="submit" plain type="primary">{{ org.id === '' ? this.$t('common.add') :
                this.$t('common.edit') }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

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
  import orgApi from '@/api/Org.js'
  import elDragDialog from '@/directive/el-drag-dialog'
  import FileImport from "@/components/lamp/Import"
  import { downloadFile, initDicts } from '@/utils/commons'

  export default {
    name: 'OrgManager',
    directives: {elDragDialog},
    components: {FileImport},
    data() {
      return {
        label: '',
        orgTree: [],
        org: this.initOrg(),
        preview: {
          isVisible: false,
          context: ''
        },
        fileImport: {
          isVisible: false,
          type: "import",
          action: `${process.env.VUE_APP_BASE_API}/authority/org/import`
        },
        rules: {
          label: [
            {required: true, message: this.$t('rules.require'), trigger: 'blur'},
            {min: 1, max: 255, message: this.$t('rules.range3to10'), trigger: 'blur'}
          ],
          type: [
            {required: true, message: this.$t('rules.require'), trigger: 'change'},
            {
              validator: (rule, value, callback) => {
                if (value.key === null || value.key.trim().length <= 0) {
                  callback(this.$t('rules.require'))
                } else {
                  callback()
                }
              }, trigger: 'change'
            }
          ]
        },
        dicts: {
          ORG_TYPE: [],
        }
      }
    },
    mounted() {
      this.initOrgTree()
      initDicts(['ORG_TYPE'], this.dicts)
    },
    methods: {
      initOrg() {
        return {
          id: '',
          abbreviation: '',
          label: '',
          type: {
            key: ''
          },
          parentId: 0,
          state: true,
          describe: '',
          sortValue: 0
        }
      },
      initOrgTree() {
        orgApi.allTree({})
          .then((response) => {
            const res = response.data
            this.orgTree = res.data
          })
      },
      exportExcelPreview() {
        const queryParams = {
          model: {},
          map: {
            fileName: '导出组织数据'
          },
          size: 10000
        };
        orgApi.preview(queryParams).then(response => {
          const res = response.data;
          this.preview.isVisible = true;
          this.preview.context = res.data;
        });
      },
      exportExcel() {
        const queryParams = {
          model: {},
          map: {
            fileName: '导出组织数据'
          },
          size: 10000
        };
        orgApi.export(queryParams).then(response => {
          downloadFile(response);
        });
      },
      importExcel() {
        this.fileImport.type = "upload";
        this.fileImport.isVisible = true;
        this.$refs.import.setModel(false);
      },
      importSuccess() {
        this.initOrgTree();
      },
      importClose() {
        this.fileImport.isVisible = false;
      },
      handleNumChange(val) {
        this.org.sortValue = val
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      nodeClick(data) {
        this.org = {...data}
        this.$refs.form.clearValidate()
      }
      ,
      add() {
        this.resetForm()
        const checked = this.$refs.orgTree.getCheckedKeys()
        if (checked.length > 1) {
          this.$message({
            message: this.$t('tips.onlyChooseOne'),
            type: 'warning'
          })
        } else if (checked.length > 0) {
          this.org.parentId = checked[0]
        } else {
          this.org.parentId = 0
        }
      },
      deleteOrg() {
        const checked = this.$refs.orgTree.getCheckedKeys()
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
            orgApi.delete({ids: checked})
              .then((response) => {
                const res = response.data
                if (res.isSuccess) {
                  this.$message({
                    message: this.$t('tips.deleteSuccess'),
                    type: 'success'
                  })
                }
                this.reset()
              })
          }).catch(() => {
            this.$refs.orgTree.setCheckedKeys([])
          })
        }
      }
      ,
      search() {
        this.$refs.orgTree.filter(this.label)
      }
      ,
      reset() {
        this.initOrgTree()
        this.label = ''
        this.resetForm()
      }
      ,
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.org.id) {
              this.update()
            } else {
              this.save()
            }
          } else {
            return false
          }
        })
      }
      ,
      save() {
        orgApi.save({...this.org})
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
      }
      ,
      update() {
        orgApi.update({...this.org})
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
      }
      ,
      resetForm() {
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
        this.org = this.initOrg()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .org {
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
