<template>
  <BasicModal
    v-bind="$attrs"
    width="70%"
    @register="registerModal"
    title="Token列表"
    :maskClosable="false"
    @ok="handleSubmit"
    :keyboard="true"
    :showCancelBtn="false"
  >
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
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '踢下线',
                onClick: handleKickout.bind(null, record),
                auth: RoleEnum.TENANT_SYSTEM_ONLINE_KICKOUT,
              },
              {
                label: '强制注销',
                onClick: handleLogout.bind(null, record),
                auth: RoleEnum.TENANT_SYSTEM_ONLINE_LOGOUT,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { getTokenSignList, kickout, logout } from '/@/api/devOperation/system/online';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { tokenListColumns } from './data';
  import { RoleEnum } from '/@/enums/roleEnum';

  export default defineComponent({
    name: 'Token列表',
    components: { BasicModal, BasicTable, TableAction },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createConfirm } = useMessage();
      const sessionId = ref<string>('');
      // 表格
      const [registerTable, { reload }] = useTable({
        title: 'Token列表',
        api: getTokenSignList,
        columns: tokenListColumns(),
        beforeFetch: handleFetchParams,
        searchInfo: {
          sessionId: sessionId,
        },
        useSearchForm: false,
        showTableSetting: true,
        bordered: true,
        rowKey: 'value',
        actionColumn: {
          width: 200,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (row) => {
        setModalProps({ confirmLoading: false });
        sessionId.value = row.sessionId;
        reload();
      });

      async function handleSubmit() {
        emit('success');
        closeModal();
      }

      function handleKickout(record: Recordable, e: Event) {
        e?.stopPropagation();
        createConfirm({
          iconType: 'warning',
          content: '确定将该用户踢下线吗？',
          onOk: async () => {
            await kickout(undefined, record.value);
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
            await logout(undefined, record.value);
            reload();
          },
        });
      }

      return {
        t,
        registerTable,
        handleKickout,
        handleLogout,
        registerModal,
        handleSubmit,
        RoleEnum,
      };
    },
  });
</script>
