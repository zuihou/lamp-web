<template>
  <div class="overflow-hidden">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-if="dictId"
          v-hasPermission="[RoleEnum.BASIC_DICT_ITEM_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
          >{{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-if="dictId"
          v-hasPermission="[RoleEnum.BASIC_DICT_ITEM_ADD]"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleAdd"
          >{{ t('common.title.add') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'state'">
          <Badge
            :status="record.state ? 'success' : 'error'"
            :text="record.state ? t('lamp.common.enable') : t('lamp.common.disable')"
          />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: t('common.title.edit'),
                icon: 'clarity:note-edit-line',
                auth: RoleEnum.BASIC_DICT_ITEM_EDIT,
                onClick: handleEdit.bind(null, record),
              },
              {
                tooltip: t('common.title.copy'),
                icon: 'ant-design:copy-outlined',
                auth: RoleEnum.BASIC_DICT_ITEM_ADD,
                onClick: handleCopy.bind(null, record),
              },
              {
                tooltip: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                color: 'error',
                auth: RoleEnum.BASIC_DICT_ITEM_DELETE,
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: () => {
                  return record?.classify === DictClassifyEnum.BUSINESS;
                },
              },
            ]"
            :stopButtonPropagation="true"
          />
        </template>
      </template>
    </BasicTable>
    <EditModal @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRaw } from 'vue';
  import { Badge, Descriptions } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { DictClassifyEnum } from '/@/enums/biz/base';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { page, remove } from '/@/api/basic/base/baseDictItem';
  import { columns, searchFormSchema } from './baseDictItem.data';
  import EditModal from './Edit.vue';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'BaseDictItemManagement',
    components: {
      BasicTable,
      EditModal,
      TableAction,
      Badge,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      // 编辑页弹窗
      const [registerDrawer, { openDrawer }] = useDrawer();
      const dictId = ref<string>('');
      const dict = reactive<Recordable>({
        name: '',
        key: '',
        id: '',
      });

      // 表格
      const [registerTable, { reload, getSelectRowKeys, setTableData }] = useTable({
        title: () => {
          return dict.name ? `字典【${dict.name}】的明细列表` : '请选择字典';
        },
        api: page,
        columns: columns(),
        formConfig: {
          name: 'dictItemSearch',
          labelWidth: 80,
          schemas: searchFormSchema(),
          baseColProps: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8 },
          autoSubmitOnEnter: true,
          resetButtonOptions: {
            preIcon: 'ant-design:rest-outlined',
          },
          submitButtonOptions: {
            preIcon: 'ant-design:search-outlined',
          },
        },
        immediate: false,
        beforeFetch: handleFetchParams,
        searchInfo: {
          parentId: dictId,
        },
        defSort: {
          sort: 'sortValue',
          order: 'ascend',
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          columnWidth: 40,
        },
        actionColumn: {
          width: 160,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      function fetch(row: Recordable) {
        if (row && row.id) {
          if (dictId.value !== (row?.id as string)) {
            dictId.value = row?.id as string;
            dict.name = row?.name;
            dict.key = row?.key;
            dict.id = row?.id;
            reload();
          }
        } else {
          dictId.value = '';
          dict.name = '';
          setTableData([]);
        }
      }

      // 弹出复制页面
      function handleCopy(record: Recordable, e: Event) {
        e?.stopPropagation();
        record.parentId = dictId.value;
        openDrawer(true, {
          record,
          type: ActionEnum.COPY,
          parent: toRaw(dict),
        });
      }

      // 弹出新增页面
      function handleAdd() {
        openDrawer(true, {
          type: ActionEnum.ADD,
          record: { parentId: dictId.value },
          parent: toRaw(dict),
        });
      }

      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        record.parentId = dictId.value;
        openDrawer(true, {
          record,
          type: ActionEnum.EDIT,
          parent: toRaw(dict),
        });
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      async function batchDelete(ids: any[]) {
        await remove(ids);
        createMessage.success(t('common.tips.deleteSuccess'));
        handleSuccess();
      }

      // 点击单行删除
      function handleDelete(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record?.id) {
          batchDelete([record.id]);
        }
      }

      // 点击批量删除
      function handleBatchDelete() {
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        createConfirm({
          iconType: 'warning',
          content: t('common.tips.confirmDelete'),
          onOk: async () => {
            await batchDelete(ids);
          },
        });
      }

      return {
        t,
        dict,
        dictId,
        fetch,
        registerTable,
        registerDrawer,
        handleAdd,
        handleCopy,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        DictClassifyEnum,
        RoleEnum,
      };
    },
  });
</script>
<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-basic-table';

  .@{prefix-cls} {
    &-form-container {
      padding: 16px 16px 16px 0;
    }
  }
</style>
