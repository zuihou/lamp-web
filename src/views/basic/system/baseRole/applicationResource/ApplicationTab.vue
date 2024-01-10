<template>
  <CollapseContainer class="mb-4 appResource">
    <template #title>
      <Checkbox
        :value="application.id"
        @change="onCheckAllChange"
        :indeterminate="indeterminate"
        v-model:checked="checkAll"
      >
        <Tag color="error">应用</Tag>
        {{ application.name }}
      </Checkbox>
    </template>

    <BasicTree
      checkable
      checkStrictly
      :clickRowToExpand="false"
      :treeData="resourceList"
      :checkedKeys="checkedKeys"
      :expandedKeys="checkedKeys"
      ref="treeRef"
      @check="checkNode"
      @change="changeHandler"
      toolbar
      :toolbarStrictly="false"
      search
      highlight
    >
      <template #title="item">
        <TreeIcon :icon="item.icon" v-if="item.icon" />
        <template v-if="item.echoMap?.resourceType">
          <Tag :color="getResourceTagColor(item?.resourceType, item.isHidden)"
            >{{ item.echoMap?.resourceType }}
          </Tag>
        </template>
        {{ item.name }}
        <span>
          <a
            v-if="item.children && item.children.length"
            @click="selectAll(item.id, $event)"
            style="margin-left: 30px"
          >
            {{ isAllCheckedByKey(item.id) ? '取消全选' : '全选' }}
          </a>
        </span>
      </template>
    </BasicTree>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref, toRefs, reactive } from 'vue';
  import { Checkbox, Tag } from 'ant-design-vue';
  import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import { CollapseContainer } from '/@/components/Container/index';
  import { BasicTree, TreeActionType, TreeIcon, CheckKeys } from '/@/components/Tree';
  import { isArray } from '/@/utils/is';
  import { uniq, intersection, difference } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { eachTree, findChildrenByParentId, getById } from '/@/utils/helper/treeHelper';
  import { getResourceTagColor } from '/@/utils/color';

  export default defineComponent({
    name: 'ApplicationResourceTab',
    components: {
      BasicTree,
      Checkbox,
      CollapseContainer,
      TreeIcon,
      Tag,
    },
    props: {
      application: {
        type: Object as PropType<Recordable>,
        default: () => {
          return {};
        },
      },
      resourceList: {
        type: Array as PropType<TreeDataItem[]>,
        default: () => {
          return [] as TreeDataItem[];
        },
      },
      checkedKeys: {
        type: Array as PropType<CheckKeys>,
        default: () => [],
      },
    },
    setup(props) {
      const { t } = useI18n();
      const treeRef = ref<Nullable<TreeActionType>>(null);
      // 表单数据
      const formData = reactive<Recordable>({});

      // 临时数据
      const state = reactive({
        indeterminate: false,
        checkAll: false,
        allKeys: [] as string[],
      });

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      onMounted(async () => {
        const keys = [] as string[];

        eachTree(
          props.resourceList,
          (item, parent) => {
            keys.push(item.id);
            item.key = item.id;
            item.title = item.name;
            item.keyLinks = [...(parent.keyLinks || []), item.id];
            item.slots = { title: 'title' };
            return item;
          },
          {},
        );

        state.allKeys = keys;
      });

      function changeHandler(_) {
        computedIndeterminate();
        computedCheckAll();
      }

      // 获取 树当前选中的节点key
      function getCheckedKeys(): string[] {
        const checkedKeys = getTree().getCheckedKeys();
        return (isArray(checkedKeys) ? checkedKeys : checkedKeys.checked) as string[];
      }

      // 计算 半选状态
      function computedIndeterminate() {
        const checkedKeys = getCheckedKeys();
        state.indeterminate = checkedKeys.length > 0 && checkedKeys.length < state.allKeys.length;
      }

      // 计算 选中状态
      function computedCheckAll() {
        state.checkAll =
          state.allKeys.length > 0 && state.allKeys.length === getCheckedKeys().length;
      }

      /**
       * 全选应用
       * @param e
       */
      function onCheckAllChange(e: any) {
        e?.stopPropagation();
        e?.preventDefault();
        getTree()?.checkAll(e.target.checked);

        computedIndeterminate();
      }

      /**
       * 选中tree的复选框
       * 1. 选中某个节点: 将其所有的父节点都选中
       * 2. 取消某个节点: 将其所有子节点全部取消
       *
       * @param checkedKeys 已选中的key
       * @param checked 选中还是取消
       * @param node 当前节点
       */
      function checkNode(_, { checked, node }) {
        // 当前已经勾选的所有id
        // const checkeds = isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
        if (checked) {
          // 选中

          // 查找当前节点
          const current = getById(node?.eventKey, props.resourceList);
          // 查找当前节点的所有父Id

          // 同时勾选上所有的父节点
          const newKeys = getCheckedKeys().concat(current?.keyLinks);
          getTree().setCheckedKeys(uniq(newKeys));
        } else {
          // 取消选中

          // 查找当前节点的所有子节点
          const childrenIds = findChildrenByParentId(node?.eventKey, props.resourceList);
          // 设置新的选中节点为： 当前已经选中节点 - 当前节点的子节点
          const newKeys = difference(getCheckedKeys(), childrenIds);
          getTree().setCheckedKeys(uniq(newKeys));
        }
      }

      /**
       * 全选或取消全选
       *
       * 全选逻辑：将所有子节点和父节点选中
       *
       * 取消全选逻辑：将所有子节点取消
       *
       * @param id 节点id
       * @param e 事件
       */
      function selectAll(id: string, e: any) {
        e?.stopPropagation();
        e?.preventDefault();

        // 查找当前节点的所有子节点id
        const childrenIds = findChildrenByParentId(id, props.resourceList);
        if (containsAll(childrenIds)) {
          // 取消全选

          // 将已经选中的节点 - 当前节点的所有子节点
          const newKeys = difference(getCheckedKeys(), childrenIds);
          getTree().setCheckedKeys(newKeys);
        } else {
          // 全选

          const newKeys = getCheckedKeys().concat(childrenIds);

          // 查找当前节点
          const current = getById(id, props.resourceList);
          // 查找当前节点的所有父Id
          const parentAndChildrenIds = newKeys.concat(current?.keyLinks);

          getTree().setCheckedKeys(uniq(parentAndChildrenIds));
        }

        computedCheckAll();
        computedIndeterminate();
      }

      /**
       * 某个节点是 全选 还是 全部取消
       * @param id
       */
      function isAllCheckedByKey(id: string) {
        const childrenIds = findChildrenByParentId(id, props.resourceList);
        return containsAll(childrenIds);
      }

      /**
       * 指定的 节点id 是否全部被选中
       * @param ids
       */
      function containsAll(ids: string[]) {
        if (!ids || !ids.length) {
          return false;
        }
        return intersection(getCheckedKeys(), ids).length == ids.length;
      }

      return {
        ...toRefs(state),
        t,
        formData,
        onCheckAllChange,
        treeRef,
        checkNode,
        selectAll,
        isAllCheckedByKey,
        changeHandler,
        getResourceTagColor,
      };
    },
  });
</script>
<style lang="less" scoped>
  .appResource {
    border: 1px solid #d9d9d9;
  }
</style>
