<template>
  <div class="org">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="12"
      >
        <div class="app-container">
          <div class="filter-container">
            <el-input
              v-model="name"
              :placeholder="$t(&quot;table.org.name&quot;)"
              class="filter-item search-item"
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
              v-has-any-permission="[&quot;org:add&quot;,&quot;org:delete&quot;,&quot;org:export&quot;]"
              trigger="click"
              class="filter-item"
            >
              <el-button>
                {{ $t('table.more') }}
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-has-permission="[&quot;org:add&quot;]"
                  @click.native="add"
                >
                  {{ $t('table.add') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-has-permission="[&quot;org:delete&quot;]"
                  @click.native="deleteOrg"
                >
                  {{ $t('table.delete') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-has-permission="[&quot;org:export&quot;]"
                  @click.native="exportExcel"
                >
                  {{ $t('table.export') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            ref="orgTree"
            :data="orgTree"
            :check-strictly="true"
            show-checkbox
            highlight-current
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
      >
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span>{{ org.id === '' ? this.$t('common.add') : this.$t('common.edit') }}</span>
          </div>
          <div>
            <el-form
              ref="form"
              :model="org"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-form-item
                :label="$t(&quot;table.org.parentId&quot;)"
                prop="parentId"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t(&quot;tips.topId&quot;)"
                  placement="top-start"
                >
                  <el-input
                    v-model="org.parentId"
                    readonly
                  />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.org.name&quot;)"
                prop="name"
              >
                <el-input
                  v-model="org.name"
                  :readonly="org.id === &quot;&quot; ? false : &quot;readonly&quot;"
                />
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.org.abbreviation&quot;)"
                prop="abbreviation"
              >
                <el-input v-model="org.abbreviation" />
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.org.describe&quot;)"
                prop="describe"
              >
                <el-input v-model="org.describe" />
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.org.status&quot;)"
                prop="status"
              >
                <el-radio-group v-model="org.status">
                  <el-radio :label="true">
                    {{ $t('common.status.valid') }}
                  </el-radio>
                  <el-radio :label="false">
                    {{ $t('common.status.invalid') }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t(&quot;table.org.sortValue&quot;)"
                prop="sortValue"
              >
                <el-input-number
                  v-model="org.sortValue"
                  :min="0"
                  :max="100"
                  @change="handleNumChange"
                />
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
                {{ org.id === '' ? this.$t('common.add') : this.$t('common.edit') }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import orgApi from '@/api/Org.js'
export default {
  name: 'OrgManager',
  data () {
    return {
      name: '',
      orgTree: [],
      org: this.initOrg(),
      rules: {
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 3, max: 10, message: this.$t('rules.range3to10'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initOrgTree()
  },
  methods: {
    initOrg () {
      return {
        id: '',
        abbreviation: '',
        name: '',
        parentId: 0,
        status: true,
        describe: '',
        sortValue: 0
      }
    },
    initOrgTree () {
      orgApi.allTree({})
        .then((r) => {
          this.orgTree = r.data
        })
    },
    exportExcel () {
      this.$message({
        message: '待完善',
        type: 'warning'
      })
      // this.$download('system/org/excel', {
      //   name: this.name
      // }, `org_${new Date().getTime()}.xlsx`)
    },
    handleNumChange (val) {
      this.org.sortValue = val
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick (data) {
      this.org = { ...data }
      this.$refs.form.clearValidate()
    },
    add () {
      this.resetForm()
      debugger
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
    deleteOrg () {
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
          orgApi.delete({ ids: checked }).then(() => {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.reset()
          })
        }).catch(() => {
          this.$refs.orgTree.setCheckedKeys([])
        })
      }
    },
    search () {
      this.$refs.orgTree.filter(this.name)
    },
    reset () {
      this.initOrgTree()
      this.name = ''
      this.resetForm()
    },
    submit () {
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
    },
    save () {
      orgApi.save({ ...this.org }).then(() => {
        this.$message({
          message: this.$t('tips.createSuccess'),
          type: 'success'
        })
        this.reset()
      })
    },
    update () {
      orgApi.update({ ...this.org }).then(() => {
        this.$message({
          message: this.$t('tips.updateSuccess'),
          type: 'success'
        })
        this.reset()
      })
    },
    resetForm () {
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
