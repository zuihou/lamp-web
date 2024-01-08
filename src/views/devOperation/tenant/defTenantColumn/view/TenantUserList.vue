<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { pageUser } from '/@/api/devOperation/tenant/defUser';
  import { userListColumns, userListSearchFormSchema } from './tenantView.data';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'TenantUserList',
    components: { BasicTable, PageWrapper },
    setup() {
      const { t } = useI18n();

      const { currentRoute } = useRouter();

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
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        // actionColumn: {
        //   width: 200,
        //   title: t('common.column.action'),
        //   dataIndex: 'action',
        //   slots: { customRender: 'action' },
        // },
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

      return {
        t,
        registerTable,
        handleSuccess,
      };
    },
  });
</script>
