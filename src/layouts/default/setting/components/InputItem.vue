<template>
  <div :class="prefixCls">
    <span> {{ title }}</span>
    <Input
      v-bind="$attrs"
      size="small"
      :class="`${prefixCls}-input`"
      @input="inputHandler"
      @blur="blurHandler"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { Input } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { HandlerEnum } from '../enum';

  export default defineComponent({
    name: 'InputItem',
    components: { Input },
    props: {
      event: {
        type: Number as PropType<HandlerEnum>,
        default: () => {},
      },
      title: {
        type: String,
      },
      inputHandler: {
        type: Function as PropType<Fn>,
        default: () => {},
      },
      blurHandler: {
        type: Function as PropType<Fn>,
        default: () => {},
      },
    },
    setup() {
      const { prefixCls } = useDesign('setting-input-item');

      return {
        prefixCls,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-input-item';

  .@{prefix-cls} {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;

    &-input {
      width: 126px;
    }
  }
</style>
