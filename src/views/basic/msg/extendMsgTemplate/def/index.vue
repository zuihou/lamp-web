<template>
  <BasicModal
    :keyboard="true"
    :maskClosable="false"
    title="导入消息模板"
    v-bind="$attrs"
    width="80%"
    @ok="handleSubmit"
    okText="导入"
    @register="registerModal"
  >
    <PageWrapper contentFullHeight dense>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'state'">
            <Tag :color="record.state ? 'success' : 'error'">
              {{ record.state ? t('lamp.common.enable') : t('lamp.common.disable') }}
            </Tag>
          </template>
        </template>
      </BasicTable>
    </PageWrapper>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import { page } from '/@/api/devOperation/ops/defMsgTemplate';
  import { importMsgTemplate } from '/@/api/basic/msg/extendMsgTemplate';
  import { columns, searchFormSchema } from './defMsgTemplate.data';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'BaseDictImportManagement',
    components: { BasicModal, BasicTable, PageWrapper, Tag },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage } = useMessage();

      // 表格
      const [registerTable, { getSelectRowKeys }] = useTable({
        title: t('basic.base.baseDict.table.title'),
        api: page,
        columns: columns(),
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema(),
        },
        beforeFetch: handleFetchParams,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        setModalProps({ confirmLoading: false });
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          const ids = getSelectRowKeys();
          if (ids && ids.length > 0) {
            await importMsgTemplate(ids);

            createMessage.success(t(`common.tips.importSuccess`));
            closeModal();
            emit('success');
          } else {
            createMessage.warn('请先选择字典');
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        t,
        registerTable,
        registerModal,
        handleSubmit,
      };
    },
  });
</script>
