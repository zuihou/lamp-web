<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_TENANT_ADD]"
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
                icon: 'ant-design:search-outlined',
                tooltip: '查看',
                onClick: handleView.bind(null, record),
                auth: RoleEnum.TENANT_TENANT_VIEW,
              },
              {
                icon: 'ant-design:audit-outlined',
                tooltip: '审核',
                onClick: handleToExamine.bind(null, record),
                ifShow: () => {
                  return [TenantStatusEnum.WAITING].includes(record?.status);
                },
                auth: RoleEnum.TENANT_TENANT_TO_EXAMINE,
              },
              {
                icon: 'ant-design:database-outlined',
                tooltip: '初始化租户数据库表结构和初始数据',
                onClick: handleInitData.bind(null, record),
                ifShow: () => {
                  return [TenantStatusEnum.WAIT_INIT_SCHEMA].includes(record?.status);
                },
                auth: RoleEnum.TENANT_TENANT_INIT_DATA,
              },
              {
                icon: 'ant-design:cloud-upload-outlined',
                tooltip: '初始化其他服务的数据源',
                onClick: handleLinkDataSource.bind(null, record),
                ifShow: () => {
                  return [
                    TenantStatusEnum.NORMAL,
                    TenantStatusEnum.WAIT_INIT_DATASOURCE,
                    TenantStatusEnum.AGREED,
                  ].includes(record?.status);
                },
                auth: RoleEnum.TENANT_TENANT_INIT_DATA_SOURCE,
              },
              {
                tooltip: t('common.title.edit'),
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                auth: RoleEnum.TENANT_TENANT_EDIT,
              },
              {
                tooltip: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
                auth: RoleEnum.TENANT_TENANT_DELETE,
              },
              {
                tooltip: '绑定用户为租户管理员',
                icon: 'ant-design:usergroup-add-outlined',
                color: 'warning',
                onClick: handleBindUser.bind(null, record),
                ifShow: () => {
                  return [TenantStatusEnum.NORMAL].includes(record?.status);
                },
                auth: RoleEnum.TENANT_TENANT_BIND_USER,
              },
            ]"
            :stopButtonPropagation="true"
          />
        </template>
      </template>
    </BasicTable>
    <EditModal @register="registerDrawer" @success="handleSuccess" />
    <InitDataModal @register="registerInitModal" @success="handleInitSuccess" />
    <LinkDataSourceModal @register="registerLinkDrawer" @success="handleSuccess" />
    <BindUserModal @register="registerModal" @success="handleSuccess" />
    <ToExamineModal @register="registerToExamineModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { RouteEnum, TenantStatusEnum } from '/@/enums/biz/tenant';
  import { page, remove } from '/@/api/devOperation/tenant/tenant';
  import { columns, searchFormSchema } from './tenant.data';
  import { RoleEnum } from '/@/enums/roleEnum';
  import EditModal from './Edit.vue';
  import InitDataModal from './InitData.vue';
  import LinkDataSourceModal from './LinkDataSource.vue';
  import BindUserModal from './BindUserModal.vue';
  import ToExamineModal from './ToExamineModal.vue';

  export default defineComponent({
    name: '租户维护',
    components: {
      BasicTable,
      PageWrapper,
      EditModal,
      TableAction,
      InitDataModal,
      LinkDataSourceModal,
      BindUserModal,
      ToExamineModal,
    },
    setup() {
      const { t } = useI18n();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModal, { openModal }] = useModal();
      const [registerToExamineModal, { openModal: openToExamineModal }] = useModal();
      const [registerLinkDrawer, { openDrawer: openLinkDrawer }] = useDrawer();
      const [registerInitModal, { openModal: openInitModal }] = useModal();

      const { replace } = useRouter();
      const { createMessage } = useMessage();

      const [registerTable, { reload }] = useTable({
        title: t('devOperation.tenant.defTenant.table.title'),
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
          '新建企业步骤：',
          '1. 新建企业',
          '2. 初始化数据',
          '3. 初始化数据源',
          '4. 绑定用户',
          '5. 使用绑定的用户登录',
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
          width: 220,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      function handleInitData(record: Recordable) {
        openInitModal(true, { record });
      }

      function handleLinkDataSource(record: Recordable) {
        openLinkDrawer(true, { record });
      }

      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
        });
      }

      function handleView(record: Recordable) {
        replace({
          name: RouteEnum.TENANT_VIEW,
          params: { id: record.id },
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          type: ActionEnum.EDIT,
        });
      }

      function handleDelete(record: Recordable) {
        if (record.readonly) {
          createMessage.warn('内置超级租户，禁止删除');
          return;
        }
        remove([record.id]).then(() => {
          createMessage.success(t('common.tips.deleteSuccess'));
          handleSuccess();
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleInitSuccess() {
        reload();
      }

      function handleBindUser(record: Recordable) {
        openModal(true, { record });
      }

      function handleToExamine(record: Recordable) {
        openToExamineModal(true, { record });
      }

      return {
        TenantStatusEnum,
        t,
        registerTable,
        registerDrawer,
        registerModal,
        registerInitModal,
        registerLinkDrawer,
        registerToExamineModal,
        handleAdd,
        handleView,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleInitSuccess,
        handleInitData,
        handleLinkDataSource,
        handleBindUser,
        handleToExamine,
        RoleEnum,
      };
    },
  });
</script>
