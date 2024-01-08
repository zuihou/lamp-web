<template>
  <div class="resource-api">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-if="type !== ActionEnum.VIEW" type="primary" @click="handleAdd">录入</a-button>
        <a-button v-if="type !== ActionEnum.VIEW" type="primary" @click="handleSelect">
          选择
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'uri'">
          <Tooltip>
            <template #title>
              服务： {{ record.springApplicationName }} <br />
              名称：{{ record.controller }} <br />
              接口名：{{ record.name }} <br />
              地址： {{ record.uri }} <br />
              请求方式： {{ record.requestMethod }}
            </template>
            <Tag :color="HTTP_TAG_MAP.get(record.requestMethod)">
              {{ record.requestMethod }}
            </Tag>
            {{ record.uri }}
          </Tooltip>
        </template>
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
                color: 'error',
                ifShow: () => type !== ActionEnum.VIEW && !!record.isInput,
                onClick: handleEdit.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <SelectModal @register="registerModal" @success="handleSuccess" />
    <EditModal @register="registerEditModal" @success="handleEditSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, watch } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { Tag, Tooltip } from 'ant-design-vue';
  import { cloneDeep, uniqueId } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { resourceApiColumns } from './defResourceApi.data';
  import SelectModal from './ResourceApiSelect.vue';
  import EditModal from './ResourceApiEdit.vue';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { HTTP_TAG_MAP } from '/@/enums/httpEnum';
  import { DefResourceApiVO } from '/@/api/devOperation/application/model/defResourceModel';

  export default defineComponent({
    name: 'DefResourceResourceApi',
    components: { BasicTable, TableAction, SelectModal, EditModal, Tag, Tooltip },
    props: {
      value: {
        type: [Array] as PropType<DefResourceApiVO[]>,
      },
      type: {
        type: String as PropType<ActionEnum>,
        default: ActionEnum.ADD,
      },
    },
    emits: ['update:value', 'change'],
    setup(props, { emit }) {
      const [registerModal, { openModal }] = useModal();
      const [registerEditModal, { openModal: openEditModal }] = useModal();
      const { t } = useI18n();
      const innerVal = ref<Recordable[]>([]);

      const [registerTable, { setTableData }] = useTable({
        title: '资源关联的接口',
        dataSource: innerVal,
        scroll: { y: 250 },
        canResize: false,
        columns: resourceApiColumns,
        bordered: true,
        rowKey: 'tempId',
        actionColumn: {
          width: 100,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      watch(
        () => props.value,
        (value: DefResourceApiVO[] = []) => {
          innerVal.value = cloneDeep(value);
          innerVal.value.forEach((v) => (v.tempId = uniqueId()));
        },
        { deep: true },
      );

      // 选择
      function handleSelect() {
        openModal(true, {
          selectedData: [...unref(innerVal)],
        });
      }

      // 手工录入
      function handleAdd() {
        openEditModal(true, {
          record: { tempId: uniqueId() },
        });
      }

      // 编辑录入
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        openEditModal(true, { record });
      }

      // 删除接口
      function handleDelete(record: Recordable, e: Event) {
        e?.stopPropagation();

        let index = unref(innerVal).findIndex(
          (selected) =>
            selected.springApplicationName === record.springApplicationName &&
            selected.uri === record.uri &&
            selected.requestMethod === record.requestMethod,
        );

        if (index > -1) {
          innerVal.value.splice(index, 1);
          // const data = getDataSource();
          // data.splice(index, 1);
        }

        emit('change', innerVal.value);
        emit('update:value', innerVal.value);
      }

      function handleSuccess(selectedData: DefResourceApiVO[]) {
        innerVal.value = selectedData;
        setTableData(selectedData);

        emit('change', selectedData);
        emit('update:value', selectedData);
      }

      function handleEditSuccess(addData: DefResourceApiVO) {
        if (!addData.isInput) {
          return;
        }
        // const index = unref(innerVal).findIndex(
        //   (selected) =>
        //     selected.springApplicationName === addData.springApplicationName &&
        //     selected.uri === addData.uri &&
        //     selected.requestMethod === addData.requestMethod,
        // );
        const index = unref(innerVal).findIndex((selected) => selected.tempId === addData.tempId);

        console.log('index=', index);
        if (index > -1) {
          unref(innerVal).forEach((selected) => {
            if (selected.tempId === addData.tempId) {
              selected.isInput = addData.isInput;
              selected.tempId = addData.tempId;
              selected.springApplicationName = addData.springApplicationName;
              selected.controller = addData.controller;
              selected.uri = addData.uri;
              selected.requestMethod = addData.requestMethod;
              selected.name = addData.name;
            }
          });
        } else {
          innerVal.value.push(addData);
          // const data = getDataSource();
          // console.log(data);
          // data.push(addData);
        }

        console.log(innerVal.value);
        emit('change', innerVal.value);
        emit('update:value', innerVal.value);
      }

      return {
        t,
        handleAdd,
        handleEdit,
        handleSelect,
        handleDelete,
        handleSuccess,
        registerModal,
        registerTable,
        registerEditModal,
        handleEditSuccess,
        ActionEnum,
        HTTP_TAG_MAP,
      };
    },
  });
</script>
<style lang="less" scoped>
  .resource-api {
    border: 1px solid #d9d9d9;
    padding: 10px;
  }
</style>
