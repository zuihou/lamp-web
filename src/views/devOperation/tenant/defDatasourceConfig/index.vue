<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_DATASOURCE_CONFIG_ADD]"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleAdd"
          >{{ t('common.title.add') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_DATASOURCE_CONFIG_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
          >{{ t('common.title.delete') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                color: 'error',
                auth: RoleEnum.TENANT_DATASOURCE_CONFIG_DELETE,
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
              },
              {
                tooltip: t('common.title.edit'),
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                auth: RoleEnum.TENANT_DATASOURCE_CONFIG_EDIT,
              },
              {
                icon: 'ant-design:bug-outlined',
                tooltip: t('devOperation.tenant.defDatasourceConfig.testConnection'),
                onClick: handleConnection.bind(null, record),
                auth: RoleEnum.TENANT_DATASOURCE_CONFIG_DEBUG,
              },
              {
                tooltip: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                onClick: handleCopy.bind(null, record),
                auth: RoleEnum.TENANT_DATASOURCE_CONFIG_ADD,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <EditModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { useLoading } from '/@/components/Loading';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { ActionEnum } from '/@/enums/commonEnum';

  import { page, remove, testConnect } from '/@/api/devOperation/tenant/datasourceConfig';
  import EditModal from './Edit.vue';
  import { columns, searchFormSchema } from './datasourceConfig.data';

  export default defineComponent({
    name: '数据源维护',
    components: { BasicTable, PageWrapper, EditModal, TableAction },
    setup() {
      const { t } = useI18n();
      const [registerModal, { openModal }] = useModal();
      const { createMessage, createConfirm } = useMessage();
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: t('devOperation.tenant.defDatasourceConfig.table.title'),
        api: page,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          baseColProps: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8 },
          autoSubmitOnEnter: true,
          resetButtonOptions: {
            preIcon: 'ant-design:rest-outlined',
          },
          submitButtonOptions: {
            preIcon: 'ant-design:search-outlined',
          },
        },
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 180,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      // 弹出复制页面
      function handleCopy(record: Recordable, e: Event) {
        e.stopPropagation();
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

      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        openModal(true, {
          record,
          type: ActionEnum.EDIT,
        });
      }

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('common.loadingText'),
      });
      const isTestConnect = ref(false);

      function handleConnection(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (unref(isTestConnect)) {
          createMessage.warn('正在测试连接，请稍后!');
          return;
        }

        record.poolName = 'test';

        isTestConnect.value = true;
        openFullLoading();
        testConnect(record.id)
          .then((res) => {
            if (res) {
              createMessage.success('测试连接成功');
            } else {
              createMessage.error('测试连接失败,请检查配置是否正确!');
            }
          })
          .finally(() => {
            isTestConnect.value = false;
            closeFullLoading();
          });
      }

      async function batchDelete(ids: any[]) {
        await remove(ids);
        createMessage.success(t('common.tips.deleteSuccess'));
        handleSuccess();
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
            await batchDelete(ids);
          },
        });
      }

      function handleDelete(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          batchDelete([record.id]);
        }
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerModal,
        handleAdd,
        handleEdit,
        handleCopy,
        handleConnection,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        t,
        RoleEnum,
      };
    },
  });
</script>
