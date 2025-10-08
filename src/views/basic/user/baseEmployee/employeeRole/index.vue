<template>
  <BasicModal
    :defaultFullscreen="true"
    :keyboard="true"
    :maskClosable="true"
    showFooter
    :title="t('basic.user.baseEmployee.bindRole')"
    v-bind="$attrs"
    width="70%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <div ref="wrapEl">
      <BasicTable @register="registerTable">
        <template #toolbar>
          <a-button color="error" type="primary" @click="handleBatchChoice">{{
            t('basic.user.baseEmployee.batchBinding')
          }}</a-button>
          <a-button type="primary" @click="handleBatchCancel">{{
            t('basic.user.baseEmployee.batchCancellation')
          }}</a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <TableAction
              :actions="[
                {
                  label: t('common.binding'),
                  onClick: handleBindRole.bind(null, record),
                  ifShow: () => {
                    return (
                      !isEmpty(formData.employeeId) && !formData.bindRoleIds.includes(record.id)
                    );
                  },
                },
                {
                  label: t('common.unbinding'),
                  onClick: handleUnBindRole.bind(null, record),
                  ifShow: () => {
                    return (
                      !isEmpty(formData.employeeId) && formData.bindRoleIds.includes(record.id)
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
  import { pageMyRole } from '/@/api/basic/system/baseRole';
  import { findEmployeeRoleByEmployeeId, saveEmployeeRole } from '/@/api/basic/user/baseEmployee';
  import { employeeRoleColumns, employeeRoleSearchFormSchema } from '../baseEmployee.data';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { isEmpty } from '/@/utils/is';
  import { ScopeTypeEnum } from '/@/enums/biz/base';

  export default defineComponent({
    name: 'EmployeeRoleIndex',
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
        employeeId: '',
        bindRoleIds: [] as string[],
      });

      // 表格
      const [registerTable, { getSelectRowKeys, clearSelectedRowKeys }] = useTable({
        title: '角色列表',
        api: pageMyRole,
        columns: employeeRoleColumns(),
        formConfig: {
          labelWidth: 70,
          schemas: employeeRoleSearchFormSchema(),
          baseColProps: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6 },
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
          employeeId: toRef(formData, 'employeeId'),
          scopeType: ScopeTypeEnum.EMPLOYEE,
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
        clearSelectedRowKeys();

        // 赋值
        formData.employeeId = data?.id;
        if (formData.employeeId) {
          formData.bindRoleIds = await findEmployeeRoleByEmployeeId(formData.employeeId);
        } else {
          createMessage.warn(t('common.rules.role'));
        }
      });

      function handleSuccess() {}

      async function bindRole(flag: boolean, roleIdList: string[]) {
        try {
          openWrapLoading();
          formData.bindRoleIds = await saveEmployeeRole({
            flag,
            roleIdList,
            employeeId: formData.employeeId,
          });
          createMessage.success(t('sys.api.operationSuccess'));
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

      function handleBindRole(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          bindRole(true, [record.id]);
        }
      }

      function handleUnBindRole(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          bindRole(false, [record.id]);
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
          content: t('basic.user.baseEmployee.bindConfirm'),
          onOk: async () => {
            await bindRole(false, ids);
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
          content: t('basic.user.baseEmployee.unBindConfirm'),
          onOk: async () => {
            await bindRole(true, ids);
          },
        });
      }

      return {
        formData,
        t,
        wrapEl,
        isEmpty,
        registerModal,
        registerTable,
        handleBindRole,
        handleUnBindRole,
        handleSubmit,
        handleBatchCancel,
        handleBatchChoice,
      };
    },
  });
</script>
