<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'sessionTime'">
          <span>{{ record.sessionTime }}</span>
          <br />
          <b style="color: green">{{ record.sessionStr }}</b>
        </template>
        <template v-if="column.dataIndex === 'expireTime'">
          <span>{{ record.expireTime }}</span>
          <br />
          <b style="color: green">{{ record.expireStr }}</b>
        </template>
        <template v-if="column.dataIndex === 'count'">
          <Tag color="processing" @click="handleShowToken(record)">
            {{ record.terminalList?.length }}个
          </Tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: t('devOperation.tenant.defUser.kickOff'),
                onClick: handleKickout.bind(null, record),
                auth: RoleEnum.TENANT_SYSTEM_ONLINE_KICKOUT,
              },
              {
                label: t('devOperation.tenant.defUser.logout'),
                onClick: handleLogout.bind(null, record),
                auth: RoleEnum.TENANT_SYSTEM_ONLINE_LOGOUT,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <TokenModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { page, kickout, logout } from '/@/api/devOperation/system/online';
  import { columns, searchFormSchema } from './data';
  import TokenModal from './Edit.vue';
  import { RoleEnum } from '/@/enums/roleEnum';

  export default defineComponent({
    name: '在线用户',
    components: { BasicTable, PageWrapper, TokenModal, TableAction, Tag },
    setup() {
      const { t } = useI18n();
      const { createConfirm } = useMessage();
      const [registerModal, { openModal }] = useModal();

      // 表格
      const [registerTable, { reload }] = useTable({
        title: '在线用户',
        api: page,
        columns: columns(),
        beforeFetch: handleFetchParams,
        useSearchForm: true,
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
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        actionColumn: {
          width: 250,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      function handleKickout(record: Recordable, e: Event) {
        e?.stopPropagation();
        createConfirm({
          iconType: 'warning',
          content: '确定将该用户踢下线吗？',
          onOk: async () => {
            await kickout(record.loginId);
            reload();
          },
        });
      }

      function handleLogout(record: Recordable, e: Event) {
        e?.stopPropagation();
        createConfirm({
          iconType: 'warning',
          content: '确定将该用户强制注销吗？',
          onOk: async () => {
            await logout(record.loginId);
            reload();
          },
        });
      }

      function handleShowToken(record: Recordable) {
        openModal(true, { sessionId: record.id });
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      return {
        t,
        registerTable,
        registerModal,
        handleKickout,
        handleShowToken,
        handleLogout,
        handleSuccess,
        RoleEnum,
      };
    },
  });
</script>
