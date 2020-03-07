<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="isVisible"
    :width="width"
    top="50px"
  >
    <el-form
      :model="roleAuthority"
      :rules="rules"
      label-position="top"
      label-width="100px"
      ref="form"
    >
      <el-scrollbar style="height:800px">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card class="box-card">
              <el-form-item label="菜单" prop="menuIdList">
                <div align="left" style="margin-left:24px;">
                  <el-checkbox
                    :indeterminate="isIndeterminate"
                    @change="checkedAll"
                    v-model="checkedMenu"
                  />
                  全选/反选
                </div>
                <el-tree
                  :check-strictly="true"
                  :data="menuTree"
                  :default-checked-keys="roleAuthority.menuIdList"
                  :default-expanded-keys="roleAuthority.menuIdList"
                  :disabled="disabled"
                  :expand-on-click-node="false"
                  @check="checkMenu"
                  @node-click="nodeClick"
                  default-expand-all
                  highlight-current
                  node-key="id"
                  ref="menuTree"
                  show-checkbox
                />
              </el-form-item>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card">
              <el-form-item label="资源" prop="resourceIdList">
                <el-table
                  :data="tableData.records"
                  :key="tableKey"
                  @select="onSelect"
                  @select-all="onAllSelect"
                  border
                  fit
                  ref="table"
                  row-key="id"
                  style="width: 100%;"
                  v-loading="loading"
                >
                  <el-table-column
                    :reserve-selection="true"
                    align="center"
                    type="selection"
                    width="40px"
                  />
                  <el-table-column
                    :label="$t('table.resource.code')"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="code"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.code }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('table.resource.name')"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="name"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>
      </el-scrollbar>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{
        $t("common.cancel")
        }}
      </el-button>
      <el-button
        :disabled="disabled"
        @click="submitForm"
        plain
        type="primary"
      >{{ $t("common.confirm") }}
      </el-button
      >
    </div>
  </el-dialog>
</template>
<script>
  import roleApi from "@/api/Role.js";
  import menuApi from "@/api/Menu.js";
  import resourceApi from "@/api/Resource.js";

  export default {
    name: "RoleAuthorityEdit",
    components: {},
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        roleAuthority: this.initRoleAuthority(),
        screenWidth: 0,
        width: this.initWidth(),
        menuTree: [],
        resourceList: [],
        //回显的数据
        echoResourceIdList: [],
        rules: {},
        tableKey: 0,
        loading: false,
        tableData: {
          total: 0
        },
        selection: [],
        disabled: false,
        isIndeterminate: false,
        checkedMenu: false
      };
    },
    computed: {
      isVisible: {
        get() {
          return this.dialogVisible;
        },
        set() {
          this.close();
          this.reset();
        }
      },
      title() {
        return "配置菜单资源";
      }
    },
    watch: {},
    mounted() {
      this.initMenuTree();
      window.onresize = () => {
        return (() => {
          this.width = this.initWidth();
        })();
      };
    },
    methods: {
      allMenuIdList() {
        const menuIdList = [];
        this.getMenuIdList(this.menuTree, menuIdList);
        return menuIdList;
      },
      getMenuIdList(menuList, menuIdList) {
        if (menuList) {
          menuList.forEach(item => {
            menuIdList.push(item.id);
            if (item.children && item.children.length > 0) {
              this.getMenuIdList(item.children, menuIdList);
            }
          });
        }
      },
      checkedAll() {
        if (this.checkedMenu) {
          //全选
          this.$refs.menuTree.setCheckedKeys(this.allMenuIdList());
          this.isIndeterminate = false;
        } else {
          //取消选中
          this.$refs.menuTree.setCheckedKeys([]);
          this.isIndeterminate = false;
        }
      },
      nodeClick(data) {
        const vm = this;
        vm.loading = true;

        resourceApi
          .page({
            current: 1, size: 10000,
            model: {menuId: data.id}
          })
          .then(response => {
            const res = response.data;
            vm.tableData = res.data;
            vm.loading = false;
            vm.displayTable();
          });
      },
      displayTable() {
        const vm = this;
        vm.tableData.records.forEach(item => {
          vm.roleAuthority.resourceIdList.forEach(resourceId => {
            if (item.id === resourceId) {
              vm.$refs.table.toggleRowSelection(item, true);
            }
          });
        });
      },
      onAllSelect(selection) {
        this.onSelect(selection);
      },
      onSelect(selection, row) {
        this.mergeResourceIdList(selection, row);
        //this.roleAuthority.resourceIdList = selection.map(item => item.id);
        this.selection = selection;

        // 根据右侧选中的资源，强制勾选左侧的 树状层级菜单
        const old = this.$refs.menuTree.getCheckedKeys();
        const must = selection.map(item => item.menuId);
        const newSelected = Array.from(new Set([...old, ...must]));
        this.$refs.menuTree.setCheckedKeys(newSelected);
        newSelected.forEach(item => {
          this.selectedParent(item);
        });
      },
      mergeResourceIdList(selection, row) {
        // true就是选中，0或者false是取消选中
        let selected = true;
        if (row) {
          selected = selection.length && selection.indexOf(row) !== -1;
        } else {
          selected = selection.length > 0;
        }

        //本次选中的
        const curResourceIdList = selection.map(item => item.id);

        const ridList = this.echoResourceIdList;
        if (!selected && row) {
          var index = ridList.findIndex(item => {
            if (item == row.id) {
              return true;
            }
          });
          ridList.splice(index, 1);
        }

        // 本次选中的 + 回显的 然后去重
        this.roleAuthority.resourceIdList = [
          ...new Set([...curResourceIdList, ...ridList])
        ];
      },

      initMenuTree() {
        menuApi.allTree().then(response => {
          const res = response.data;
          this.menuTree = res.data;
        });
      },
      initRoleAuthority() {
        return {
          roleId: "",
          menuIdList: [],
          resourceIdList: []
        };
      },
      initWidth() {
        this.screenWidth = document.body.clientWidth;
        if (this.screenWidth < 991) {
          return "90%";
        } else if (this.screenWidth < 1400) {
          return "45%";
        } else {
          return "1000px";
        }
      },
      setRoleAuthority(val) {
        const vm = this;
        vm.roleAuthority.roleId = val.id;
        // vm.disabled = val.readonly
        // 回显
        roleApi.findAuthorityIdByRoleId(val.id).then(response => {
          const res = response.data;
          vm.roleAuthority.menuIdList = res.data.menuIdList;
          vm.roleAuthority.resourceIdList = res.data.resourceIdList;
          vm.echoResourceIdList = res.data.resourceIdList;
          vm.$refs.menuTree.setCheckedKeys(res.data.menuIdList);
          res.data.menuIdList.forEach(item => {
            vm.selectedParent(item);
          });
        });
      },
      close() {
        this.$emit("close");
      },
      reset() {
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
        this.roleAuthority = this.initRoleAuthority();
        this.$refs.menuTree.setCheckedKeys([]);
        this.$refs.table.clearSelection();
      },
      submitForm() {
        const vm = this;
        this.$refs.form.validate(valid => {
          if (valid) {
            vm.editSubmit();
          } else {
            return false;
          }
        });
      },
      editSubmit() {
        const vm = this;

        this.roleAuthority.menuIdList = vm.$refs.menuTree
          .getHalfCheckedKeys()
          .concat(vm.$refs.menuTree.getCheckedKeys());

        //勾选时， 实时计算出来
        //this.roleAuthority.resourceIdList = vm.selection.map(item => item.id);

        roleApi.saveRoleAuthority(this.roleAuthority).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            vm.isVisible = false;
            vm.$message({
              message: vm.$t("tips.createSuccess"),
              type: "success"
            });
            vm.$emit("success");
          }
        });
      },
      checkMenu(data, node) {
        if (node.checkedKeys.length === 0) {
          //取消
          this.checkedMenu = false;
          this.isIndeterminate = false;
        } else if (node.checkedKeys.length === this.allMenuIdList().length) {
          //全选
          this.checkedMenu = true;
          this.isIndeterminate = false;
        } else {
          // 中立
          this.checkedMenu = false;
          this.isIndeterminate = true;
        }

        // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
        let selected = node.checkedKeys.indexOf(data.id); // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          this.selectedParent(data);
          // 统一处理子节点为相同的勾选状态
          this.uniteChildSame(data, true);
        } else {
          // 未选中 处理子节点全部未选中
          if (data.children && data.children.length !== 0) {
            this.uniteChildSame(data, false);
          }
        }
      },
      // 统一处理子节点为相同的勾选状态
      uniteChildSame(data, isSelected) {
        this.$refs.menuTree.setChecked(data.id, isSelected);
        if (data.children) {
          for (let i = 0; i < data.children.length; i++) {
            this.uniteChildSame(data.children[i], isSelected);
          }
        }
      },
      // 统一处理父节点为选中
      selectedParent(data) {
        let currentNode = this.$refs.menuTree.getNode(data);
        if (currentNode.parent.key !== undefined) {
          this.$refs.menuTree.setChecked(currentNode.parent, true);
          this.selectedParent(currentNode.parent);
        }
      }
    }
  };
</script>
<style lang="scss" scoped></style>
