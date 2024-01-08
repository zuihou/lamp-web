<template>
  <BasicModal
    :keyboard="true"
    :maskClosable="false"
    :title="t(`common.title.move`)"
    v-bind="$attrs"
    @ok="handleSubmit(false)"
    @register="registerModal"
  >
    <template #centerFooter>
      <a-button @click="moveToRoot"> 移动到根节点</a-button>
    </template>
    <BasicTree
      ref="treeRef"
      :clickRowToExpand="false"
      :loading="treeLoading"
      :title="titleRef"
      :treeData="treeData"
      checkStrictly
      highlight
      search
      toolbar
      @select="handleSelect"
    >
      <template #titleBefore="item">
        <template v-if="item.echoMap?.resourceType">
          <Tag :color="getResourceTagColor(item?.resourceType)">
            {{ item.echoMap?.resourceType }}
          </Tag>
        </template>
      </template>
    </BasicTree>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { move, tree } from '/@/api/devOperation/application/defResource';
  import { getResourceTagColor } from '/@/utils/color';
  import { eachTree } from '/@/utils/helper/treeHelper';

  export default defineComponent({
    name: 'ResourceMove',
    components: { BasicModal, BasicTree, Tag },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const titleRef = ref<string>('');
      const current = ref<any>({});
      const treeData = ref<TreeItem[]>([]);
      const treeLoading = ref<boolean>(false);

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('树结构加载失败,请刷新页面');
        }
        return tree;
      }

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        titleRef.value = '';
        getTree().setSelectedKeys([]);

        current.value = data?.current;
        titleRef.value = `${t(`common.title.move`)}：【${data?.current.name}】`;
        treeData.value = (await tree({
          applicationId: data.applicationId,
        })) as unknown as TreeItem[];

        eachTree(
          treeData.value,
          (item, parent) => {
            item.key = item.id;

            item.keyLinks = [...(parent.keyLinks || []), item.id];
            item.disabled =
              item.id === unref(current).parentId ||
              item.id === unref(current).id ||
              item.treePath.includes('/' + unref(current).id + '/');
            if (item.id === unref(current).parentId) {
              item.title = item.name + '(不能移动到他的父节点)';
            } else if (item.id === unref(current).id) {
              item.title = item.name + '(不能移动到他自己下)';
            } else if (item.treePath.includes('/' + unref(current).id + '/')) {
              item.title = item.name + '(不能移动到他的子孙节点)';
            } else {
              item.title = item.name;
            }

            item.slots = { titleBefore: 'titleBefore' };
            return item;
          },
          {},
        );
        setTimeout(() => {
          getTree().filterByLevel(2);
        }, 0);
      });

      async function handleSubmit(isMoveRoot = false) {
        try {
          setModalProps({ confirmLoading: true });
          const id = unref(current).id;
          if (!id) {
            createMessage.error('请选择需要移动的节点');
            return;
          }
          let title = `确定要将【${unref(current).name}】移动到【根节点】`;
          const keys = getTree().getSelectedKeys();
          let parentId = keys?.[0] as string;

          if (!isMoveRoot) {
            let node = {} as TreeItem;
            if (keys != null) {
              node = getTree().getSelectedNode(keys[0]) as TreeItem;
            }
            title = `确定要将【${unref(current).name}】移动到【${node ? node?.name : '根节点'}】`;
          } else {
            parentId = '';
          }

          createConfirm({
            iconType: 'warning',
            content: title,
            onOk: async () => {
              try {
                await move(unref(current).id, parentId);
                createMessage.success('移动成功');
                closeModal();
                emit('success');
              } catch (e) {}
            },
          });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      function moveToRoot() {
        handleSubmit(true);
      }

      function handleSelect(keys: string[]) {
        console.log(keys);
      }

      return {
        t,
        registerModal,
        treeRef,
        treeData,
        treeLoading,
        getResourceTagColor,
        handleSelect,
        handleSubmit,
        moveToRoot,
        titleRef,
      };
    },
  });
</script>
