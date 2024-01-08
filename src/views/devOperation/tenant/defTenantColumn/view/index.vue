<template>
  <PageWrapper title="企业信息详情" contentBackground>
    <template #footer>
      <a-tabs
        default-active-key="1"
        @change="
          (key) => {
            formState.showTab = key;
          }
        "
      >
        <a-tab-pane key="1" tab="企业信息" />
        <a-tab-pane key="2" tab="企业的应用" />
        <a-tab-pane key="3" tab="企业的员工" />
      </a-tabs>
    </template>
    <TenantView v-if="formState.showTab === '1'" />
    <TenantApplicationList v-if="formState.showTab === '2'" />
    <TenantUserList v-if="formState.showTab === '3'" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TenantView from './TenantView.vue';
  import TenantUserList from './TenantUserList.vue';
  import TenantApplicationList from './TenantApplicationList.vue';

  export default defineComponent({
    name: '查看企业信息',
    components: {
      PageWrapper,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
      TenantApplicationList,
      TenantUserList,
      TenantView,
    },
    emits: ['success', 'register'],
    setup(_) {
      const { t } = useI18n();

      const formState = reactive({
        showTab: '1',
      });

      return { t, formState };
    },
  });
</script>
