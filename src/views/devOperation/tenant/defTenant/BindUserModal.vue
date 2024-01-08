<template>
  <BasicModal
    v-bind="$attrs"
    okText="绑定"
    @register="registerModal"
    title="将尚未成为该企业的用户，绑定为此企业的租户管理员"
    @ok="handleSubmit"
    :maskClosable="false"
    :keyboard="true"
    defaultFullscreen
    width="80%"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { findNotUserByTenantId } from '/@/api/devOperation/tenant/defUser';
  import { userColumns, userSearchFormSchema } from './tenant.data';
  import { bindUser } from '/@/api/basic/user/baseEmployee';

  export default defineComponent({
    name: 'BindUserModal',
    components: { BasicModal, BasicTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const tenantId = ref<string>('');
      const { createMessage } = useMessage();
      const [registerTable, { reload, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
        title: '尚未成为此企业员工的用户',
        api: findNotUserByTenantId,
        columns: userColumns,
        formConfig: {
          labelWidth: 120,
          schemas: userSearchFormSchema,
          baseColProps: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8 },
          autoSubmitOnEnter: true,
          resetButtonOptions: {
            preIcon: 'ant-design:rest-outlined',
          },
          submitButtonOptions: {
            preIcon: 'ant-design:search-outlined',
          },
        },
        beforeFetch: handleFetchParams,
        searchInfo: {
          tenantId,
        },
        pagination: {
          pageSize: 10,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        immediate: false,
        canResize: false,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        clearSelectedRowKeys();
        tenantId.value = data.record.id;
        reload();
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          const userIdList = getSelectRowKeys();

          if (userIdList && userIdList.length > 0) {
            const params = {
              tenantId: tenantId.value,
              userIdList,
              isBind: true,
            };
            await bindUser(params);
            createMessage.success('绑定成功');
            closeModal();
            emit('success');
          } else {
            createMessage.warn('请选择用户');
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { t, registerModal, registerTable, handleSubmit };
    },
  });
</script>
