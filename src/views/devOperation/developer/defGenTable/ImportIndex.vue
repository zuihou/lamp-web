<template>
  <BasicModal
    :defaultFullscreen="true"
    :keyboard="true"
    :maskClosable="true"
    showFooter
    title="导入表结构"
    v-bind="$attrs"
    width="70%"
    @cancel="handleCancel"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { handleFetchParams } from '/@/utils/lamp/common';
  import {
    importCheck,
    importTable,
    selectTableList,
  } from '/@/api/devOperation/developer/defGenTable';
  import { importColumns, importSearchFormSchema } from './defGenTable.data';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'DefGenTableManagement',
    components: { BasicModal, BasicTable },
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();

      // 表格
      const [
        registerTable,
        { reload, getSelectRowKeys, clearSelectedRowKeys, setFieldsValue, getForm },
      ] = useTable({
        title: t('devOperation.developer.defGenTable.table.title'),
        api: selectTableList,
        columns: importColumns(),
        formConfig: {
          labelWidth: 120,
          schemas: importSearchFormSchema(
            (value) => {
              value && reload({ searchInfo: { dsId: value } });
            },
            (value) => {
              setFieldsValue(value);
            },
          ),
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
        immediate: false,
        rowKey: 'name',
        rowSelection: {
          type: 'checkbox',
          columnWidth: 40,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (_) => {
        setModalProps({ confirmLoading: false });
      });

      // 点击批量删除
      async function handleSubmit() {
        const tableNames = getSelectRowKeys();
        if (!tableNames || tableNames.length <= 0) {
          createMessage.warning(t('common.tips.pleaseSelectTheData'));
          return;
        }
        const form = await getForm();
        const model = await form.getFieldsValue();
        const dsId = model.dsId;
        if (!dsId) {
          createMessage.warning('请先选择数据源');
          return;
        }
        try {
          const flag = await importCheck(tableNames);
          if (flag) {
            await importTable({ dsId, tableNames });
            await getForm().setFieldsValue({ name: '', comment: '', createTimeRange: null });
            closeModal();
            emit('success');
          }
        } catch (e) {
          if (e?.response?.data?.msg.indexOf('是否覆盖导入') > -1) {
            const msg = e?.response?.data?.msg ?? '是否确认导入此表？';
            createConfirm({
              iconType: 'warning',
              content: msg,
              onOk: async () => {
                try {
                  await importTable({ dsId, tableNames });
                  await getForm().setFieldsValue({ name: '', comment: '', createTimeRange: null });
                  closeModal();
                  emit('success');
                } catch (e) {}
              },
            });
          }
        }
      }

      async function handleCancel() {
        await getForm().setFieldsValue({ name: '', comment: '', createTimeRange: null });
        await clearSelectedRowKeys();
      }

      return {
        t,
        registerModal,
        registerTable,
        handleSubmit,
        handleCancel,
      };
    },
  });
</script>
