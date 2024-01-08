<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.APPLICATION_AUTHORIZE_GRANT]"
          type="primary"
          @click="handleAuthorize"
          >授权
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.APPLICATION_AUTHORIZE_CANCEL]"
          color="error"
          @click="handleBatchCancelAuthorize"
          >取消授权
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'expired'">
          <Tag :color="record.expired ? 'warning' : 'success'">
            {{ record.expired ? '已过期' : '未过期' }}
          </Tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '取消授权',
                color: 'error',
                auth: RoleEnum.APPLICATION_AUTHORIZE_CANCEL,
                popConfirm: {
                  title: '是否确认取消授权？',
                  confirm: handleCancelAuthorize.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { cancel, page } from '/@/api/devOperation/application/defTenantApplicationRel';
  import { applicationColumns, applicationSearchFormSchema } from './tenantView.data';

  import { RouteEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'TenantApplicationList',
    components: { BasicTable, PageWrapper, TableAction, Tag },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();

      const { replace, currentRoute } = useRouter();

      const tenantId = ref<string>('');

      // 表格
      const [registerTable, { reload, getSelectRowKeys }] = useTable({
        title: t('devOperation.application.defTenantApplicationRel.table.title'),
        api: page,
        columns: applicationColumns(),
        formConfig: {
          labelWidth: 120,
          schemas: applicationSearchFormSchema(),
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
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        immediate: false,
        searchInfo: {
          tenantId: tenantId,
        },
        actionColumn: {
          width: 160,
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

      // 弹出授权
      function handleAuthorize() {
        replace({
          name: RouteEnum.APPLICATION_GRANT,
          query: { tenantId: unref(tenantId) },
        });
      }

      // 点击取消授权
      async function handleCancelAuthorize(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          await batchCancelAuthorize([record.id]);
        }
      }

      async function batchCancelAuthorize(ids: string[]) {
        await cancel(ids);
        createMessage.success('取消成功');
        handleSuccess();
      }

      function handleBatchCancelAuthorize() {
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: '是否确认要取消授权',
          onOk: async () => {
            await batchCancelAuthorize(ids);
          },
        });
      }

      // 授权成功回调
      function handleSuccess() {
        reload();
      }

      return {
        t,
        registerTable,
        handleAuthorize,
        handleCancelAuthorize,
        handleBatchCancelAuthorize,
        handleSuccess,
        RoleEnum,
      };
    },
  });
</script>
