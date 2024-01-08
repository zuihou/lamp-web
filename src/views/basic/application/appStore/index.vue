<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:search-outlined',
                tooltip: t('common.title.view'),
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'ant-design:menu-unfold-outlined',
                tooltip: '续期',
                onClick: handleRenewal.bind(null, record),
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
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { pageFindMyApplication } from '/@/api/devOperation/application/defApplication';
  import { columns, searchFormSchema } from './defApplication.data';
  import EditModal from './Edit.vue';

  export default defineComponent({
    name: '应用管理',
    components: { BasicTable, PageWrapper, EditModal, TableAction },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 表格
      const [registerTable, { reload }] = useTable({
        title: t('devOperation.application.defApplication.table.title'),
        api: pageFindMyApplication,
        columns: columns(),
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema(),
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
          width: 100,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      // 弹出编辑页面
      function handleView(record: Recordable, e: Event) {
        e?.stopPropagation();
        openDrawer(true, {
          record,
          type: ActionEnum.VIEW,
        });
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      function handleRenewal(_: Recordable, e: Event) {
        e?.stopPropagation();
        createMessage.success('请联系管理员');
      }

      return {
        t,
        registerTable,
        registerDrawer,
        handleView,
        handleSuccess,
        handleRenewal,
      };
    },
  });
</script>
