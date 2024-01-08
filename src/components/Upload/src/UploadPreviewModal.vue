<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.preview')"
    class="upload-preview-modal"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
  >
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch, ref } from 'vue';
  //   import { BasicTable, useTable } from '/@/components/Table';
  import FileList from './FileList.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { previewProps } from './props';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';
  import { downloadFile } from '/@/utils/lamp/common';
  import { downloadFromDef, downloadFromTenant } from '/@/api/lamp/file/upload';
  import { FileResultVO } from '/@/api/lamp/file/model/uploadModel';

  export default defineComponent({
    components: { BasicModal, FileList },
    props: previewProps,
    emits: ['list-change', 'register', 'delete'],
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const { t } = useI18n();

      const fileListRef = ref<FileResultVO[]>([]);
      watch(
        () => props.value,
        (value) => {
          if (!isArray(value)) value = [];
          fileListRef.value = value.filter((item) => !!item);
        },
        { immediate: true },
      );

      // 删除
      function handleRemove(record: FileResultVO) {
        const index = fileListRef.value.findIndex((item) => item.id === record.id);
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].id);
          emit('list-change', fileListRef.value);
        }
      }

      // 下载
      async function handleDownload(record: FileResultVO) {
        const { id } = record;
        const download = props.isDef ? downloadFromDef : downloadFromTenant;
        const response = await download([id]);
        downloadFile(response);
      }

      return {
        t,
        register,
        closeModal,
        fileListRef,
        columns: createPreviewColumns(props.isDef) as any[],
        actionColumn: createPreviewActionColumn({ handleRemove, handleDownload }) as any,
      };
    },
  });
</script>
<style lang="less">
  .upload-preview-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
