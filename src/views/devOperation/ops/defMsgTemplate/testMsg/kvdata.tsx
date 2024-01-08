import { VxeGridPropTypes } from '/@/components/VxeTable'

export const paramTableColumns = (emit: any, tableRef: any): VxeGridPropTypes.Columns => {
  return [
    {
      title: '序号',
      field: 'seq',
      type: 'seq',
      fixed: 'left',
      width: '50',
      align: 'center'
    },
    {
      title: '参数名称',
      field: 'key',
      showOverflow: 'tooltip',
      align: 'center',
      editRender: {
        name: 'AInput',
        placeholder: '请点击输入',
        events: {
          change: () => {
            const recordset = tableRef.value?.getRecordset()
            emit('change', recordset.insertRecords)
            emit('update:value', recordset.insertRecords)
          }
        }
      }
    },
    {
      title: '值',
      field: 'value',
      showOverflow: 'tooltip',
      align: 'center',
      editRender: {
        name: 'AInput',
        placeholder: '请点击输入',
        events: {
          change: () => {
            const recordset = tableRef.value?.getRecordset()
            emit('change', recordset.insertRecords)
            emit('update:value', recordset.insertRecords)
          }
        }
      }
    },
    {
      width: 160,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right'
    }
  ]
}

export const recipientTableColumns = (emit: any, tableRef: any): VxeGridPropTypes.Columns => {
  return [
    {
      title: '序号',
      field: 'seq',
      type: 'seq',
      fixed: 'left',
      width: '50',
      align: 'center'
    },
    {
      title: '接收人',
      field: 'recipient',
      showOverflow: 'tooltip',
      align: 'center',
      editRender: {
        name: 'AInput',
        placeholder: '请点击输入',
        events: {
          change: () => {
            const recordset = tableRef.value?.getRecordset()
            emit('change', recordset.insertRecords)
            emit('update:value', recordset.insertRecords)
          }
        }
      }
    },
    {
      title: '扩展信息',
      field: 'ext',
      showOverflow: 'tooltip',
      align: 'center',
      editRender: {
        name: 'AInput',
        placeholder: '请点击输入',
        events: {
          change: () => {
            const recordset = tableRef.value?.getRecordset()
            emit('change', recordset.insertRecords)
            emit('update:value', recordset.insertRecords)
          }
        }
      }
    },
    {
      width: 160,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right'
    }
  ]
}
