<template>
  <div v-if="showSourceLink" class="fs-source-link-group">
    <div class="fs-source-link">
      <Icon icon="ant-design:close" @click="close" />
      <div @click="goSource('https://gitee.com/zuihou111')">本页源码（Gitee）</div>
    </div>
    <div class="fs-source-link">
      <Icon icon="ant-design:close" @click="close" />
      <div @click="goSource('https://github.com/zuihou')">本页源码（Github）</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Icon } from '/@/components/Icon';
  export default defineComponent({
    name: 'FsSourceLink',
    components: { Icon },
    setup() {
      const router = useRouter();
      const showSourceLink = ref(false);
      watch(
        () => {
          return router.currentRoute.value.fullPath;
        },
        (value) => {
          showSourceLink.value = value !== '/index';
        },
        { immediate: true },
      );
      const middle = '/lamp-web/blob/4.x_java17/src/views';
      function goSource(prefix: any) {
        let component = router.currentRoute.value.meta?.component as string;

        if (component) {
          if (!component.startsWith('/')) {
            component = '/' + component;
          }
          if (!component.endsWith('.vue')) {
            component = component + '.vue';
          }
          window.open(prefix + middle + component);
        } else {
          window.open(prefix + middle);
        }
      }

      function close() {
        showSourceLink.value = false;
      }

      return {
        goSource,
        close,
        showSourceLink,
      };
    },
  });
</script>

<style lang="less">
  .fs-source-link-group {
    position: fixed;
    right: 3px;
    bottom: 20px;
    z-index: 200;
    .fs-source-link {
      font-size: 12px;
      border-radius: 5px 0 0 5px;
      padding: 5px;
      background: #666;
      color: #fff;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      span,
      svg {
        cursor: pointer;
      }
    }
  }
</style>
