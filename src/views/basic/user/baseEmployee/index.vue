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
          v-hasAnyPermission="[RoleEnum.EMPLOYEE_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.EMPLOYEE_ADD]"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleAdd"
        >
          {{ t('common.title.add') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.INVITATION_USER]"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleInvitation"
        >
          邀请
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'orgNameList'">
          <span>
            <Tag
              v-for="(orgName, index) in record?.echoMap?.orgIdList"
              :key="index"
              class="mr-2"
              color="success"
            >
              {{ orgName }}
            </Tag>
          </span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: t('common.title.view'),
                icon: 'ant-design:search-outlined',
                onClick: handleView.bind(null, record),
                auth: RoleEnum.EMPLOYEE_VIEW,
              },
              {
                label: '绑定角色',
                icon: 'ant-design:search-outlined',
                onClick: handleBindRole.bind(null, record),
                auth: RoleEnum.EMPLOYEE_BIND_ROLE,
              },
            ]"
            :dropDownActions="[
              {
                label: '重置密码',
                icon: 'ant-design:rest-filled',
                onClick: handleResetPwd.bind(null, record),
                auth: RoleEnum.EMPLOYEE_REST_PWD,
              },
              {
                label: t('common.title.edit'),
                icon: 'ant-design:edit-outlined',
                onClick: handleEdit.bind(null, record),
                auth: RoleEnum.EMPLOYEE_EDIT,
              },
              {
                label: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                onClick: handleCopy.bind(null, record),
                auth: RoleEnum.EMPLOYEE_ADD,
              },
              {
                label: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                auth: RoleEnum.EMPLOYEE_DELETE,
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
    <EditModal @register="registerDrawer" @success="handleSuccess" />
    <InvitationUserModal @register="registerInvitationModal" @success="handleSuccess" />
    <EmployeeRole @register="registerModal" @success="handleSuccess" />
    <RestPasswordModal @register="registerRestPwdModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, computed, ref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { page, remove } from '/@/api/basic/user/baseEmployee';
  import EmployeeRole from './employeeRole/index.vue';
  import { columns, searchFormSchema } from './baseEmployee.data';
  import EditModal from './Edit.vue';
  import InvitationUserModal from './InvitationUser.vue';
  import BaseOrgTree from '../baseOrg/Tree.vue';
  import RestPasswordModal from './RestPassword.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '员工维护',
    components: {
      BasicTable,
      PageWrapper,
      EditModal,
      InvitationUserModal,
      TableAction,
      Tag,
      EmployeeRole,
      BaseOrgTree,
      RestPasswordModal,
    },
    setup() {
      const { t } = useI18n();
      const searchInfo = reactive<Recordable>({});
      const currentOrg = ref<Recordable>({});
      const { createMessage, createConfirm } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      // 绑定角色
      const [registerModal, { openModal }] = useModal();
      const [registerRestPwdModal, { openModal: openRestPwdModal }] = useModal();
      const [registerInvitationModal, { openModal: openInvitationModal }] = useModal();
      const getTitle = computed(() => {
        return (
          (currentOrg.value?.name ? `【${currentOrg.value?.name}】的` : '') +
          t('basic.user.baseEmployee.table.title')
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
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        clickToRowSelect: false,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        searchInfo,
        titleHelpMessage: [
          '1. 新增员工，会同时新增一条def_user表数据',
          '2. 初始密码统一为：123456',
          '3. 可以使用用户名、手机、邮箱、身份证登录',
        ],
        actionColumn: {
          width: 220,
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

      // 重置密码
      function handleResetPwd(record: Recordable) {
        const row = { ...record };
        row.id = row.userId;
        openRestPwdModal(true, { record: row });
      }
      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        openDrawer(true, {
          record,
          type: ActionEnum.EDIT,
        });
      }

      // 弹出绑定角色页面
      function handleBindRole(record: Recordable, e: Event) {
        e?.stopPropagation();
        openModal(true, record);
      }

      // 弹出邀请用户框
      function handleInvitation(record: Recordable, e: Event) {
        e?.stopPropagation();
        openInvitationModal(true, record);
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
        registerModal,
        registerInvitationModal,
        registerRestPwdModal,
        handleView,
        handleAdd,
        handleCopy,
        handleEdit,
        handleResetPwd,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        handleBindRole,
        handleInvitation,
        RoleEnum,
        handleOrgSelect,
        handleReset,
      };
    },
  });
</script>
