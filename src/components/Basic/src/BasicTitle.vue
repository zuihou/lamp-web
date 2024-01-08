<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="`${prefixCls}-help`" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { useSlots, computed } from 'vue';
  import BasicHelp from './BasicHelp.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';

  const props = defineProps({
    /**
     * Help text list or string
     * @default: ''
     */
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    /**
     * Whether the color block on the left side of the title
     * @default: false
     */
    span: propTypes.bool.def(false),
    /**
     * Whether to default the text, that is, not bold
     * @default: false
     */
    normal: propTypes.bool.def(true),
    /**
     * 是否显示底部线条
     */
    line: propTypes.bool.def(false),
    /**
     * 底部线条 是否虚线
     */
    dashed: propTypes.bool.def(false),
    /** 是否显示光标 */
    cursor: propTypes.bool.def(false),
    /** 是否不能选择 */
    noneSelect: propTypes.bool.def(false),
  });

  const { prefixCls } = useDesign('basic-title');
  const slots = useSlots();
  const getClass = computed(() => [
    prefixCls,
    { [`${prefixCls}-show-span`]: props.span && slots.default },
    { [`${prefixCls}-line`]: !!props.line },
    { [`${prefixCls}-cursor`]: !!props.cursor },
    { [`${prefixCls}-none-select`]: !!props.noneSelect },
    { [`${prefixCls}-dashed`]: !!props.line && !!props.dashed },
    { [`${prefixCls}-normal`]: !!props.normal },
  ]);
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-title';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    padding-left: 7px;
    font-size: @font-size-lg;
    font-weight: 500;
    line-height: 24px;
    color: @text-color-base;

    &-none-select {
      user-select: none;
    }

    &-cursor {
      cursor: pointer;
    }

    &-normal {
      font-size: @font-size-base;
      font-weight: normal;
    }

    &-line {
      border-bottom: @border-width-base solid transparent;
      // Chrome not accept `inherit` in `border-top`
      border-bottom-color: inherit;
    }

    &-dashed {
      background: none;
      border-color: @divider-color;
      border-style: dashed;
      border-width: 0 0 @border-width-base;
    }

    &-show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: @font-size-lg;
      margin-right: 4px;
      background-color: @primary-color;
      content: '';
    }

    &-help {
      margin-left: 10px;
    }
  }
</style>
