<template>
  <PageWrapper contentFullHeight dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_DELETE]"
          color="error"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handleBatchDelete"
        >
          {{ t('common.title.delete') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_IMPORT]"
          preIcon="ant-design:cloud-upload-outlined"
          type="primary"
          @click="handleImport"
        >
          {{ t('common.title.import') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_EDIT]"
          preIcon="ant-design:cloud-upload-outlined"
          type="primary"
          @click="handleBatchEdit"
        >
          {{ t('common.title.edit') }}
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW]"
          preIcon="ant-design:cloud-upload-outlined"
          type="primary"
          @click="handleBatchPreview"
        >
          {{ t('common.title.preview') }}
        </a-button>

        <Dropdown
          :dropMenuList="[
            {
              text: '前端',
              event: TemplateEnum.WEB_PLUS,
            },
            {
              text: '后端',
              event: TemplateEnum.BACKEND,
            },
          ]"
          :trigger="['click']"
          overlayClassName="app-locale-picker-overlay"
          placement="bottom"
          @menu-event="(e) => handleBatchDownload(e.event)"
        >
          <a-button
            v-hasAnyPermission="[RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW]"
            :disabled="loading"
            preIcon="ant-design:cloud-upload-outlined"
            type="primary"
          >
            {{ t('common.title.download') }}
          </a-button>
        </Dropdown>

        <Dropdown
          :dropMenuList="[
            {
              text: '前端',
              event: TemplateEnum.WEB_PLUS,
            },
            {
              text: '后端',
              event: TemplateEnum.BACKEND,
            },
          ]"
          :trigger="['click']"
          overlayClassName="app-locale-picker-overlay"
          placement="bottom"
          @menu-event="(e) => handleBatchGenerator(e.event)"
        >
          <a-button
            v-hasAnyPermission="[RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW]"
            :disabled="loading"
            preIcon="ant-design:cloud-upload-outlined"
            type="primary"
          >
            生成
          </a-button>
        </Dropdown>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: t('common.title.edit'),
                icon: 'ant-design:edit-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_EDIT,
                onClick: handleEdit.bind(null, record),
              },
              {
                tooltip: t('common.title.delete'),
                icon: 'ant-design:delete-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_DELETE,
                color: 'error',
                popConfirm: {
                  title: t('common.tips.confirmDelete'),
                  confirm: handleDelete.bind(null, record),
                },
              },
              {
                tooltip: '同步',
                icon: 'ant-design:cloud-sync-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_SYNC,
                popConfirm: {
                  title: '确定同步该表的字段吗？',
                  confirm: handleSync.bind(null, record),
                },
              },
            ]"
            :dropDownActions="[
              {
                label: '预览后端',
                icon: 'ant-design:search-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW,
                onClick: handlePreview.bind(null, record, TemplateEnum.BACKEND),
              },
              {
                label: '预览前端',
                icon: 'ant-design:search-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW,
                onClick: handlePreview.bind(null, record, TemplateEnum.WEB_PLUS),
              },
              {
                label: '覆盖生成后端',
                icon: 'ant-design:download-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW,
                onClick: handleDownload.bind(null, record, TemplateEnum.BACKEND),
              },
              {
                label: '覆盖生成前端',
                icon: 'ant-design:download-outlined',
                auth: RoleEnum.TENANT_DEVELOPER_TOOLS_GENERATOR_PREVIEW,
                onClick: handleDownload.bind(null, record, TemplateEnum.WEB_PLUS),
              },
            ]"
            :stopButtonPropagation="true"
          />
        </template>
      </template>
    </BasicTable>
    <ImportModal @register="registerModal" @success="handleSuccess" />
    <Preview @register="registerPreviewModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { Dropdown } from '/@/components/Dropdown';
  import { useModal } from '/@/components/Modal';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { blobToObj, downloadFile, handleFetchParams } from '/@/utils/lamp/common';
  import {
    downloadZip,
    generatorCode,
    page,
    remove,
    syncField,
  } from '/@/api/devOperation/developer/defGenTable';
  import { columns, searchFormSchema } from './defGenTable.data';
  import ImportModal from './ImportIndex.vue';
  import Preview from './Preview.vue';
  import { GenTypeEnum, RouteEnum, TemplateEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: '代码生成',
    components: { BasicTable, PageWrapper, ImportModal, TableAction, Preview, Dropdown },
    setup() {
      const { t } = useI18n();
      const { createMessage, createConfirm } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
      const { replace } = useRouter();
      const loading = ref<boolean>(false);

      // 表格
      const [registerTable, { reload, getSelectRowKeys, getSelectRows }] = useTable({
        title: t('devOperation.developer.defGenTable.table.title'),
        api: page,
        columns: columns(),
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema(),
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
          columnWidth: 40,
        },
        actionColumn: {
          width: 200,
          title: t('common.column.action'),
          dataIndex: 'action',
        },
      });

      function setLoading(load: boolean) {
        loading.value = load;
      }

      // 同步字段
      async function handleSync(record: Recordable, e: Event) {
        e?.stopPropagation();
        await syncField(record.id);
        createMessage.success('同步成功');
        reload();
      }

      async function handleBatchDownload(template: TemplateEnum, e: Event) {
        e?.stopPropagation();
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning('请至少选择一条数据');
          return;
        }

        setLoading(true);
        try {
          const response = await downloadZip(ids, template);
          if (response) {
            downloadFile(response);
            createMessage.success(t('common.tips.downloadSuccess'));
          } else {
            createMessage.error('下载失败，请认真检查【生成信息】是否填写完整并保存成功！');
          }
        } catch (e: any) {
          const obj = (await blobToObj(e?.response?.data)) as any;
          createMessage.error(obj.msg);
        } finally {
          setLoading(false);
        }
      }

      async function handleBatchGenerator(template: TemplateEnum, e: Event) {
        e?.stopPropagation();
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning('请至少选择一条数据');
          return;
        }

        try {
          setLoading(true);

          const defGenVo = { ids: ids, template };
          await generatorCode(defGenVo);

          createMessage.success('代码生成成功，请在[生成路径]查看');
        } finally {
          setLoading(false);
        }
      }

      // 生成或下载代码
      async function handleDownload(record: Recordable, template: string, e: Event) {
        e?.stopPropagation();
        const ids = [record.id];
        if (record.genType === GenTypeEnum.ZIP) {
          const response = await downloadZip(ids, template);
          downloadFile(response);
          createMessage.success(t('common.tips.downloadSuccess'));
        } else {
          const defGenVo = { ids, template };
          await generatorCode(defGenVo);
          if (template === TemplateEnum.BACKEND) {
            createMessage.success('后端代码生成成功，请在' + record.outputDir + '查看');
          } else {
            createMessage.success('前端代码生成成功，请在' + record.frontOutputDir + '查看');
          }
        }
      }

      // 弹出导入页面
      function handleImport() {
        openModal(true, {});
      }

      // 弹出预览页面
      function handlePreview(record: Recordable, template: string, e: Event) {
        e?.stopPropagation();
        openPreviewModal(true, { tableIdList: [record.id], template });
      }

      // 弹出预览页面
      function handleBatchPreview(e: Event) {
        e?.stopPropagation();
        const ids = getSelectRowKeys();
        if (!ids || ids.length <= 0) {
          createMessage.warning('请至少选择一条数据');
          return;
        }
        openPreviewModal(true, { tableIdList: ids, template: TemplateEnum.BACKEND });
      }

      // 弹出编辑页面
      function handleEdit(record: Recordable, e: Event) {
        e?.stopPropagation();
        replace({
          name: RouteEnum.CODE_GENERATOR_EDIT,
          params: { id: record.id },
          query: {
            title: `表名：${record.name}`,
            content: `实体类：${record.entityName}  作者：${record.author}`,
          },
        });
      }

      // 新增或编辑成功回调
      function handleSuccess() {
        reload();
      }

      async function batchDelete(ids: any[]) {
        await remove(ids);
        createMessage.success(t('common.tips.deleteSuccess'));
        reload();
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
            try {
              await batchDelete(ids);
            } catch (e) {}
          },
        });
      }

      // 批量编辑
      function handleBatchEdit(e: Event) {
        e?.stopPropagation();
        const rows = getSelectRows();
        if (!rows || rows.length <= 0) {
          createMessage.warning('请至少选择一条数据');
          return;
        }
        if (rows.length == 1) {
          handleEdit(rows[0], e);
        } else {
          let ids = '';
          let titles = '';
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            ids += row.id;
            titles += row.name;
            if (i != rows.length - 1) {
              ids += ',';
              titles += ',';
            }
          }
          replace({
            name: RouteEnum.CODE_GENERATOR_EDIT,
            params: { id: ids },
            query: {
              title: `批量编辑：${titles}`,
            },
          });
        }
      }

      return {
        t,
        RoleEnum,
        registerTable,
        registerModal,
        registerPreviewModal,
        handlePreview,
        handleImport,
        handleSync,
        handleDownload,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleBatchDelete,
        handleBatchEdit,
        handleBatchPreview,
        handleBatchDownload,
        handleBatchGenerator,
        loading,
        TemplateEnum,
      };
    },
  });
</script>
