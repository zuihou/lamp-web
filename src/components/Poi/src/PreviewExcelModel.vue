<template>
  <BasicModal
    v-bind="{ ...$attrs, ...$props }"
    :title="t('component.poi.exportModalTitle')"
    @ok="handleOk"
    :maskClosable="false"
    @register="registerModal"
  >
    <ScrollContainer class="mt-4">
      <div v-html="previewHtml"></div>
    </ScrollContainer>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { downloadFile } from '/@/utils/lamp/common';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  const { t } = useI18n();

  export default defineComponent({
    name: 'PreviewExcelModel',
    components: { BasicModal, ScrollContainer },
    props: {
      previewApi: {
        type: Function as PropType<(arg?: Recordable) => Promise<string>>,
        default: null,
      },
      exportApi: {
        type: Function as PropType<(arg?: Recordable) => Promise<any>>,
        default: null,
      },
    },
    emits: ['success', 'register'],
    setup(props, { emit }) {
      let previewHtml = ref('');
      let params = { model: {} };
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        previewHtml.value = t('component.poi.loading');
        setModalProps({ confirmLoading: false });
        const previewApi = props.previewApi;
        if (!previewApi || !isFunction(previewApi)) {
          return warn(t('component.poi.previewApiWarn'));
        }
        params = data?.params;
        const res = await previewApi(params);
        previewHtml.value = res;
      });

      async function handleOk() {
        const exportApi = props.exportApi;
        if (!exportApi || !isFunction(exportApi)) {
          return warn(t('component.poi.exportApiWarn'));
        }

        try {
          setModalProps({ confirmLoading: true });
          const response = await exportApi(params);
          downloadFile(response);
          emit('success');
          closeModal();
        } catch (error) {
          console.warn(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        t,
        registerModal,
        handleOk,
        previewHtml,
      };
    },
  });
</script>
