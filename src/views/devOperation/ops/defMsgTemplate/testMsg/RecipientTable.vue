<template>
  <VxeBasicTable ref="tableRef" v-bind="gridOptions">
    <template #action="{ row }">
      <TableAction outside :actions="createActions(row)" />
    </template>
  </VxeBasicTable>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { recipientTableColumns } from './kvdata';
  import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '/@/components/VxeTable';

  const tableRef = ref<VxeGridInstance>();

  const emit = defineEmits(['change', 'update:value']);

  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    keepSource: true,
    editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
    columns: recipientTableColumns(emit, tableRef),
    toolbarConfig: {
      export: false,
      zoom: false,
      print: false,
      refresh: false,
      custom: false,
      buttons: [
        {
          content: '添加',
          buttonRender: {
            name: 'AButton',
            props: {
              type: 'warning',
            },
            events: {
              click: () => {
                tableRef.value?.insertAt({}, -1);
              },
            },
          },
        },
      ],
    },
    formConfig: {
      enabled: false,
    },
    height: '300px',
    proxyConfig: {},
  });

  const initData = async () => {
    await tableRef.value?.remove();
  };

  // 操作按钮（权限控制）
  const createActions = (record) => {
    const actions: ActionItem[] = [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '是否确认删除',
          confirm: () => {
            tableRef.value?.remove(record);

            const recordset = tableRef.value?.getRecordset();
            emit('change', recordset?.insertRecords);
            emit('update:value', recordset?.insertRecords);
          },
        },
      },
    ];

    return actions;
  };

  defineExpose({
    initData,
  });
</script>
