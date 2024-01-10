<template>
  <Card :loading="loading" :title="props.title" hoverable v-bind="$attrs">
    <template #extra><a href="javascript:void(0);" @click="handleMore">详情</a></template>
    <template v-for="item in applicationList" :key="item.id">
      <CardGrid :class="getAppCardClass(item)" class="!md:w-1/3 !w-full" @click="customClick(item)">
        <span class="flex" style="right: 0; position: relative">
          <ThumbUrl
            :fileId="item.echoMap?.[FileBizTypeEnum.DEF_APPLICATION_LOGO]?.[0]?.id"
            :fileType="item.echoMap?.[FileBizTypeEnum.DEF_APPLICATION_LOGO]?.[0]?.fileType"
            :height="50"
            :isDef="true"
            :originalFileName="
              item.echoMap?.[FileBizTypeEnum.DEF_APPLICATION_LOGO]?.[0]?.originalFileName
            "
            :preview="false"
            :width="50"
          />
          <span class="text-lg ml-4">{{ item.name }}</span>
          <a
            v-if="props.updateDef && defApplicationId !== item.id"
            class="text-lg"
            href="javascript:void(0);"
            style="right: 0; position: absolute"
            @click="handleUpdateDefApp(item, $event)"
          >
            设为默认
          </a>
        </span>
        <div :title="item.remark" class="flex mt-2 mb-2 h-10 text-secondary">
          {{ item.introduce }}
        </div>
        <div class="flex justify-between text-secondary">
          <span>
            <Tag
              :color="
                item.state === ExpireStateEnum.EFFECTIVE
                  ? 'success'
                  : item.state === ExpireStateEnum.EXPIRED
                  ? 'error'
                  : 'processing'
              "
            >
              {{
                item.state === ExpireStateEnum.EFFECTIVE
                  ? '正常使用'
                  : item.state === ExpireStateEnum.EXPIRED
                  ? '已过期'
                  : '申请开通'
              }}
            </Tag>
          </span>
          <span v-if="item.state === ExpireStateEnum.EXPIRED">{{ item.expirationTime }}</span>
        </div>
      </CardGrid>
    </template>
    <Empty v-if="applicationList.length === 0" :description="props.description" />
  </Card>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { Card, CardGrid, Empty, Tag } from 'ant-design-vue';
  import { useLoading } from '/@/components/Loading';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import ThumbUrl from '/@/components/Upload/src/ThumbUrl.vue';
  import { DefApplicationResultVO } from '/@/api/devOperation/application/model/defApplicationModel';
  import { ExpireStateEnum } from '/@/enums/biz/tenant';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isUrl } from '/@/utils/is';
  import { router } from '/@/router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { FileBizTypeEnum } from '/@/enums/commonEnum';
  import { PageEnum } from '/@/enums/pageEnum';
  import { propTypes } from '/@/utils/propTypes';
  import { getDefApp, updateDefApp } from '/@/api/lamp/profile/userInfo';
  import { checkEmployeeHaveApplication } from '/@/api/lamp/common/oauth';

  export default defineComponent({
    components: { Card, CardGrid, Empty, ThumbUrl, Tag },
    props: {
      // 应用标题
      title: propTypes.string.def('我的应用'),
      // 是否可以修改默认应用
      updateDef: propTypes.bool.def(false),
      // 应用描述
      description: propTypes.string.def('暂未开通任何应用, 联系您公司管理员开通'),
      // 查询我的应用的接口
      api: {
        type: Function as PropType<PromiseFn>,
        default: null,
        required: true,
      },
      // 点击应用后的回调
      handleClick: {
        type: Function as PropType<() => void>,
        default: null,
      },
    },
    emits: ['more'],
    setup: function (props, { emit }) {
      const { createMessage, createConfirm } = useMessage();
      const { refreshMenu } = usePermission();
      const { replace } = useRouter();
      const { t } = useI18n();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('common.loadingText'),
      });

      const applicationList = ref<DefApplicationResultVO[]>([]);
      const defApplicationId = ref<string>('');
      const loading = ref<boolean>(true);
      const userStore = useUserStore();
      const menuSetting = useMenuSetting();

      async function handlerTurnToApplication(item: DefApplicationResultVO) {
        if (unref(menuSetting.getIsMixModeAndSplit)) {
          return;
        }

        if (userStore.getApplicationId === item?.id) {
          createMessage.warn(`您当前正处于[${item.name}]，无需切换`);
          return;
        }
        if (!item || !item.id) {
          createMessage.error('请选择正确的应用进行切换');
          return;
        }
        try {
          openFullLoading();

          const canJump = await checkEmployeeHaveApplication(item.id);
          if (!canJump) {
            createMessage.warn(`对不起，您无该应用访问权限，请联系贵公司管理员开通权限`);
            return '';
          }

          const isOpen = item.url && isUrl(item.url);
          createConfirm({
            iconType: 'warning',
            content: `确定要${isOpen ? '跳转' : '切换'}到应用：【${
              item.name
            }】， 并重新加载其资源吗？`,
            onOk: async () => {
              if (isOpen) {
                window.open(item.url);
              } else {
                userStore.setApplicationId(item.id as string);
                userStore.setApplicationName(item.name as string);
                await userStore.getUserInfoAction();
                await refreshMenu();
                const { closeAll } = useTabs(router);
                await closeAll();
                createMessage.success(`成功切换到应用：[${item.name}]`);

                setTimeout(async () => {
                  location.reload();
                  // await router.replace({ path: PageEnum.BASE_HOME });
                }, 200);
              }
            },
          });
        } finally {
          closeFullLoading();
        }
      }

      const customClick = props.handleClick ? props.handleClick : handlerTurnToApplication;

      const { prefixVar } = useDesign('');

      const getAppCardClass = (item: DefApplicationResultVO) => {
        const appKeyCls = `${prefixVar}-${item.appKey}`;
        return userStore.getApplicationId === item?.id ? [appKeyCls, 'appDisabled'] : [appKeyCls];
      };

      onMounted(async () => {
        try {
          applicationList.value = await props.api();
          if (props.updateDef) {
            const defApp = await getDefApp();
            defApplicationId.value = defApp?.id;
          }
        } finally {
          loading.value = false;
        }
      });

      async function handleUpdateDefApp(item, e: Event) {
        e && e.stopPropagation();
        console.log(item.id);
        await updateDefApp(item.id);
        defApplicationId.value = item.id;
        createMessage.success(`修改成功`);
      }

      function handleMore() {
        emit('more');
      }

      return {
        props,
        ExpireStateEnum,
        FileBizTypeEnum,
        getAppCardClass,
        applicationList,
        customClick,
        loading,
        handleUpdateDefApp,
        defApplicationId,
        handleMore,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-myApplication';

  .appDisabled {
    color: rgb(0 0 0 / 75%);
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 1;
  }

  [data-theme='dark'] .appDisabled {
    color: rgb(255 255 255 / 30%);
    background-color: rgb(255 255 255 / 8%);
  }

  .@{prefix-cls} {
    .ant-card-head .ant-card-head-wrapper .ant-card-head-title {
      color: red;
    }
  }
</style>
