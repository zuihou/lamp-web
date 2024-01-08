<template>
  <div v-if="batch">
    批量操作暂不支持修改字段，如果确实需要个性化修改字典配置，请单个修改后在生成！
  </div>
  <div v-else :class="prefixCls">
    <vxe-grid ref="xGrid" v-bind="gridOptions">
      <template #operate="{ row }">
        <template v-if="$refs.xGrid.isActiveByRow(row)">
          <a-button
            circle
            circleIcon="ant-design:save-outlined"
            status="primary"
            title="保存"
            @click="saveRowEvent(row)"
          />
          <a-button
            circle
            circleIcon="ant-design:close-circle-outlined"
            title="取消"
            @click="cancelRowEvent(row)"
          />
        </template>
        <template v-else>
          <a-button
            circle
            circleIcon="ant-design:edit-outlined"
            title="编辑"
            @click="editRowEvent(row)"
          />
        </template>
        <PopConfirmButton
          circle
          circleIcon="ant-design:delete-outlined"
          title="确认删除吗？"
          @confirm="removeRowEvent(row)"
        />
        <PopConfirmButton
          circle
          circleIcon="ant-design:cloud-sync-outlined"
          title="确认同步吗？"
          @confirm="syncRowEvent(row)"
        />
      </template>
    </vxe-grid>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { VxeGridInstance, VxeGridProps, VxeTablePropTypes } from 'vxe-table';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PopConfirmButton } from '/@/components/Button';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { ActionEnum, VALIDATE_API } from '/@/enums/commonEnum';
  import { getValidateRuleObj } from '/@/api/lamp/common/formValidateService';
  import {
    Api,
    page as pageRequest,
    remove,
    syncField,
    update as updateColumn,
  } from '/@/api/devOperation/developer/defGenTableColumn';
  import { columns, customFormSchemaRules, formItems } from './defGenTableColumnVxe.data';

  export default defineComponent({
    name: '修改代码配置',
    components: { PopConfirmButton },
    setup: function () {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const { prefixCls } = useDesign('j-vxe-table');
      const tableId = ref<string>('');
      const batch = ref<boolean>(false);

      const xGrid = ref({} as VxeGridInstance);
      const validRules = ref({} as VxeTablePropTypes.EditRules);

      const gridOptions = reactive<VxeGridProps>({
        id: 'full_edit_1',
        // height: 600,
        rowConfig: {
          // 自定义行数据唯一主键的字段名（默认自动生成）
          keyField: 'id',
          // 当鼠标移到行时，是否要高亮当前行
          isHover: true,
        },
        // 自定义列配置项
        customConfig: {
          // 是否启用 localStorage 本地保存，会将列操作状态保留在本地（需要有 id）
          storage: true,
          // 自定义列是否允许列选中的方法，该方法的返回值用来决定这一列的 checkbox 是否可以选中
          checkMethod({ column }) {
            if (['nickname', 'role'].includes(column.property)) {
              return false;
            }
            return true;
          },
        },
        formConfig: {
          items: formItems(),
        },
        toolbarConfig: {
          buttons: [{ code: 'delete', name: '删除', icon: 'delete-outlined', status: 'danger' }],
        },
        // 分页配置项
        pagerConfig: {
          // pageSize: 10,
        },
        // 数据代理配置项（基于 Promise API）
        proxyConfig: {
          // 只接收Promise，具体实现自由发挥
          ajax: {
            // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
            query: ({ page, sorts, filters, form }) => {
              const queryParams: any = { model: { ...form } };
              // 处理排序条件
              const firstSort = sorts[0];
              if (firstSort) {
                queryParams.sort = firstSort.property;
                queryParams.order = firstSort.order;
              }
              queryParams.size = page.pageSize;
              queryParams.current = page.currentPage;
              queryParams.model.tableId = tableId.value;
              // 处理筛选条件
              filters.forEach(({ property, values }) => {
                queryParams[property] = values.join(',');
              });
              return pageRequest(queryParams).then((r) => {
                r.total = Number(r.total);
                return r;
              });
            },
            // 当点击工具栏删除按钮或者手动提交指令 delete 时会被触发
            delete: ({ body }) => {
              const ids = body.removeRecords.map((item) => item.id);
              return remove(ids);
            },
          },
        },
        columns: columns(),
        editRules: validRules,
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
          autoClear: false,
        },
      });

      async function load(tId: string, b: boolean) {
        batch.value = b;
        if (b) {
          return;
        }
        if (tId) {
          tableId.value = tId;

          let validateApi = Api[VALIDATE_API[ActionEnum.EDIT]];
          const rules = await getValidateRuleObj(validateApi, customFormSchemaRules());
          const $grid = xGrid.value;

          $grid && rules && (validRules.value = rules);

          reload();
        } else {
          createMessage.warn('该表不存在');
        }
      }

      const syncRowEvent = async (row: any) => {
        try {
          await syncField(row.tableId, row.id);
          createMessage.success('同步成功');
        } finally {
          reload();
        }
      };

      const editRowEvent = (row: any) => {
        const $grid = xGrid.value;
        if ($grid) {
          $grid.setActiveRow(row);
        }
      };

      const cancelRowEvent = async (row: any) => {
        const $grid = xGrid.value;
        await $grid.clearActived();
        // 还原数据
        await $grid.revertData(row);
      };

      const saveRowEvent = async (row: any) => {
        const $grid = xGrid.value;
        if ($grid && !(await $grid.validate(row))) {
          await $grid.clearActived();
          gridOptions.loading = true;
          try {
            await updateColumn(row);
            await $grid.reloadRow(row, {});
          } finally {
            gridOptions.loading = false;
          }
        }
      };
      const removeRowEvent = async (row: any) => {
        const $grid = xGrid.value;
        if ($grid) {
          try {
            await remove([row.id]);
            createMessage.success(t('common.tips.deleteSuccess'));
          } finally {
            reload();
          }
        }
      };

      function reload() {
        const $grid = xGrid.value;
        $grid.commitProxy('query');
      }

      return {
        t,
        RoleEnum,
        xGrid,
        gridOptions,
        load,
        saveRowEvent,
        removeRowEvent,
        cancelRowEvent,
        editRowEvent,
        syncRowEvent,
        batch,
        prefixCls,
      };
    },
  });
</script>
