<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">
          申请创建自己的企业
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
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: () => {
                  return [
                    TenantStatusEnum.WITHDRAW,
                    TenantStatusEnum.WAITING,
                    TenantStatusEnum.REFUSE,
                  ].includes(record.status);
                },
              },
              {
                tooltip: '撤回',
                icon: 'ant-design:rollback-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认要撤回审批',
                  confirm: handleWithdraw.bind(null, record),
                },
                ifShow: () => {
                  return record.status === TenantStatusEnum.WAITING;
                },
              },
              {
                tooltip: '发起审批',
                icon: 'ant-design:audit-outlined',
                popConfirm: {
                  title: '是否确认要重新发起审批',
                  confirm: handleRelaunch.bind(null, record),
                },
                ifShow: () => {
                  return [TenantStatusEnum.WITHDRAW, TenantStatusEnum.REFUSE].includes(
                    record.status,
                  );
                },
              },
              {
                tooltip: t('common.title.edit'),
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
            ]"
            :stopButtonPropagation="true"
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
  import { TenantStatusEnum } from '/@/enums/biz/tenant';
  import { page, remove, updateStatus } from '/@/api/devOperation/tenant/myTenant';
  import { columns, searchFormSchema } from './tenant.data';
  import EditModal from './Edit.vue';

  export default defineComponent({
    name: '我的企业',
    components: {
      BasicTable,
      PageWrapper,
      EditModal,
      TableAction,
    },
    setup() {
      const { t } = useI18n();
      const [registerDrawer, { openDrawer }] = useDrawer();

      const { createMessage } = useMessage();

      const [registerTable, { reload }] = useTable({
        title: '我的企业',
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
        titleHelpMessage: [
          '成为企业步骤：',
          '1. 新增企业',
          '2. 等待平台方管理员(lamp)审核',
          '3. 运营者登录【开发运营系统】-【租户管理】-【租户维护】，并审批通过',
          '4. 运营者初始化数据源',
          '5. 运营者绑定您的账号为租户管理员',
          '6. 运营者通知您重新登录系统',
        ],
        clickToRowSelect: false,
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        actionColumn: {
          width: 120,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          type: ActionEnum.EDIT,
        });
      }

      async function handleDelete(record: Recordable) {
        await remove([record.id]);
        createMessage.success(t('common.tips.deleteSuccess'));
        handleSuccess();
      }

      async function handleWithdraw(record: Recordable) {
        await updateStatus({ id: record.id, status: TenantStatusEnum.WITHDRAW });
        createMessage.success('撤回成功');
        handleSuccess();
      }

      async function handleRelaunch(record: Recordable) {
        await updateStatus({ id: record.id, status: TenantStatusEnum.WAITING });
        createMessage.success('发起审批成功');
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      return {
        TenantStatusEnum,
        t,
        registerTable,
        registerDrawer,
        handleAdd,
        handleEdit,
        handleDelete,
        handleWithdraw,
        handleRelaunch,
        handleSuccess,
      };
    },
  });
</script>
