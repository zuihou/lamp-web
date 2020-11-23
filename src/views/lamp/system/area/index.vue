<template>
  <div class="area">
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="app-container">
          <div class="filter-container">
            <el-input
              :placeholder="$t('table.area.label')"
              class="filter-item search-item"
              v-model="label"
            />
            <el-button
              @click="search"
              class="filter-item"
              plain
              type="primary"
            >{{ $t("table.search") }}
            </el-button
            >
            <el-button @click="reset" class="filter-item" plain type="warning" >
              {{ $t("table.reset") }}
            </el-button>
            <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['area:add']">
              {{ $t("table.add") }}
            </el-button>
            <el-dropdown
              class="filter-item"
              trigger="click"
              v-has-any-permission="[ 'area:delete', 'area:export']"
            >
              <el-button>
                {{ $t("table.more") }}
                <i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="deleteArea"
                  v-has-permission="['area:delete']"
                >{{ $t("table.delete") }}
                </el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            :check-strictly="true"
            :data="areaTree"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
            :load="loadTree"
            highlight-current
            node-key="id"
            ref="areaTree"
            :lazy="true"
            show-checkbox
          />
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>{{
              area.id === "" ? this.$t("common.add") : this.$t("common.edit")
            }}</span>
          </div>
          <div>
            <el-form
              :model="area"
              :rules="rules"
              label-position="right"
              label-width="100px"
              ref="form"
            >
              <el-form-item
                :hidden="true"
                :label="$t('table.area.parentId')"
                prop="parentId"
              >
                <el-tooltip
                  :content="$t('tips.topId')"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <el-input readonly v-model="area.parentId"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('table.area.parentId')"
                prop="parentLabel"
              >
                <el-input
                  readonly
                  disabled="disabled"
                  v-model="area.parentLabel"
                />
              </el-form-item>
              <el-form-item :label="$t('table.area.label')" prop="label">
                <el-input v-model="area.label"/>
              </el-form-item>
              <el-form-item :label="$t('table.area.code')" prop="code">
                <el-input v-model="area.code"/>
              </el-form-item>
              <el-form-item :label="$t('table.area.fullName')" prop="fullName">
                <el-input v-model="area.fullName"/>
              </el-form-item>
              <el-form-item
                :label="$t('table.area.longitude')"
                prop="longitude"
              >
                <el-input v-model="area.longitude"/>
              </el-form-item>
              <el-form-item :label="$t('table.area.latitude')" prop="latitude">
                <el-input v-model="area.latitude"/>
              </el-form-item>
              <el-form-item :label="$t('table.area.source')" prop="source">
                <el-input v-model="area.source"/>
              </el-form-item>
              <el-form-item :label="$t('table.area.level')" prop="level">
                <el-radio-group
                  border="true"
                  size="small"
                  v-model="area.level.key"
                >
                  <el-radio-button :key="index" :label="item" :value="key" v-for="(item, key, index) in dicts.AREA_LEVEL">
                    {{ item }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                :label="$t('table.area.sortValue')"
                prop="sortValue"
              >
                <el-input-number
                  :max="100"
                  :min="0"
                  @change="handleNumChange"
                  v-model="area.sortValue"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button @click="submit" plain type="primary">{{
                area.id === "" ? this.$t("common.add") : this.$t("common.edit")
                }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import areaApi from "@/api/Area.js";
  import { initDicts } from '@/utils/commons'

  export default {
    name: "AreaManager",
    data() {
      return {
        label: "",
        areaTree: [],
        dicts:{AREA_LEVEL:{}},
        area: this.initArea(),
        rules: {
          label: [
            {
              required: true,
              message: this.$t("rules.require"),
              trigger: "blur"
            },
            {
              min: 1,
              max: 255,
              message: this.$t("rules.range3to10"),
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              message: this.$t("rules.require"),
              trigger: "blur"
            },
            {
              min: 1,
              max: 255,
              message: this.$t("rules.range3to10"),
              trigger: "blur"
            },
            {
              validator: (rule, value, callback) => {
                areaApi.check(value, this.area.id).then(response => {
                  const res = response.data;
                  if (res.data) {
                    callback('编码重复');
                  } else {
                    callback();
                  }
                }).catch(() => callback())
              },
              trigger: "blur"
            }
          ]
        }
      };
    },
    mounted() {
      initDicts('AREA_LEVEL', this.dicts);
    },
    methods: {
      initArea() {
        return {
          id: "",
          code: "",
          label: "",
          parentId: 0,
          parentLabel: "",
          fullName: "",
          longitude: "",
          latitude: "",
          source: "",
          level: {
            key: "PROVINCE"
          },
          sortValue: 0
        };
      },
      initAreaTree(parentId = 0) {
        areaApi.linkage({parentId: parentId}).then(response => {
          const res = response.data;
          this.areaTree = res.data;
        });
      },
      loadTree(node, resolve) {
        areaApi.linkage({parentId: node.data.id}).then(response => {
          const res = response.data;
          resolve(res.data);
        });
      },
      handleNumChange(val) {
        this.area.sortValue = val;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      nodeClick(data) {
        this.area = {...data};

        const parent = this.$refs.areaTree.getNode(data.parentId);
        if (parent) {
          this.area.parentLabel = parent.label;
        }

        this.$refs.form.clearValidate();
      },
      add() {
        this.resetForm();
        const checked = this.$refs.areaTree.getCheckedNodes();
        if (checked.length > 1) {
          this.$message({
            message: this.$t("tips.onlyChooseOne"),
            type: "warning"
          });
        } else if (checked.length > 0) {
          this.area.parentId = checked[0].id;
          this.area.parentLabel = checked[0].label;
        } else {
          this.area.parentId = 0;
          this.area.parentLabel = "";
        }
      },
      deleteArea() {
        const checked = this.$refs.areaTree.getCheckedKeys();
        if (checked.length === 0) {
          this.$message({
            message: this.$t("tips.noNodeSelected"),
            type: "warning"
          });
        } else {
          this.$confirm(
            this.$t("tips.confirmDeleteNode"),
            this.$t("common.tips"),
            {
              confirmButtonText: this.$t("common.confirm"),
              cancelButtonText: this.$t("common.cancel"),
              type: "warning"
            }
          )
            .then(() => {
              areaApi.delete({ids: checked}).then(response => {
                const res = response.data;
                if (res.isSuccess) {
                  this.$message({
                    message: this.$t("tips.deleteSuccess"),
                    type: "success"
                  });
                }
                this.reset();
              });
            })
            .catch(() => {
              this.$refs.areaTree.setCheckedKeys([]);
            });
        }
      },
      search() {
        this.$refs.areaTree.filter(this.label);
      },
      reset() {
        this.initAreaTree();
        this.label = "";
        this.resetForm();
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.area.id) {
              this.update();
            } else {
              this.save();
            }
          } else {
            return false;
          }
        });
      },
      save() {
        areaApi.save({...this.area}).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.$message({
              message: this.$t("tips.createSuccess"),
              type: "success"
            });
          }

          this.reset();
        });
      },
      update() {
        areaApi.update({...this.area}).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success"
            });
          }
          this.reset();
        });
      },
      resetForm() {
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
        this.area = this.initArea();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .area {
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
