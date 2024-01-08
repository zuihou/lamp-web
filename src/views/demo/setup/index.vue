<template>
  <PageWrapper id="test_test" content="用于给用户的指引操作" title="引导页">
    <a-button type="primary" @click="handleStart">开始</a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Driver from 'driver.js';
  import 'driver.js/dist/driver.min.css';

  export default defineComponent({
    components: { PageWrapper },
    setup() {
      const { prefixVar } = useDesign('');

      const driver = new Driver({
        allowClose: false, //禁止点击外部关闭
        doneBtnText: '知道了', // 完成按钮标题
        closeBtnText: '跳过', // 关闭按钮标题
        nextBtnText: '下一步 &rarr;', // 下一步按钮标题
        prevBtnText: '上一步 &larr;', // 上一步按钮标题
      });

      function handleStart() {
        const steps = [
          {
            element: '#test_test',
            popover: {
              title: 'Welcome',
              intro: 'Hello World! 👋',
            },
          },
          {
            element: document.querySelector(`.${prefixVar}-layout-header-trigger`)!,
            stageBackground: 'rgb(255, 255, 255, 0.3)',
            popover: {
              title: 'Collapse Button',
              intro: 'This is the menu collapse button.',
            },
          },
          {
            element: document.querySelector(`.${prefixVar}-layout-header-action`)!,
            stageBackground: 'rgb(255, 255, 255, 0.3)',
            popover: {
              title: 'User Action',
              intro: 'This is the user function area.',
            },
          },
        ] as any[];
        driver.reset();
        driver.defineSteps(steps);
        driver.start();
      }

      return { handleStart };
    },
  });
</script>
