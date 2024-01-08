<template>
  <div class="overflow-hidden">
    <BasicTable
      @register="registerTable"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-db-click="handleRowDbClick"
      @fetch-success="onFetchSuccess"
    >
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.SYSTEM_DICT_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.SYSTEM_DICT_ADD]"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleAdd"
        >
          {{ t('common.title.add') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.SYSTEM_DICT_EDIT]"
          preIcon="clarity:note-edit-line"
          type="primary"
          @click="handleEdit"
        >
          {{ t('common.title.edit') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'state'">
          <Badge
            :status="record.state ? 'success' : 'error'"
            :text="record.state ? t('lamp.common.enable') : t('lamp.common.disable')"
          />
        </template>
      </template>
    </BasicTable>
    <EditModal @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Badge } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { page, remove } from '/@/api/devOperation/system/defDict';
  import { columns, searchFormSchema } from './defDict.data';
  import EditModal from './Edit.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'DefDictManagement',
    components: { BasicTable, EditModal, Badge },
    emits: ['select'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer }] = useDrawer();

      // 表格
      const [registerTable, { reload, getSelectRowKeys, getSelectRows, setSelectedRowKeys }] =
        useTable({
          title: t('devOperation.system.defDict.table.title'),
          api: page,
          columns: columns(),
          formConfig: {
            name: 'dictSearch',
            labelWidth: 70,
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
          showTableSetting: false,
          bordered: true,
          rowKey: 'id',
          rowSelection: {
            type: 'radio',
            columnWidth: 40,
          },
        });

      // 弹出新增页面
      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
        });
      }

      // 弹出编辑页面
      function handleEdit() {
        const rows = getSelectRows();
        if (!rows || rows.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }

        openDrawer(true, {
          record: rows[0],
          type: ActionEnum.EDIT,
        });
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
            await batchDelete(ids);
          },
        });
      }

      // 选择事件
      function emitChange() {
        const selectedKeys = getSelectRows();
        emit('select', selectedKeys.length > 0 ? selectedKeys[0] : {});
      }

      // 勾选事件触发
      function handleSelectionChange() {
        emitChange();
      }

      // 单击行回调
      function handleRowClick(record: Recordable) {
        setSelectedRowKeys([record.id]);
        emitChange();
      }

      // 双击行回调
      function handleRowDbClick(record: Recordable) {
        setSelectedRowKeys([record.id]);
        const rows = getSelectRows();
        openDrawer(true, {
          record: rows[0],
          type: ActionEnum.EDIT,
        });
      }

      async function onFetchSuccess(result: Recordable) {
        // 请求之后对返回值进行处理
        if (result && result.items && result.items.length > 0) {
          await setSelectedRowKeys([result.items[0].id]);
          emitChange();
        }
      }

      return {
        t,
        registerTable,
        registerDrawer,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        handleSelectionChange,
        handleRowClick,
        handleRowDbClick,
        onFetchSuccess,
        RoleEnum,
      };
    },
  });
</script>
