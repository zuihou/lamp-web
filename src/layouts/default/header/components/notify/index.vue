<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
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
              <NoticeList :value="item.data" :remindMode="item.key" @title-click="onNoticeClick" />
              <MsgWrapper @register="registerModal" />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, onMounted } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { TabItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { myNotice, mark } from '/@/api/basic/msg/extendNotice';
  import MsgWrapper from '/@/views/basic/msg/extendNotice/Wrapper.vue';
  import { ExtendNoticeResultVO } from '/@/api/basic/msg/model/extendNoticeModel';
  import { NoticeRemindModeEnum } from '/@/enums/biz/base';
  import { PageEnum } from '/@/enums/pageEnum';
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
      const { currentRoute } = useRouter();
      const listData = ref<TabItem[]>([]);
      const [registerModal, { openModal }] = useModal();

      const { t } = useI18n();
      async function loadMyMsg() {
        const allMsg = await myNotice({
          current: 1,
          size: 5,
          model: {},
        });

        listData.value = [];

        listData.value.push({
          key: NoticeRemindModeEnum.TO_DO,
          name: t('basic.msg.eMsg.todos'),
          data: allMsg?.todoList,
        });
        listData.value.push({
          key: NoticeRemindModeEnum.EARLY_WARNING,
          name: t('basic.msg.eMsg.warning'),
          data: allMsg?.earlyWarningList,
        });
        listData.value.push({
          key: NoticeRemindModeEnum.NOTICE,
          name: t('basic.msg.eMsg.reminder'),
          data: allMsg?.noticeList,
        });
      }

      onMounted(() => {
        loadMyMsg();
      });

      setInterval(() => {
        const { path } = currentRoute.value;
        if (path !== PageEnum.BASE_LOGIN) {
          loadMyMsg();
        }
      }, 5 * 60000);

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
            loadMyMsg();
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
