<template>
  <BasicModal
    :defaultFullscreen="true"
    :keyboard="true"
    :maskClosable="true"
    showFooter
    title="绑定员工"
    v-bind="$attrs"
    width="70%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <div ref="wrapEl">
      <BasicTable @register="registerTable">
        <template #toolbar>
          <a-button color="error" type="primary" @click="handleBatchChoice">批量绑定</a-button>
          <a-button type="primary" @click="handleBatchCancel">批量取消</a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <TableAction
              :actions="[
                {
                  label: '绑定',
                  onClick: handleBindUser.bind(null, record),
                  ifShow: () => {
                    return (
                      !isEmpty(formData.roleId) && !formData.bindEmployeeIds.includes(record.id)
                    );
                  },
                },
                {
                  label: '取消绑定',
                  onClick: handleUnBindUser.bind(null, record),
                  ifShow: () => {
                    return (
                      !isEmpty(formData.roleId) && formData.bindEmployeeIds.includes(record.id)
                    );
                  },
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRef } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useLoading } from '/@/components/Loading';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { page } from '/@/api/basic/user/baseEmployee';
  import { findEmployeeIdByRoleId, saveRoleEmployee } from '/@/api/basic/system/baseRole';
  import { roleEmployeeColumns, roleEmployeeSearchFormSchema } from '../baseRole.data';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { isEmpty } from '/@/utils/is';

  export default defineComponent({
    name: 'RoleEmployeeIndex',
    components: { BasicModal, BasicTable, TableAction },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const wrapEl = ref<ElRef>(null);
      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEl,
        props: {
          tip: '加载中...',
          absolute: true,
        },
      });

      const formData = reactive({
        roleId: '',
        bindEmployeeIds: [] as string[],
      });

      // 表格
      const [registerTable, { getSelectRowKeys }] = useTable({
        title: t('basic.user.baseEmployee.table.title'),
        api: page,
        columns: roleEmployeeColumns(),
        formConfig: {
          labelWidth: 70,
          schemas: roleEmployeeSearchFormSchema(),
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
        showIndexColumn: true,
        useSearchForm: true,
        showTableSetting: true,
        pagination: {
          pageSize: 10,
        },
        searchInfo: {
          roleId: toRef(formData, 'roleId'),
        },
        canResize: false,
        bordered: true,
        clickToRowSelect: false,
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

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });

        // 赋值
        formData.roleId = data?.id;
        if (formData.roleId) {
          formData.bindEmployeeIds = await findEmployeeIdByRoleId(formData.roleId);
        } else {
          createMessage.warn('请选择角色');
        }
      });

      function handleSuccess() {}

      async function bindUser(flag: boolean, employeeIdList: string[]) {
        try {
          openWrapLoading();
          formData.bindEmployeeIds = await saveRoleEmployee({
            flag,
            employeeIdList,
            roleId: formData.roleId,
          });
          createMessage.success('操作成功');
          handleSuccess();
        } finally {
          closeWrapLoading();
        }
      }

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      function handleBindUser(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          bindUser(true, [record.id]);
        }
      }

      function handleUnBindUser(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          bindUser(false, [record.id]);
        }
      }

      function handleBatchCancel() {
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: '确认要批量绑定选中的员工吗?',
          onOk: async () => {
            await bindUser(false, ids);
          },
        });
      }

      function handleBatchChoice() {
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: '确认要批量解绑选中的员工吗?',
          onOk: async () => {
            await bindUser(true, ids);
          },
        });
      }

      return {
        formData,
        t,
        isEmpty,
        wrapEl,
        registerModal,
        registerTable,
        handleBindUser,
        handleUnBindUser,
        handleSubmit,
        handleBatchCancel,
        handleBatchChoice,
      };
    },
  });
</script>
