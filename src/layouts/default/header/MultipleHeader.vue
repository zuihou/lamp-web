<template>
  <div v-if="getIsShowPlaceholderDom" :style="getPlaceholderDomStyle"></div>
  <div :class="getClass" :style="getWrapStyle">
    <LayoutHeader v-if="getShowInsetHeaderRef" />
    <MultipleTabs v-if="getShowTabs" />
  </div>
</template>
<script lang="ts">
  import { computed, CSSProperties, defineComponent, unref } from 'vue';

  import LayoutHeader from './index.vue';
  import MultipleTabs from '../tabs/index.vue';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useFullContent } from '/@/hooks/web/useFullContent';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../content/useContentViewHeight';
  import { TabsThemeEnum } from '/@/enums/appEnum';

  // 这几个参数跟 src/design/var/index.less 中的高度要一致
  // @multiple-height: 30px;
  // @multiple-card-height: 50px;
  // @multiple-smooth-height: 50px;
  // @header-height: 48px;
  const HEADER_HEIGHT = 48;
  // 修改tab切换栏样式：更改高度
  const TABS_HEIGHT = 30;
  const TABS_HEIGHT_CARD = 50;
  const TABS_HEIGHT_SMOOTH = 50;

  export default defineComponent({
    name: 'LayoutMultipleHeader',
    components: { LayoutHeader, MultipleTabs },
    setup() {
      const { setHeaderHeight } = useLayoutHeight();
      const { prefixCls } = useDesign('layout-multiple-header');

      const { getCalcContentWidth, getSplit } = useMenuSetting();
      const { getIsMobile } = useAppInject();
      const {
        getFixed,
        getShowInsetHeaderRef,
        getShowFullHeaderRef,
        getHeaderTheme,
        getShowHeader,
      } = useHeaderSetting();

      const { getFullContent } = useFullContent();

      const { getShowMultipleTab, getTabsTheme } = useMultipleTabSetting();

      const getShowTabs = computed(() => {
        return unref(getShowMultipleTab) && !unref(getFullContent);
      });

      const getIsShowPlaceholderDom = computed(() => {
        return unref(getFixed) || unref(getShowFullHeaderRef);
      });

      const getWrapStyle = computed((): CSSProperties => {
        const style: CSSProperties = {};
        if (unref(getFixed)) {
          style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
        }
        if (unref(getShowFullHeaderRef)) {
          style.top = `${HEADER_HEIGHT}px`;
        }
        return style;
      });

      const getIsFixed = computed(() => {
        return unref(getFixed) || unref(getShowFullHeaderRef);
      });

      // 根据主题的不同，动态计算tabs高度
      const getTabsThemeHeight = computed(() => {
        let tabsTheme = unref(getTabsTheme);
        if (tabsTheme === TabsThemeEnum.CARD) {
          return TABS_HEIGHT_CARD;
        } else if (tabsTheme === TabsThemeEnum.SMOOTH) {
          return TABS_HEIGHT_SMOOTH;
        } else {
          return TABS_HEIGHT;
        }
      });

      const getPlaceholderDomStyle = computed((): CSSProperties => {
        let height = 0;
        if (
          (unref(getShowFullHeaderRef) || !unref(getSplit)) &&
          unref(getShowHeader) &&
          !unref(getFullContent)
        ) {
          height += HEADER_HEIGHT;
        }
        if (unref(getShowMultipleTab) && !unref(getFullContent)) {
          height += unref(getTabsThemeHeight);
        }
        setHeaderHeight(height);
        return {
          height: `${height}px`,
        };
      });

      const getClass = computed(() => {
        return [
          prefixCls,
          `${prefixCls}--${unref(getHeaderTheme)}`,
          { [`${prefixCls}--fixed`]: unref(getIsFixed) },
        ];
      });

      return {
        getClass,
        prefixCls,
        getPlaceholderDomStyle,
        getIsFixed,
        getWrapStyle,
        getIsShowPlaceholderDom,
        getShowTabs,
        getShowInsetHeaderRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-multiple-header';

  .@{prefix-cls} {
    transition: width 0.2s;
    flex: 0 0 auto;

    &--dark {
      margin-left: -1px;
    }

    &--fixed {
      position: fixed;
      top: 0;
      z-index: @multiple-tab-fixed-z-index;
      width: 100%;
    }
  }
</style>
