<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          color="error"
          v-hasAnyPermission="[RoleEnum.TENANT_USER_DELETE]"
          @click="handleBatchDelete"
          >{{ t('common.title.delete') }}
        </a-button>
        <a-button type="primary" v-hasAnyPermission="[RoleEnum.TENANT_USER_ADD]" @click="handleAdd"
          >{{ t('common.title.add') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: t('common.title.view'),
                onClick: handleView.bind(null, record),
                auth: RoleEnum.TENANT_USER_VIEW,
              },
            ]"
            :dropDownActions="[
              {
                label: '重置密码',
                icon: 'ant-design:rest-filled',
                onClick: handleResetPwd.bind(null, record),
                auth: RoleEnum.TENANT_USER_RESET_PWD,
              },
              {
                label: t('common.title.edit'),
                icon: 'ant-design:edit-outlined',
                onClick: handleEdit.bind(null, record),
                auth: RoleEnum.TENANT_USER_EDIT,
              },
              {
                label: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                onClick: handleCopy.bind(null, record),
                auth: RoleEnum.TENANT_USER_ADD,
              },
              {
                label: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                auth: RoleEnum.TENANT_USER_DELETE,
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
    <RestPasswordModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { page, remove } from '/@/api/devOperation/tenant/defUser';
  import { columns, searchFormSchema } from './defUser.data';
  import { RoleEnum } from '/@/enums/roleEnum';
  import EditModal from './Edit.vue';
  import RestPasswordModal from './RestPassword.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '用户维护',
    components: { BasicTable, PageWrapper, EditModal, RestPasswordModal, TableAction },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModal, { openModal }] = useModal();

      // 表格
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: t('devOperation.tenant.defUser.table.title'),
        api: page,
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
          width: 120,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
        titleHelpMessage: [
          '1. 新增用户只存def_user表',
          '2. 初始密码统一为：123456',
          '3. 可以使用用户名、手机、邮箱、身份证登录',
          '4. 用户禁用后，将不能登录系统',
        ],
      });

      // 弹出复制页面
      function handleCopy(record: Recordable, e: Event) {
        e?.stopPropagation();
        openDrawer(true, {
          record,
          type: ActionEnum.COPY,
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

      // 弹出新增页面
      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
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

      // 重置密码
      function handleResetPwd(record: Recordable) {
        openModal(true, { record });
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

      return {
        t,
        registerTable,
        registerDrawer,
        handleAdd,
        handleCopy,
        handleView,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        handleResetPwd,
        RoleEnum,
        registerModal,
      };
    },
  });
</script>
