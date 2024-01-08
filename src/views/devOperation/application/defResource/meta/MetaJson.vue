<template>
  <div class="meta-input">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-if="type !== ActionEnum.VIEW" type="primary" @click="handleAdd">
          {{ t('common.title.add') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: t('common.title.delete'),
                color: 'error',
                ifShow: () => type !== ActionEnum.VIEW,
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
              },
              {
                label: t('common.title.edit'),
                ifShow: () => type !== ActionEnum.VIEW,
                onClick: handleEdit.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <EditModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { forEach } from 'lodash-es';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { metaJsonColumns } from './defResourceMeta.data';
  import EditModal from './MetaEdit.vue';

  export default defineComponent({
    name: 'DefResourceMetaJson',
    components: { BasicTable, TableAction, EditModal },
    props: {
      value: {
        type: [Object, String],
      },
      type: {
        type: String as PropType<ActionEnum>,
        default: ActionEnum.ADD,
      },
    },
    emits: ['update:value', 'change'],
    setup(props, { emit }) {
      const [registerModal, { openModal }] = useModal();
      const { t } = useI18n();
      const keys = ref<Recordable[]>([]);
      const innerVal = ref<Recordable>({});

      const [registerTable] = useTable({
        title: '路由的 Meta 配置',
        dataSource: keys,
        scroll: { y: 250 },
        columns: metaJsonColumns,
        bordered: true,
        actionColumn: {
          width: 120,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      watch(
        () => props.value,
        (value: string) => {
          innerVal.value = JSON.parse(value || '{}');
          const list: Recordable[] = [];
          forEach(innerVal.value, (v, key) => {
            list.push({ key, value: v });
          });
          keys.value = list;
        },
        { deep: true },
      );
      watch(
        () => innerVal.value,
        (value) => {
          const list: Recordable[] = [];
          forEach(value, (v, key) => {
            list.push({ key, value: v });
          });
          keys.value = list;
        },
        { deep: true },
      );

      function handleAdd() {
        openModal(true, {
          type: ActionEnum.ADD,
        });
      }

      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        openModal(true, {
          record: record,
          type: ActionEnum.EDIT,
        });
      }

      function handleDelete(record: Recordable, e: Event) {
        e?.stopPropagation();
        if (record && record?.key) {
          delete innerVal.value[record?.key];

          emit('change', JSON.stringify(innerVal.value));
          emit('update:value', JSON.stringify(innerVal.value));
        }
      }

      function handleSuccess(metaItem: any) {
        const data = { ...innerVal.value };
        data[metaItem.key] = metaItem.value;
        for (let key in data) {
          let value = data[key];
          if (value === 'false') {
            value = false;
          } else if (value === 'true') {
            value = true;
          } else if (/^\d+$/.test(value)) {
            value = parseInt(value);
          } else if (/^\d+\.\d+$/.test(value)) {
            value = parseFloat(value);
          }
          data[key] = value;
        }

        innerVal.value = data;
        emit('change', JSON.stringify(data));
        emit('update:value', JSON.stringify(data));
      }

      return {
        handleAdd,
        handleEdit,
        handleDelete,
        handleSuccess,
        registerModal,
        registerTable,
        t,
        ActionEnum,
      };
    },
  });
</script>
<style lang="less" scoped>
  .meta-input {
    border: 1px solid #d9d9d9;
    padding: 10px;
  }
</style>
