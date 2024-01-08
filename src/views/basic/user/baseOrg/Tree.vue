<template>
  <div class="bg-white m-4 mr-2 overflow-hidden">
    <div v-if="query" class="m-4">
      <a-button class="mr-2" type="primary" @click="handleReset()">重置</a-button>
      <Checkbox v-model:checked="recursion" @change="handleQuery()">本级及子级</Checkbox>
    </div>
    <div v-else class="m-4">
      <a-button
        v-hasAnyPermission="[RoleEnum.ORG_SWITCH]"
        class="mr-2"
        type="primary"
        @click="changeDisplay()"
      >
        切换
      </a-button>
      <a-button
        v-hasAnyPermission="[RoleEnum.ORG_ADD]"
        class="mr-2"
        preIcon="ant-design:plus-outlined"
        @click="handleAdd()"
      >
        {{ t('common.title.addRoot') }}
      </a-button>
      <a-button
        v-hasAnyPermission="[RoleEnum.ORG_DELETE]"
        class="mr-2"
        preIcon="ant-design:delete-outlined"
        @click="handleBatchDelete()"
      >
        {{ t('common.title.delete') }}
      </a-button>
    </div>
    <BasicTree
      ref="treeRef"
      :actionList="actionList"
      :beforeRightClick="getRightMenuList"
      :checkable="!query"
      :clickRowToExpand="false"
      :title="t('basic.user.baseOrg.table.title')"
      :treeData="treeData"
      checkStrictly
      search
      toolbar
      @select="handleSelect"
    >
      <template #titleBefore="item">
        <template v-if="item.echoMap?.type">
          <Tag :color="item.type === OrgTypeEnum.COMPANY ? 'error' : 'processing'">
            {{ item.echoMap?.type }}
          </Tag>
        </template>
      </template>
    </BasicTree>
    <OrgRole @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, onMounted, ref, unref } from 'vue';
  import { Checkbox, Tag } from 'ant-design-vue'; // antd组件
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    BasicTree,
    ContextMenuItem,
    TreeActionItem,
    TreeActionType,
    TreeItem,
  } from '/@/components/Tree';
  import { eachTree, findChildrenByParentId, findNodeByKey } from '/@/utils/helper/treeHelper';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { OrgTypeEnum } from '/@/enums/biz/base';

  import { remove, tree } from '/@/api/basic/user/baseOrg';
  import { useModal } from '/@/components/Modal';
  import OrgRole from './orgRole/index.vue';

  export default defineComponent({
    name: 'BaseOrgManagement',
    components: { BasicTree, OrgRole, Checkbox, Tag },
    props: {
      query: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['select', 'add', 'edit', 'change', 'reset'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<TreeItem[]>([]);
      const recursion = ref<boolean>(false);
      // 绑定角色
      const [registerModal, { openModal }] = useModal();

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('树结构加载失败,请刷新页面');
        }
        return tree;
      }

      onMounted(() => {
        fetch();
      });

      // 加载数据
      async function fetch() {
        treeData.value = (await tree()) as unknown as TreeItem[];
        eachTree(treeData.value, (item) => {
          item.key = item.id;
          item.title = item.name;
          item.slots = { titleBefore: 'titleBefore' };
          return item;
        });
        setTimeout(() => {
          getTree().filterByLevel(2);
        }, 0);
      }

      // 选择节点
      function handleSelect(keys: string[]) {
        if (keys[0]) {
          const node = findNodeByKey(keys[0], treeData.value);
          const parent = findNodeByKey(node?.parentId, treeData.value);
          let childrenIds: string[] = [];
          if (recursion.value) {
            childrenIds = findChildrenByParentId(keys[0], treeData.value);
          } else {
            childrenIds = [node.id];
          }
          emit('select', parent, node, childrenIds);
        }
      }

      let actionList: TreeActionItem[] = [];
      let getRightMenuList = (_: any): ContextMenuItem[] => {
        return [];
      };
      if (!props.query) {
        // 悬停图标
        actionList = [
          {
            auth: RoleEnum.ORG_ADD,
            render: (node) => {
              return h(
                'a',
                {
                  class: 'ml-2',
                  onClick: (e: Event) => {
                    e?.stopPropagation();
                    e?.preventDefault();
                    emit('add', findNodeByKey(node.id, treeData.value));
                  },
                },
                t('common.title.add'),
              );
            },
          },
          {
            auth: RoleEnum.ORG_EDIT,
            render: (node) => {
              return h(
                'a',
                {
                  class: 'ml-2',
                  onClick: (e: Event) => {
                    e?.stopPropagation();
                    e?.preventDefault();
                    const current = findNodeByKey(node?.id, treeData.value);
                    const parent = findNodeByKey(node?.parentId, treeData.value);
                    emit('edit', parent, current);
                  },
                },
                t('common.title.edit'),
              );
            },
          },
          {
            auth: RoleEnum.ORG_BIND_ROLE,
            render: (node) => {
              return h(
                'a',
                {
                  class: 'ml-2',
                  onClick: (e: Event) => {
                    e?.stopPropagation();
                    e?.preventDefault();
                    const current = findNodeByKey(node?.id, treeData.value);
                    openModal(true, current);
                  },
                },
                '绑定',
              );
            },
          },
          {
            auth: RoleEnum.ORG_DELETE,
            render: (node) => {
              return h(
                'a',
                {
                  class: 'ml-2',
                  onClick: (e: Event) => {
                    e?.stopPropagation();
                    e?.preventDefault();
                    batchDelete([node.id]);
                  },
                },
                t('common.title.delete'),
              );
            },
          },
        ];

        // 右键菜单
        getRightMenuList = (node: any): ContextMenuItem[] => {
          return [
            {
              label: t('common.title.addChildren'),
              auth: [RoleEnum.ORG_ADD],
              handler: () => {
                emit('add', findNodeByKey(unref(node).id, treeData.value));
              },
              icon: 'ant-design:plus-outlined',
            },
            {
              label: t('common.title.edit'),
              auth: [RoleEnum.ORG_EDIT],
              handler: () => {
                const current = findNodeByKey(unref(node)?.id, treeData.value);
                const parent = findNodeByKey(unref(node)?.parentId, treeData.value);
                emit('edit', parent, current);
              },
              icon: 'ant-design:edit-outlined',
            },
            {
              label: t('common.title.delete'),
              auth: [RoleEnum.ORG_DELETE],
              handler: () => {
                batchDelete([unref(node).id]);
              },
              icon: 'ant-design:delete-outlined',
            },
          ];
        };
      }

      // 执行批量删除
      async function batchDelete(ids: string[]) {
        createConfirm({
          iconType: 'warning',
          content: '选中节点及其子结点将被永久删除, 是否确定删除？',
          onOk: async () => {
            try {
              await remove(ids);
              createMessage.success(t('common.tips.deleteSuccess'));
              fetch();
            } catch (e) {}
          },
        });
      }

      // 点击树外面的 新增
      function handleAdd() {
        emit('add', findNodeByKey('0', treeData.value));
      }

      // 点击树外面的 批量删除
      function handleBatchDelete() {
        const { checked } = getTree().getCheckedKeys() as {
          checked: string[];
          halfChecked: string[];
        };
        if (!checked || checked.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        batchDelete(checked);
      }

      // 切换显示方式
      function changeDisplay() {
        emit('change', '2');
      }

      // 重置
      function handleReset() {
        getTree().setSelectedKeys([]);
        emit('reset');
      }

      // 选择 本级及子级
      function handleQuery() {
        handleSelect(getTree().getSelectedKeys() as string[]);
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        fetch();
      }

      return {
        t,
        treeRef,
        treeData,
        fetch,
        handleAdd,
        handleBatchDelete,
        getRightMenuList,
        actionList,
        handleSelect,
        changeDisplay,
        handleReset,
        handleQuery,
        RoleEnum,
        registerModal,
        handleSuccess,
        recursion,
        OrgTypeEnum,
      };
    },
  });
</script>
