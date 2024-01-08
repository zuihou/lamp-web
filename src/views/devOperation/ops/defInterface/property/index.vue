<template>
  <PageWrapper :title="name">
    <div class="p-4 bg-white">
      <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
        <template #operate="{ row }">
          <PopConfirmButton circle circleIcon="ant-design:delete-outlined" title="确认删除吗？" @confirm="removeRowEvent(row)" />
        </template>
      </vxe-grid>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VxeGridInstance, VxeGridListeners, VxeGridProps, VxeTablePropTypes } from 'vxe-table'

import { useI18n } from '/@/hooks/web/useI18n'
import { PopConfirmButton } from '/@/components/Button'
import { useMessage } from '/@/hooks/web/useMessage'
import { PageWrapper } from '/@/components/Page'

import { getValidateRuleObj } from '/@/api/lamp/common/formValidateService'
import { columns, customFormSchemaRules, formItems } from './defInterfaceProperty.data'
import { Api, page as pageRequest, batchSave } from '/@/api/devOperation/ops/defInterfaceProperty'

export default defineComponent({
  // 若需要开启页面缓存，请将此参数跟菜单名保持一致
  name: '消息模板维护',
  components: {
    PageWrapper,
    PopConfirmButton
  },
  setup() {
    const { t } = useI18n()
    const { currentRoute } = useRouter()
    const { createMessage } = useMessage()
    const interfaceId = ref<string>('')
    const name = ref<string>('')

    const xGrid = ref<VxeGridInstance>({} as VxeGridInstance)
    const validRules = ref<VxeTablePropTypes.EditRules>({} as VxeTablePropTypes.EditRules)
    const gridOptions = reactive<VxeGridProps>({
      id: 'DefMsgProperty',
      height: 600,
      rowConfig: {
        // 自定义行数据唯一主键的字段名（默认自动生成）
        keyField: 'id',
        // 当鼠标移到行时，是否要高亮当前行
        isHover: true
      },
      // 自定义列配置项
      customConfig: {
        // 是否启用 localStorage 本地保存，会将列操作状态保留在本地（需要有 id）
        storage: true
      },
      formConfig: {
        items: formItems()
      },
      toolbarConfig: {
        perfect: true,
        buttons: [
          { code: 'myInsert', name: '新增' },
          {
            code: 'mark_cancel',
            name: '删除',
            status: 'danger'
          },
          { code: 'save', name: '提交', status: 'success' }
        ]
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
            const queryParams: any = { model: { ...form } }

            if (!interfaceId.value) {
              createMessage.warn('请先保存数据')
              return Promise.reject('请先保存数据')
            }
            // 处理排序条件
            const firstSort = sorts[0]
            if (firstSort) {
              queryParams.sort = firstSort.property
              queryParams.order = firstSort.order
            }
            queryParams.size = page.pageSize
            queryParams.current = page.currentPage
            queryParams.model.interfaceId = interfaceId.value
            // 处理筛选条件
            filters.forEach(({ property, values }) => {
              queryParams[property] = values.join(',')
            })
            return pageRequest(queryParams).then((r) => {
              r.total = Number(r.total)
              return r
            })
          },
          // 当点击工具栏保存按钮或者手动提交指令 save 时会被触发
          save: ({ body }) => {
            return batchSave(body)
          }
        }
      },
      columns: columns(),
      editRules: validRules,
      editConfig: {
        trigger: 'click',
        mode: 'row',
        showStatus: true,
        autoClear: true
      }
    })

    onMounted(async () => {
      const routeParams = currentRoute.value?.params
      const routeQuery = currentRoute.value?.query
      name.value = routeQuery.name as string
      await load(routeParams.id as string)

      await reload()
    })

    function reload() {
      const $grid = xGrid.value
      $grid.commitProxy('query')
    }

    const gridEvents: VxeGridListeners = {
      toolbarButtonClick({ code }) {
        const $grid = xGrid.value
        switch (code) {
          case 'myInsert': {
            $grid.insert({
              interfaceId: interfaceId.value
            })
            break
          }
        }
      }
    }

    async function load(tId: string) {
      interfaceId.value = tId || ''

      const rules = await getValidateRuleObj(Api.Save, customFormSchemaRules())
      const $grid = xGrid.value
      $grid && rules && (validRules.value = rules)
    }

    const removeRowEvent = async (row: any) => {
      const $grid = xGrid.value
      if ($grid) {
        $grid.remove(row)
        createMessage.success(t('common.tips.deleteSuccess'))
      }
    }

    return {
      t,
      xGrid,
      gridOptions,
      gridEvents,
      name,
      removeRowEvent
    }
  }
})
</script>
