<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.BASIC_MSG_NOTICE_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleRead">
          标记已读
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth: RoleEnum.BASIC_MSG_NOTICE_VIEW,
                tooltip: t('common.title.view'),
                icon: 'ant-design:search-outlined',
                onClick: handleView.bind(null, record),
              },
              {
                auth: RoleEnum.BASIC_MSG_NOTICE_DELETE,
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
  import { defineComponent, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { mark, page, remove } from '/@/api/basic/msg/extendNotice';
  import { columns, searchFormSchema } from './extendNotice.data';
  import { RouteEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '我的消息',
    components: {
      BasicTable,
      PageWrapper,
      TableAction,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const { replace, currentRoute } = useRouter();

      // 表格
      const [registerTable, { reload, getSelectRowKeys, setFieldsValue }] = useTable({
        title: t('basic.msg.extendNotice.table.title'),
        api: page,
        columns: columns(),
        formConfig: {
          name: 'ExtendNoticeSearch',
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
        immediate: false,
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

      onMounted(async () => {
        const { query } = currentRoute.value;
        const remindMode = query.remindMode as string;
        await setFieldsValue({ remindMode });
        nextTick(async () => {
          await reload();
        });
      });

      // 标记已读
      async function handleRead() {
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: '确定要将已勾选数据标记为已读吗？',
          onOk: async () => {
            try {
              await mark(ids);
              createMessage.success('标记成功');
              handleSuccess();
            } catch (e) {}
          },
        });
      }

      // 弹出查看页面
      async function handleView(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record.autoRead) {
          await mark([record.id]);

          replace({
            name: RouteEnum.BASIC_MY_MSG_VIEW,
            params: { type: ActionEnum.VIEW, id: record.id },
          });
        }
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
        handleView,
        handleRead,
        handleDelete,
        handleBatchDelete,
        handleSuccess,
      };
    },
  });
</script>
