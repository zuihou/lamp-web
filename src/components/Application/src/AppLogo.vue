<!--
 * @Author: Vben
 * @Description: logo component
-->
<template>
  <div :class="getAppLogoClass" class="anticon" @click="goHome">
    <img src="../../../assets/images/logo.png" />
    <div v-show="showTitle" :class="getTitleClass" class="ml-2 truncate md:opacity-100">
      {{ newTitle }}
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, unref, watch } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },

    /**
     * 显示为当前应用的标题
     */
    applicationTitle: { type: Boolean, default: true },
  });

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle } = useMenuSetting();
  const userStore = useUserStore();
  const { title } = useGlobSetting();
  let newTitle = ref<string>(title);
  const go = useGo();

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme,
    { 'collapsed-show-title': unref(getCollapsedShowTitle) },
  ]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);

  watch(
    () => userStore.getApplicationName,
    () => {
      if (props.applicationTitle) {
        newTitle.value = userStore.getApplicationName ?? title;
      } else {
        newTitle.value = title;
      }
    },
    { immediate: true },
  );

  function goHome() {
    go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.mix-logo {
      background-color: var(--sider-dark-bg-color);
    }

    &.light {
      //border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.top-menu-logo.light &__title {
      color: @primary-color;
    }

    &.mix-logo.light &__title {
      color: #fff !important;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      transition: all 0.5s;
      line-height: normal;
    }
  }
</style>
