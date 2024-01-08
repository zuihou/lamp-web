<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_OPS_INTERFACES_LOG_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_LOG_LOGGING,
                tooltip: '执行记录',
                icon: 'ant-design:search-outlined',
                onClick: handleLogging.bind(null, record),
              },
              {
                auth: RoleEnum.TENANT_OPS_INTERFACES_LOG_DELETE,
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { page, remove } from '/@/api/basic/msg/extendInterfaceLog';
  import { columns, searchFormSchema } from './defInterfaceLog.data';
  import { RouteEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '接口日志',
    components: {
      BasicTable,
      PageWrapper,
      TableAction,
    },
    setup() {
      const { t } = useI18n();
      const { replace } = useRouter();
      const { createMessage, createConfirm } = useMessage();

      // 表格
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: t('basic.msg.extendInterfaceLog.table.title'),
        api: page,
        columns: columns(),
        formConfig: {
          name: 'DefInterfaceLogSearch',
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
          width: 100,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      function handleSuccess() {
        reload();
      }

      function handleLogging(record: Recordable, e: Event) {
        e?.stopPropagation();
        replace({
          name: RouteEnum.BASIC_MSG_INTERFACE_LOGGING,
          params: { id: record.id },
        });
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
        handleDelete,
        handleBatchDelete,
        handleSuccess,
        handleLogging,
      };
    },
  });
</script>
