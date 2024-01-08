<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.BASIC_FLOW_ACTIVITI_MODEL_ADD]"
          type="primary"
          @click="handleAdd"
          >{{ t('common.title.add') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_MODEL_EDIT,
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '发布',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_MODEL_PUBLISH,
                onClick: handlePublish.bind(null, record),
              },
              {
                label: '下载',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_MODEL_DOWNLOAD,
                onClick: handleDownload.bind(null, record),
              },
              {
                label: t('common.title.delete'),
                color: 'error',
                auth: RoleEnum.BASIC_FLOW_ACTIVITI_MODEL_DELETE,
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
    <EditModal @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { downloadFile, handleFetchParams } from '/@/utils/lamp/common';
  import { useLoading } from '/@/components/Loading';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { openWindow } from '/@/utils';
  import { isDevMode } from '/@/utils/env';
  import { getApplicationId, getTenantId, getToken } from '/@/utils/auth';
  import { download, page, publish, remove } from '/@/api/basic/activiti/model';
  import { columns, searchFormSchema } from './model.data';
  import { RoleEnum } from '/@/enums/roleEnum';
  import EditModal from './Edit.vue';

  export default defineComponent({
    name: '模型管理',
    components: { BasicTable, PageWrapper, EditModal, TableAction },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer }] = useDrawer();

      // 表格
      const [registerTable, { reload }] = useTable({
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
          width: 240,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('common.requestingText'),
      });

      // 查看流程图
      async function handleDownload(record: Recordable, e) {
        e.stopPropagation();
        const response = await download(record.id);
        downloadFile(response);
      }

      // 修改化状态
      function handleEdit(record: Recordable, e) {
        e.stopPropagation();
        const tenant = getTenantId();
        const applicationId = getApplicationId();
        const token = getToken();
        // lamp-boot 本地开发，请使用此链接
        // let url = `/static/index?modelId=${record.id}&ApplicationId=${applicationId}&TenantId=${tenant}&Token=${token}`;
        // lamp-cloud 本地和生产和 lamp-boot 生产，请使用此链接
        let url = `/api/activiti/static/index?modelId=${record.id}&ApplicationId=${applicationId}&TenantId=${tenant}&Token=${token}`;
        // 本地需要直接访问网关
        openWindow((isDevMode() ? 'http://localhost:18760' : '') + url);
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      async function batchDelete(id: string) {
        await remove(id);
        createMessage.success(t('common.tips.deleteSuccess'));
        handleSuccess();
      }

      // 点击单行删除
      function handleDelete(record: Recordable, e) {
        e.stopPropagation();
        if (record?.id) {
          batchDelete(record.id);
        }
      }

      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
        });
      }

      async function handlePublish(record: Recordable, e) {
        e.stopPropagation();
        try {
          openFullLoading();
          await publish(record.id);
          createMessage.success('发布成功');
        } finally {
          closeFullLoading();
        }
      }

      return {
        t,
        registerTable,
        registerDrawer,
        handleAdd,
        handleDownload,
        handlePublish,
        handleEdit,
        handleDelete,
        handleSuccess,
        RoleEnum,
      };
    },
  });
</script>
