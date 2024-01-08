<template>
  <PageWrapper dense>
    <div class="overflow-hidden flex" ref="wrapEl">
      <RoleList class="md:w-1/3" @select="handleRoleSelect" ref="roleListRef" />
      <ApplicationDataScopeTabs
        v-show="roleCategory === RoleCategoryEnum.DATA_SCOPE"
        class="md:w-2/3"
        ref="applicationDataScopeRef"
      />
      <ApplicationResourceTabs
        v-show="
          roleCategory === RoleCategoryEnum.FUNCTION || roleCategory === RoleCategoryEnum.DESKTOP
        "
        class="md:w-2/3"
        ref="applicationResourceRef"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import RoleList from './roleList/index.vue';
  import ApplicationResourceTabs from './applicationResource/ApplicationTabs.vue';
  import ApplicationDataScopeTabs from './applicationDataScope/ApplicationTabs.vue';
  import { useLoading } from '/@/components/Loading';
  import { RoleCategoryEnum } from '/@/enums/biz/base';
  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '角色权限维护',
    components: { PageWrapper, RoleList, ApplicationResourceTabs, ApplicationDataScopeTabs },
    setup() {
      const { t } = useI18n();
      const wrapEl = ref<ElRef>(null);
      const roleListRef = ref<any>(null);
      const applicationResourceRef = ref<any>(null);
      const applicationDataScopeRef = ref<any>(null);
      const roleCategory = ref<string>(RoleCategoryEnum.FUNCTION);

      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEl,
        props: {
          tip: '加载中...',
          absolute: true,
        },
      });

      // 获取应用资源表单
      function getApplicationResourceRef() {
        return unref(applicationResourceRef);
      }
      // 获取应用数据权限表单
      function getApplicationDataScopeRef() {
        return unref(applicationDataScopeRef);
      }

      // 选择角色事件
      async function handleRoleSelect(role: Recordable) {
        try {
          openWrapLoading();
          roleCategory.value = role.category;
          if (role.category === RoleCategoryEnum.FUNCTION) {
            await getApplicationResourceRef().fetch(role);
          } else if (role.category === RoleCategoryEnum.DESKTOP) {
            // 临时处理，后续完善桌面权限的逻辑
            await getApplicationResourceRef().fetch(role);
          } else {
            await getApplicationDataScopeRef().fetch(role);
          }
        } finally {
          closeWrapLoading();
        }
      }

      return {
        t,
        wrapEl,
        roleListRef,
        applicationResourceRef,
        applicationDataScopeRef,
        handleRoleSelect,
        roleCategory,
        RoleCategoryEnum,
      };
    },
  });
</script>
