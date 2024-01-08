<template>
  <CollapseContainer :canExpan="false" title="登录日志">
    <a-timeline mode="left">
      <a-timeline-item v-for="(item, index) of loginLogList" :key="index">
        <Card :title="'登录时间：' + item.createdTime">
          <p>
            <Icon icon="ant-design:link-outlined" />
            {{ t('devOperation.system.defLoginLog.requestIp') }}：{{ item.requestIp }}
          </p>
          <p>
            <Icon icon="ant-design:environment-outlined" />
            {{ t('devOperation.system.defLoginLog.location') }}：{{ item.location }}
          </p>
          <p>
            <Icon icon="ant-design:chrome-filled" />
            {{ t('devOperation.system.defLoginLog.browser') }}：{{ item.browser }}
          </p>
          <p>
            <Icon icon="ant-design:windows-outlined" />
            {{ t('devOperation.system.defLoginLog.operatingSystem') }}：{{ item.operatingSystem }}
          </p>
        </Card>
      </a-timeline-item>
    </a-timeline>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Card, Timeline } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { anyonePage } from '/@/api/basic/system/baseLoginLog';

  export default defineComponent({
    name: 'MyLoginLog',
    components: {
      CollapseContainer,
      [Timeline.name]: Timeline,
      [Timeline.Item.name]: Timeline.Item,
      Card,
      Icon,
    },
    setup() {
      const loginLogList = ref<any[]>([]);
      const userStore = useUserStore();
      const { t } = useI18n();
      onMounted(async () => {
        const list = await anyonePage({
          current: 1,
          size: 10,
          model: { userId: userStore.getUserInfo.id },
        });
        loginLogList.value = list.records;
      });

      return {
        loginLogList,
        t,
      };
    },
  });
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
  }
</style>
