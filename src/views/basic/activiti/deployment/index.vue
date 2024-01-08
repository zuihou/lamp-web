<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_DELETE]"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_UPLOAD]"
          type="primary"
          @click="handleUpload"
          >{{ t('common.title.upload') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '转换模型',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_TRAN,
                onClick: handleTrans.bind(null, record),
              },
              {
                label: record.suspensionState === 2 ? '激活' : '挂起',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_STATE,
                onClick: handleStatus.bind(null, record),
              },
              {
                label: '流程图',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_DRAW,
                onClick: handleDraw.bind(null, record),
              },
              {
                label: 'XML',
                onClick: handleXml.bind(null, record),
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_XML,
              },
              {
                label: t('common.title.delete'),
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_DEPLOYMENT_DELETE,
                color: 'error',
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <UploadModal @register="registerUploadModal" @success="handleSuccess" />
    <ViewModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useLoading } from '/@/components/Loading';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { page, remove, saveModelByPro, updateState } from '/@/api/basic/activiti/deployment';
  import { columns, searchFormSchema } from './deployment.data';
  import UploadModal from './Upload.vue';
  import ViewModal from './View.vue';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    name: '流程部署',
    components: { BasicTable, PageWrapper, UploadModal, ViewModal, TableAction },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      // 编辑页弹窗
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();
      const [registerModal, { openModal }] = useModal();

      // 表格1
      const [registerTable, { reload, getSelectRows }] = useTable({
        title: '流程管理',
        api: page,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        actionColumn: {
          width: 300,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('common.requestingText'),
      });

      // 查看流程xml
      function handleXml(record: Recordable, e) {
        e?.stopPropagation();
        openModal(true, { type: 'xml', record });
      }

      // 查看流程图
      function handleDraw(record: Recordable, e) {
        e?.stopPropagation();
        openModal(true, { type: 'draw', record });
      }

      // 转换为模型
      async function handleTrans(record: Recordable, e) {
        e?.stopPropagation();
        openFullLoading();
        try {
          await saveModelByPro(record.id);
          createMessage.success('转换成功');
          handleSuccess();
        } finally {
          closeFullLoading();
        }
      }

      // 修改化状态
      async function handleStatus(record: Recordable, e) {
        e?.stopPropagation();
        openFullLoading();
        try {
          const flag = await updateState(record.id, record.suspensionState);
          if (flag) {
            createMessage.success(t('common.tips.updateSuccess'));
            handleSuccess();
          } else {
            createMessage.success(t('common.tips.updateFail'));
          }
        } finally {
          closeFullLoading();
        }
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      async function batchDelete(ids: any[]) {
        await remove(ids);
        createMessage.success(t('common.tips.deleteSuccess'));
        handleSuccess();
      }

      // 点击单行删除
      function handleDelete(record: Recordable, e) {
        e.stopPropagation();
        if (record?.deploymentId) {
          batchDelete([record.deploymentId]);
        }
      }

      function handleUpload() {
        openUploadModal(true);
      }

      // 点击批量删除
      function handleBatchDelete() {
        const selectedRows = getSelectRows();
        const ids = selectedRows.map((item) => item.deploymentId);
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: t('common.tips.confirmDelete'),
          onOk: async () => {
            await batchDelete(ids);
          },
        });
      }

      return {
        t,
        registerTable,
        registerUploadModal,
        handleUpload,
        handleTrans,
        handleDraw,
        handleStatus,
        handleXml,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        registerModal,
        RoleEnum,
      };
    },
  });
</script>
