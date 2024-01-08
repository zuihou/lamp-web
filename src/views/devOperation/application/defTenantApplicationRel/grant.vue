<template>
  <PageWrapper dense contentClass="flex" class="mb-10">
    <TenantList class="md:w-1/4" ref="tenantListRef" />
    <ApplicationTabs class="md:w-3/4" ref="applicationTabsRef" />
    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit" class="ml-4">
        {{ t('common.saveText') }}
      </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import TenantList from './grant/TenantList.vue';
  import ApplicationTabs from './grant/ApplicationTabs.vue';
  import { grant } from '/@/api/devOperation/application/defTenantApplicationRel';
  import { RouteEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    name: '应用授权',
    components: {
      PageWrapper,
      TenantList,
      ApplicationTabs,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const { replace } = useRouter();
      const { closeCurrent } = useTabs();

      const tenantListRef = ref<any>(null);
      const applicationTabsRef = ref<any>(null);
      function getTenantList() {
        const tree = unref(tenantListRef);
        if (!tree) {
          throw new Error('tenant list is null!');
        }
        return tree;
      }
      function getApplicationTabs() {
        const tree = unref(applicationTabsRef);
        if (!tree) {
          throw new Error('application tabs is null!');
        }
        return tree;
      }

      async function handleSubmit() {
        try {
          const tenantIdList = getTenantList().checkedKeys;
          const data = getApplicationTabs().getData();
          data['tenantIdList'] = tenantIdList;

          await grant(data);
          await closeCurrent();
          replace({
            name: RouteEnum.APPLICATION_GRANT_MANAGE,
          });
          createMessage.success('授权成功');
        } finally {
        }
      }

      return { t, handleSubmit, tenantListRef, applicationTabsRef };
    },
  });
</script>
