<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '解绑',
                icon: 'ant-design:unlock-outlined',
                color: 'error',
                auth: RoleEnum.TENANT_TENANT_VIEW_UNBIND,
                popConfirm: {
                  title: '是否确认要解绑改用户？',
                  confirm: handleUnBind.bind(null, record),
                },
              },
            ]"
            :stopButtonPropagation="true"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { pageUser } from '/@/api/devOperation/tenant/defUser';
  import { userListColumns, userListSearchFormSchema } from './tenantView.data';
  import { bindUser } from '/@/api/basic/user/baseEmployee';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'TenantUserList',
    components: { BasicTable, PageWrapper, TableAction },
    setup() {
      const { t } = useI18n();

      const { currentRoute } = useRouter();
      const { createMessage } = useMessage();

      const tenantId = ref<string>('');

      // 表格
      const [registerTable, { reload }] = useTable({
        title: '企业下的用户信息',
        api: pageUser,
        columns: userListColumns(),
        formConfig: {
          labelWidth: 120,
          schemas: userListSearchFormSchema(),
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
        immediate: false,
        searchInfo: {
          tenantId,
        },
        defSort: {
          sort: '',
          order: '',
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        clickToRowSelect: false,
        rowSelection: {
          type: 'checkbox',
        },
        actionColumn: {
          width: 100,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      onMounted(() => {
        const { params } = currentRoute.value;
        const id = params.id as string;
        tenantId.value = id;
        reload();
      });

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      async function handleUnBind(record) {
        if (!tenantId.value) {
          createMessage.warn('请重新加载页面');
          return;
        }
        const userIdList = [record.id];

        if (userIdList && userIdList.length > 0) {
          const params = {
            tenantId: tenantId.value,
            userIdList,
            isBind: false,
          };
          await bindUser(params);
          createMessage.success('绑定成功');

          reload();
        } else {
          createMessage.warn('请选择用户');
        }
      }

      return {
        t,
        registerTable,
        handleSuccess,
        handleUnBind,
        RoleEnum,
      };
    },
  });
</script>
