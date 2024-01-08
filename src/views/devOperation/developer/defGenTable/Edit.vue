<template>
  <PageWrapper :content="content" :title="title">
    <template #extra>
      <a-button v-if="current === 0" :loading="loading" type="primary" @click="handleSubmit">
        保存
      </a-button>
    </template>

    <template #footer>
      <div class="step-form-form">
        <Steps :current="current" size="small" type="navigation" @change="changeSteps">
          <Step :status="status" title="生成信息" />
          <Step title="字段信息" />
          <Step title="代码预览" />
          <Step title="立即生成" />
        </Steps>
      </div>
    </template>

    <Loading
      :absolute="absolute"
      :background="background"
      :loading="loading"
      :theme="theme"
      :tip="tip"
    />

    <div class="overflow-hidden bg-white p-4">
      <div v-show="current === 0">
        <EditIndex ref="formRef" @loading="setLoading" />
      </div>
      <div v-show="current === 1">
        <DefGenTableColumn ref="columnRef" />
      </div>
      <div v-show="current === 2">
        <EditPreview ref="previewRef" />
      </div>
      <div v-show="current === 3">
        <EditGenerator ref="generatorRef" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs, unref } from 'vue';
  import { Steps } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { Loading } from '/@/components/Loading';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import DefGenTableColumn from './edit/DefGenTableColumnVxe.vue';
  import EditIndex from './edit/index.vue';
  import EditPreview from './edit/EditPreview.vue';
  import EditGenerator from './edit/EditGenerator.vue';

  export default defineComponent({
    name: '修改代码配置',
    components: {
      PageWrapper,
      Loading,
      Steps,
      Step: Steps.Step,
      DefGenTableColumn,
      EditIndex,
      EditPreview,
      EditGenerator,
    },
    setup(_) {
      const { t } = useI18n();
      const { notification } = useMessage();
      const { currentRoute } = useRouter();
      const formRef = ref<any>(null);
      const columnRef = ref<any>(null);
      const previewRef = ref<any>(null);
      const generatorRef = ref<any>(null);

      const pageState = reactive({
        title: '修改字段配置',
        content: '',
        tableId: '',
        status: '',
        current: 0,
        batch: false,
      });
      const compState = reactive({
        absolute: false,
        loading: false,
        theme: 'dark',
        background: 'rgba(111,111,111,.7)',
        tip: '加载中...',
      });

      // 获取应用资源表单
      function getColumnRef() {
        return unref(columnRef);
      }

      function getFormRef() {
        return unref(formRef);
      }

      function getPreviewRef() {
        return unref(previewRef);
      }

      function getGeneratorRef() {
        return unref(generatorRef);
      }

      function setLoading(loading: boolean) {
        compState.loading = loading;
      }

      onMounted(async () => {
        const routeParams = currentRoute.value?.params;
        const routeQuery = currentRoute.value?.query;
        pageState.tableId = routeParams.id as string;
        pageState.title = routeQuery.title as string;
        pageState.content = routeQuery.content as string;
        if (routeParams.id.includes(',')) {
          pageState.batch = true;
        }
        setLoading(true);
        try {
          await getFormRef().loadDetail(pageState.tableId);
          await getColumnRef().load(pageState.tableId, pageState.batch);
          await getGeneratorRef().loadDetail(pageState.tableId);
        } finally {
          setLoading(false);
        }
      });

      async function handleSubmit() {
        await getFormRef().handleSubmit();
      }

      async function changeSteps(curr) {
        setLoading(true);
        pageState.status = '';
        try {
          if (curr !== 0) {
            try {
              await getFormRef().validate();
            } catch (e) {
              notification.warn({ message: '提示', description: '请完善表单信息', duration: 5 });
              pageState.current = 0;
              pageState.status = 'error';
              return;
            }
          }
          const previewIndex = 2;
          // const previewIndex = pageState.batch ? 1 : 2;
          if (curr === previewIndex) {
            await getPreviewRef().load(pageState.tableId);
          }
          pageState.current = curr;
        } finally {
          setLoading(false);
        }
      }

      return {
        t,
        columnRef,
        formRef,
        previewRef,
        generatorRef,
        ...toRefs(pageState),
        ...toRefs(compState),
        setLoading,
        changeSteps,
        handleSubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
  .step-form-form {
    width: 750px;
    margin: 0 auto;
    padding-bottom: 20px;
  }
</style>
