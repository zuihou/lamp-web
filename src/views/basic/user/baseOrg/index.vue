<template>
  <PageWrapper dense contentClass="flex">
    <BaseBlocksTree
      v-if="treeType === '2'"
      class="md:w-1/2"
      @select="handleTreeSelect"
      @add="handleTreeAdd"
      @edit="handleTreeEdit"
      ref="treeRef"
      @change="changeDisplay"
    />
    <BaseOrgTree
      v-else
      class="md:w-1/2"
      @select="handleTreeSelect"
      @add="handleTreeAdd"
      @edit="handleTreeEdit"
      ref="treeRef"
      @change="changeDisplay"
    />

    <Edit class="md:w-1/2" @success="handleEditSuccess" ref="editRef" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { ActionEnum } from '/@/enums/commonEnum';
  import BaseBlocksTree from './BlocksTree.vue';
  import BaseOrgTree from './Tree.vue';
  import Edit from './Edit.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '组织机构',
    components: { Edit, BaseOrgTree, BaseBlocksTree, PageWrapper },
    setup() {
      const editRef = ref<any>(null);
      const treeRef = ref<any>(null);
      const treeType = ref<string>('2');

      // 获取编辑表单
      function getEditRef() {
        return unref(editRef);
      }
      // 获取树
      function getTreeRef() {
        return unref(treeRef);
      }

      // 编辑成功回调
      function handleEditSuccess() {
        if (treeType.value === '1') {
          getTreeRef().fetch();
        } else {
          getTreeRef().fetch();
        }
      }

      // 选中树的节点
      function handleTreeSelect(parent = {}, record = {}) {
        getEditRef().setData({ type: ActionEnum.VIEW, parent, record });
      }

      // 编辑
      function handleTreeEdit(parent = {}, record = {}) {
        getEditRef().setData({ type: ActionEnum.EDIT, parent, record });
      }

      // 点击树的新增按钮
      function handleTreeAdd(parent = {}) {
        getEditRef().setData({ type: ActionEnum.ADD, parent });
      }

      function changeDisplay(type: string) {
        treeType.value = type;
      }

      return {
        editRef,
        treeRef,
        handleEditSuccess,
        handleTreeSelect,
        handleTreeAdd,
        handleTreeEdit,
        changeDisplay,
        treeType,
      };
    },
  });
</script>
