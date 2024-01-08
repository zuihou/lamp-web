<template>
  <div class="m-4 mr-2 overflow-hidden bg-white">
    <BasicTable
      title-help-message="此页面会覆盖之前的授权，如需修改权限请使用'续期'功能"
      @register="registerTable"
      :rowSelection="{
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      }"
    >
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <template v-if="checkedKeys.length > 0">
              <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
              <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </Alert>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Alert } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable } from '/@/components/Table';

  import { page } from '/@/api/devOperation/tenant/tenant';
  import { TenantStatusEnum } from '/@/enums/biz/tenant';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { getTenantColumns } from '../defTenantApplicationRel.data';

  export default defineComponent({
    name: 'TenantList',
    components: { BasicTable, Alert },

    emits: ['select'],
    setup(_) {
      const { t } = useI18n();
      const { currentRoute } = useRouter();
      const checkedKeys = ref<Array<string | number>>([]);
      const tenantId = ref<string>('');
      const [registerTable, { getForm, reload }] = useTable({
        title: t('devOperation.tenant.defTenant.table.title'),
        api: page,
        columns: getTenantColumns(),
        beforeFetch: handleFetchParams,
        immediate: false,
        searchInfo: {
          status: TenantStatusEnum.NORMAL,
          id: tenantId,
        },
        showIndexColumn: false,
        rowKey: 'id',
      });

      onMounted(() => {
        const { query } = currentRoute.value;
        tenantId.value = query.tenantId as string;
        reload();
      });

      function onSelectChange(selectedRowKeys: (string | number)[]) {
        checkedKeys.value = selectedRowKeys;
      }

      return {
        t,
        checkedKeys,
        registerTable,
        onSelectChange,
        getForm,
      };
    },
  });
</script>
