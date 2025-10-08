<template>
  <div :class="prefixCls">
    <Popover :overlayClassName="`${prefixCls}__overlay`" title="" trigger="click">
      <Badge :count="count" :numberStyle="numberStyle" dot>
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span style="color: #fb441b">({{ item.data.total }}) </span></template
              >
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :remindMode="item.key" :value="item.data" @title-click="onNoticeClick" />
              <MsgWrapper @register="registerModal" />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { Badge, Popover, Tabs } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { useWebSocket } from '@vueuse/core';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import MsgWrapper from '/@/views/basic/msg/extendNotice/Wrapper.vue';
  import { mark } from '/@/api/basic/msg/extendNotice';
  import { ExtendNoticeResultVO } from '/@/api/basic/msg/model/extendNoticeModel';
  import { NoticeRemindModeEnum } from '/@/enums/biz/base';
  import NoticeList from './NoticeList.vue';
  import { TabItem } from './data';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: {
      MsgWrapper,
      Popover,
      BellOutlined,
      Tabs,
      TabPane: Tabs.TabPane,
      Badge,
      NoticeList,
    },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      const [registerModal, { openModal }] = useModal();
      const listData = ref<TabItem[]>([]);
      const userStore = useUserStore();
      const { t } = useI18n();
      const employeeId = userStore.getUserInfo.employeeId;
      const tenantId = userStore.getTenantId;
      console.log('ws1');
      const host = window.location.host;
      const protocol = window.location.protocol;
      const state = reactive({
        server: `${
          protocol.includes('https') ? 'wss' : 'ws'
        }://${host}/api/wsMsg/anno/myMsg/${tenantId}/${employeeId}`,
        sendValue: '',
        recordList: [] as { id: number; time: number; res: string }[],
      });

      function onMessage(_: WebSocket, event: MessageEvent) {
        const jsonStr = event.data;
        if (!jsonStr) {
          return;
        }
        const jsonResult = JSON.parse(jsonStr);

        if (jsonResult?.type === '2') {
          listData.value = [];

          listData.value.push({
            key: NoticeRemindModeEnum.TO_DO,
            name: t('basic.msg.eMsg.todos'),
            data: jsonResult.data?.todoList,
          });
          listData.value.push({
            key: NoticeRemindModeEnum.NOTICE,
            name: t('basic.msg.eMsg.warning'),
            data: jsonResult.data?.noticeList,
          });
          listData.value.push({
            key: NoticeRemindModeEnum.EARLY_WARNING,
            name: t('basic.msg.eMsg.reminder'),
            data: jsonResult.data?.earlyWarningList,
          });
        } else {
          send('pull');
        }
      }

      const ws = useWebSocket(state.server, {
        autoReconnect: {
          retries: 3,
          delay: 10000,
          onFailed() {
            console.log('Failed to connect WebSocket after 3 retires');
          },
        },
        heartbeat: {
          message: 'ping',
          interval: 5000,
        },
        onMessage: onMessage,
      });

      let send = ws.send;

      onMounted(() => {
        send('pull');
      });

      const count = computed(() => {
        let num = 0;
        for (let i = 0; i < listData.value.length; i++) {
          num += Number(listData.value[i]?.data?.total ?? 0);
        }
        return num;
      });

      async function onNoticeClick(record: ExtendNoticeResultVO) {
        if (record.autoRead) {
          const flag = await mark([record.id]);
          if (flag) {
            send('pull');
          }
        }

        openModal(true, {
          id: record.id,
        });
      }

      return {
        prefixCls,
        registerModal,
        listData,
        count,
        onNoticeClick,
        numberStyle: {},
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-nav .ant-tabs-tab {
      margin: 0;
      padding: 10px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
