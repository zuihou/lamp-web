<template>
  <PageWrapper contentClass="flex" dense>
    <TypeTable class="md:w-1/3 xl:w-1/3" @select="handleTypeSelect" ref="typeRef" />
    <ItemTable class="md:w-2/3" ref="itemRef" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TypeTable from './type/index.vue';
  import ItemTable from './item/index.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '字典维护',
    components: { PageWrapper, TypeTable, ItemTable },
    setup() {
      const { t } = useI18n();
      const typeRef = ref<any>(null);
      const itemRef = ref<any>(null);

      // 获取字典条目表单
      function getItemRef() {
        return unref(itemRef);
      }

      // 选择字典事件
      function handleTypeSelect(dict: Recordable) {
        getItemRef().fetch(dict);
      }

      return {
        t,
        typeRef,
        itemRef,
        handleTypeSelect,
      };
    },
  });
</script>
