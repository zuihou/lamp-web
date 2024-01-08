<template>
  <PageWrapper>
    <div class="w-full enter-y">
      <ApplicationCard
        title="我的应用"
        :api="findMyApplication"
        class="enter-y"
        :updateDef="true"
      />

      <ApplicationCard
        title="推荐应用"
        :handleClick="handleClick"
        description="您真棒，所有应用均已开通。"
        :api="findRecommendApplication"
        class="enter-y !my-4"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ApplicationCard from '/@/views/lamp/home/components/ApplicationCard.vue';
  import { PageWrapper } from '/@/components/Page';
  import { findMyApplication, findRecommendApplication } from '/@/api/lamp/profile/userInfo';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: '我的应用',
    components: { PageWrapper, ApplicationCard },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();

      function handleClick() {
        createMessage.warn('快联系公司管理员开通我吧~');
      }

      return {
        t,
        handleClick,
        findMyApplication,
        findRecommendApplication,
      };
    },
  });
</script>
