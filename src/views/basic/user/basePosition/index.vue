<template>
  <PageWrapper contentClass="flex" contentFullHeight dense fixedHeight>
    <BaseOrgTree
      ref="treeRef"
      class="md:w-1/5"
      query
      @reset="handleReset"
      @select="handleOrgSelect"
    />
    <BasicTable class="md:w-4/5" @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.POSITION_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
          >{{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.POSITION_ADD]"
          preIcon="ant-design:plus-outlined"
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
                tooltip: t('common.title.view'),
                icon: 'ant-design:search-outlined',
                onClick: handleView.bind(null, record),
                auth: RoleEnum.POSITION_VIEW,
              },
              {
                tooltip: t('common.title.edit'),
                icon: 'ant-design:edit-outlined',
                onClick: handleEdit.bind(null, record),
                auth: RoleEnum.POSITION_EDIT,
              },
              {
                tooltip: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                onClick: handleCopy.bind(null, record),
                auth: RoleEnum.POSITION_ADD,
              },
              {
                tooltip: t('common.title.delete'),
                color: 'error',
                icon: 'ant-design:delete-outlined',
                auth: RoleEnum.POSITION_DELETE,
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
  import { computed, defineComponent, reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { page, remove } from '/@/api/basic/user/basePosition';
  import { columns, searchFormSchema } from './basePosition.data';
  import EditModal from './Edit.vue';
  import BaseOrgTree from '../baseOrg/Tree.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '岗位维护',
    components: { BasicTable, PageWrapper, EditModal, TableAction, BaseOrgTree },
    setup() {
      const { t } = useI18n();
      const searchInfo = reactive<Recordable>({});
      const currentOrg = ref<Recordable>({});
      const { createMessage, createConfirm } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer }] = useDrawer();

      const getTitle = computed(() => {
        return (
          (currentOrg.value?.name ? `【${currentOrg.value?.name}】的` : '') +
          t('basic.user.basePosition.table.title')
        );
      });

      // 表格
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: getTitle,
        api: page,
        columns: columns(),
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema(),
          baseColProps: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8 },
          autoSubmitOnEnter: true,
          resetButtonOptions: {
            preIcon: 'ant-design:rest-outlined',
          },
          submitButtonOptions: {
            preIcon: 'ant-design:search-outlined',
          },
          alwaysShowLines: 1,
        },
        searchInfo,
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        clickToRowSelect: false,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
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
        openDrawer(true, {
          record,
          type: ActionEnum.COPY,
        });
      }

      // 弹出新增页面
      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
        });
      }

      // 弹出查看页面
      function handleView(record: Recordable, e: Event) {
        e?.stopPropagation();
        openDrawer(true, {
          record,
          type: ActionEnum.VIEW,
        });
      }

      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        openDrawer(true, {
          record,
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
            try {
              await batchDelete(ids);
            } catch (e) {}
          },
        });
      }

      function handleOrgSelect(_parent = {}, record = { id: '' }, childrenIds = []) {
        searchInfo.orgIdList = childrenIds;
        currentOrg.value = record;
        reload();
      }

      function handleReset() {
        searchInfo.orgIdList = [];
        currentOrg.value = {};
        reload();
      }

      return {
        t,
        registerTable,
        registerDrawer,
        handleView,
        handleAdd,
        handleCopy,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        RoleEnum,
        handleOrgSelect,
        handleReset,
      };
    },
  });
</script>
