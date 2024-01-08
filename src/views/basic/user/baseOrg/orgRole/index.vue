<template>
  <BasicModal
    :defaultFullscreen="true"
    :keyboard="true"
    :maskClosable="true"
    showFooter
    title="绑定角色"
    v-bind="$attrs"
    width="70%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <div ref="wrapEl">
      <BasicTable
        :titleHelpMessage="[
          '解决某些场景需要给部门分配权限',
          '给部门绑定初始的角色后，该部门下的员工便拥有此部门的角色权限',
        ]"
        @register="registerTable"
      >
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
                  onClick: handleBindRole.bind(null, record),
                  ifShow: () => {
                    return !isEmpty(formData.orgId) && !formData.bindRoleIds.includes(record.id);
                  },
                },
                {
                  label: '取消绑定',
                  onClick: handleUnBindRole.bind(null, record),
                  ifShow: () => {
                    return !isEmpty(formData.orgId) && formData.bindRoleIds.includes(record.id);
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
  import { findOrgRoleByOrgId, saveOrgRole } from '/@/api/basic/user/baseOrg';
  import { orgRoleColumns, orgRoleSearchFormSchema } from '../baseOrg.data';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { isEmpty } from '/@/utils/is';
  import { ScopeTypeEnum } from '/@/enums/biz/base';

  export default defineComponent({
    name: 'OrgRoleIndex',
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
        orgId: '',
        bindRoleIds: [] as string[],
      });

      // 表格
      const [registerTable, { getSelectRowKeys }] = useTable({
        title: '角色列表',
        api: pageMyRole,
        columns: orgRoleColumns(),
        formConfig: {
          labelWidth: 70,
          schemas: orgRoleSearchFormSchema(),
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
          orgId: toRef(formData, 'orgId'),
          scopeType: ScopeTypeEnum.ORG,
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
        formData.orgId = data?.id;
        if (formData.orgId) {
          formData.bindRoleIds = await findOrgRoleByOrgId(formData.orgId);
        } else {
          createMessage.warn('请选择角色');
        }
      });

      function handleSuccess() {}

      async function bindRole(flag: boolean, roleIdList: string[]) {
        try {
          openWrapLoading();
          formData.bindRoleIds = await saveOrgRole({
            flag,
            roleIdList,
            orgId: formData.orgId,
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
          content: '确认要批量绑定选中的角色吗?',
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
          content: '确认要批量解绑选中的角色吗?',
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
