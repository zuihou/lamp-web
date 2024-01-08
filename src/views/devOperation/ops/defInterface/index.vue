<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_OPS_INTERFACES_DELETE]"
          type="primary"
          color="error"
          preIcon="ant-design:delete-outlined"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_OPS_INTERFACES_ADD]"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleAdd"
        >
          {{ t('common.title.add') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_VIEW,
                tooltip: t('common.title.view'),
                icon: 'ant-design:search-outlined',
                onClick: handleView.bind(null, record),
              },
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_PROPERTY,
                tooltip: '接口设置',
                icon: 'ant-design:setting-outlined',
                onClick: handleProperty.bind(null, record),
              },
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_EDIT,
                tooltip: t('common.title.edit'),
                icon: 'ant-design:edit-outlined',
                onClick: handleEdit.bind(null, record),
              },
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_ADD,
                tooltip: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                onClick: handleCopy.bind(null, record),
              },
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_DELETE,
                tooltip: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
            :stopButtonPropagation="true"
          />
        </template>
      </template>
    </BasicTable>
    <EditModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { page, remove } from '/@/api/devOperation/ops/defInterface';
  import { columns, searchFormSchema } from './defInterface.data';
  import EditModal from './Edit.vue';
  import { RouteEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '接口管理',
    components: {
      BasicTable,
      PageWrapper,
      TableAction,
      EditModal,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const { replace } = useRouter();

      // 表格
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: t('devOperation.ops.defInterface.table.title'),
        api: page,
        columns: columns(),
        formConfig: {
          name: 'DefInterfaceSearch',
          labelWidth: 120,
          schemas: searchFormSchema(),
          autoSubmitOnEnter: true,
          resetButtonOptions: {
            preIcon: 'ant-design:rest-outlined',
          },
          submitButtonOptions: {
            preIcon: 'ant-design:search-outlined',
          },
        },
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          columnWidth: 40,
        },
        actionColumn: {
          width: 200,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      // 弹出复制页面
      function handleCopy(record: Recordable, e: Event) {
        e?.stopPropagation();
        openModal(true, {
          record,
          type: ActionEnum.COPY,
        });
      }

      // 弹出新增页面
      function handleAdd() {
        openModal(true, {
          type: ActionEnum.ADD,
        });
      }

      // 弹出查看页面
      function handleView(record: Recordable, e: Event) {
        e?.stopPropagation();
        openModal(true, {
          record,
          type: ActionEnum.VIEW,
        });
      }

      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        openModal(true, {
          record,
          type: ActionEnum.EDIT,
        });
      }

      // 接口设置
      function handleProperty(record: Recordable, e: Event) {
        e?.stopPropagation();
        replace({
          name: RouteEnum.BASIC_MSG_PROPERTY,
          params: { id: record.id },
          query: { name: record.name },
        });
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      async function batchDelete(ids: string[]) {
        await remove(ids);
        createMessage.success(t('common.tips.deleteSuccess'));
        handleSuccess();
      }

      // 点击单行删除
      function handleDelete(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          batchDelete([record.id]);
        }
      }

      // 点击批量删除
      function handleBatchDelete() {
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: t('common.tips.confirmDelete'),
          onOk: async () => {
            try {
              await batchDelete(ids);
            } catch (e) {}
          },
        });
      }

      return {
        t,
        RoleEnum,
        registerTable,
        registerModal,
        handleView,
        handleAdd,
        handleCopy,
        handleEdit,
        handleProperty,
        handleDelete,
        handleBatchDelete,
        handleSuccess,
      };
    },
  });
</script>
