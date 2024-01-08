<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.BASIC_MSG_MSG_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.BASIC_MSG_MSG_ADD]"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleAdd"
        >
          发布
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth: RoleEnum.BASIC_MSG_MSG_VIEW,
                tooltip: t('common.title.view'),
                icon: 'ant-design:search-outlined',
                onClick: handleView.bind(null, record),
              },
              {
                auth: RoleEnum.BASIC_MSG_MSG_EDIT,
                tooltip: t('common.title.edit'),
                icon: 'ant-design:edit-outlined',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return record.status === TaskStatusEnum.DRAFT;
                },
              },
              {
                auth: RoleEnum.BASIC_MSG_MSG_ADD,
                tooltip: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                onClick: handleCopy.bind(null, record),
              },
              {
                auth: RoleEnum.BASIC_MSG_MSG_DELETE,
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
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { TaskStatusEnum } from '/@/enums/biz/base';
  import { page, remove } from '/@/api/basic/msg/extendMsg';
  import { columns, searchFormSchema } from './extendMsg.data';

  import { RouteEnum } from '/@/enums/biz/tenant';
  import { RoleEnum } from '/@/enums/roleEnum';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '消息维护',
    components: {
      BasicTable,
      PageWrapper,
      TableAction,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const { replace } = useRouter();

      // 表格
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: t('basic.msg.extendMsg.table.title'),
        api: page,
        columns: columns(),
        formConfig: {
          name: 'ExtendMsgSearch',
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
      function handleCopy(record: Recordable, e) {
        e.stopPropagation();

        replace({
          name: RouteEnum.BASIC_MSG_ADD,
          params: { type: ActionEnum.COPY, id: record.id },
        });
      }

      // 弹出新增页面
      function handleAdd() {
        replace({
          name: RouteEnum.BASIC_MSG_ADD,
          params: { type: ActionEnum.ADD, id: '0' },
        });
      }

      // 弹出查看页面
      function handleView(record: Recordable, e: Event) {
        e.stopPropagation();
        replace({
          name: RouteEnum.BASIC_MSG_ADD,
          params: { type: ActionEnum.VIEW, id: record.id },
        });
      }

      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e.stopPropagation();
        replace({
          name: RouteEnum.BASIC_MSG_ADD,
          params: { type: ActionEnum.EDIT, id: record.id },
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
        registerTable,
        handleView,
        handleAdd,
        handleCopy,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        RoleEnum,
        TaskStatusEnum,
      };
    },
  });
</script>
