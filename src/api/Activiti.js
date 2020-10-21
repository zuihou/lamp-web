import axiosApi from './AxiosApi.js'

const apiList = {
  //查询模型
  findModel: {
    method: 'post',
    url: `/activiti/model/pageModel`
  },
  //删除模型
  addModel: {
    method: 'get',
    url: `/activiti/model/create`
  },
  deleteModel: {
    method: 'get',
    url: `/activiti/model/delete`
  },
  //发布流程
  publishModel: {
    method: 'post',
    url: `/activiti/model/publish`
  },

  //查询流程定义
  pageDefinition: {
    method: 'post',
    url: `/activiti/definition/page`
  },
  deleteDefinition: {
    method: 'delete',
    url: `/activiti/definition/delete`
  },
  updateSuspendState: {
    method: 'get',
    url: `/activiti/definition/updateSuspendState`
  },
  defUpload: {
    method: 'post',
    url: `/activiti/definition/upload`
  },
  saveModelByPro: {
    method: 'get',
    url: `/activiti/definition/saveModelByPro`
  },

  readResource: {
    method: 'get',
    url: `/activiti/definition/readResource`
  },

  //表单查询
  formQuery: {
    method: 'post',
    url: `/activiti/formCore/query`
  },

  formItemQuery: {
    method: 'post',
    url: `/activiti/formCoreItem/query`
  },

  //流程实例
  updateSuspendStateInst: {
    method: 'get',
    url: `/activiti/instance/updateSuspendStateInst`
  },

  //请假相关实例
  saveInstant: {
    method: 'post',
    url: `/activiti/bizLeave/save`
  },
  deleteInst: {
    method: 'post',
    url: `/activiti/bizLeave/delete`
  },
  pageInstant: {
    method: 'post',
    url: `/activiti/bizLeave/pageBiz`
  },
  getDetailInst: {
    method: 'get',
    url: `/activiti/bizLeave/get`
  },

  //报销相关实例

  saveInstantReimbursement: {
    method: 'post',
    url: `/activiti/bizReimbursement/save`
  },
  deleteInstReimbursement: {
    method: 'post',
    url: `/activiti/bizReimbursement/delete`
  },
  pageInstantReimbursement: {
    method: 'post',
    url: `/activiti/bizReimbursement/pageBiz`
  },
  getDetailInstReimbursement: {
    method: 'get',
    url: `/activiti/bizReimbursement/get`
  },

  //待办
  pageTask: {
    method: 'post',
    url: `/activiti/bizLeave/pageRunTask`
  },
  pageHiTask: {
    method: 'post',
    url: `/activiti/bizLeave/pageHiTask`
  },
  pageTaskReimbursement: {
    method: 'post',
    url: `/activiti/bizReimbursement/pageRunTask`
  },
  pageHiTaskReimbursement: {
    method: 'post',
    url: `/activiti/bizReimbursement/pageHiTask`
  },
  getItemDetail: {
    method: 'get',
    url: `/activiti/bizItem/get`
  },
  getItemList: {
    method: 'get',
    url: `/activiti/bizItem/find`
  },
  saveItem: {
    method: 'post',
    url: `/activiti/bizItem/save`
  },

  //任务
  updateAssignee: {
    method: 'get',
    url: `/activiti/task/updateAssignee`
  },
  getReadyTaskByInst: {
    method: 'get',
    url: `/activiti/task/getReadyTaskByInst`
  },
}

export default {
  pageModel (data) {
    return axiosApi({
      ...apiList.findModel,
      data
    })
  },
  addModel (data) {
    return axiosApi({
      ...apiList.addModel,
      data
    })
  },
  deleteModel (data) {
    return axiosApi({
      ...apiList.deleteModel,
      data
    })
  },
  publishModel (data) {
    return axiosApi({
      ...apiList.publishModel,
      data
    })
  },
  pageDefinition (data) {
    return axiosApi({
      ...apiList.pageDefinition,
      data
    })
  },
  deleteDefinition (data) {
    return axiosApi({
      ...apiList.deleteDefinition,
      data
    })
  },
  updateSuspendState (data) {
    return axiosApi({
      ...apiList.updateSuspendState,
      data
    })
  },
  defUpload (data) {
    return axiosApi({
      ...apiList.defUpload,
      data
    })
  },
  saveModelByPro(data) {
    return axiosApi({
      ...apiList.saveModelByPro,
      data
    })
  },
  readResource(data) {
    return axiosApi({
      ...apiList.readResource,
      data
    })
  },
  formQuery(data) {
    return axiosApi({
      ...apiList.formQuery,
      data
    })
  },
  formItemQuery(data) {
    return axiosApi({
      ...apiList.formItemQuery,
      data
    })
  },
  saveInstant(data) {
    return axiosApi({
      ...apiList.saveInstant,
      data
    })
  },
  pageInstant(data) {
    return axiosApi({
      ...apiList.pageInstant,
      data
    })
  },
  getDetailInst(data) {
    return axiosApi({
      ...apiList.getDetailInst,
      data
    })
  },
  updateSuspendStateInst(data) {
    return axiosApi({
      ...apiList.updateSuspendStateInst,
      data
    })
  },
  deleteInst(data) {
    return axiosApi({
      ...apiList.deleteInst,
      data
    })
  },
  pageTask(data) {
    return axiosApi({
      ...apiList.pageTask,
      data
    })
  },
  pageHiTask(data) {
    return axiosApi({
      ...apiList.pageHiTask,
      data
    })
  },
  pageTaskReimbursement(data) {
    return axiosApi({
      ...apiList.pageTaskReimbursement,
      data
    })
  },
  pageHiTaskReimbursement(data) {
    return axiosApi({
      ...apiList.pageHiTaskReimbursement,
      data
    })
  },
  getItemDetail(data) {
    return axiosApi({
      ...apiList.getItemDetail,
      data
    })
  },
  getItemList(data) {
    return axiosApi({
      ...apiList.getItemList,
      data
    })
  },
  saveItem(data) {
    return axiosApi({
      ...apiList.saveItem,
      data
    })
  },
  updateAssignee(data) {
    return axiosApi({
      ...apiList.updateAssignee,
      data
    })
  },
  getReadyTaskByInst(data) {
    return axiosApi({
      ...apiList.getReadyTaskByInst,
      data
    })
  },

  saveInstantReimbursement(data) {
    return axiosApi({
      ...apiList.saveInstantReimbursement,
      data
    })
  },
  deleteInstReimbursement(data) {
    return axiosApi({
      ...apiList.deleteInstReimbursement,
      data
    })
  },
  pageInstantReimbursement(data) {
    return axiosApi({
      ...apiList.pageInstantReimbursement,
      data
    })
  },
  getDetailInstReimbursement(data) {
    return axiosApi({
      ...apiList.getDetailInstReimbursement,
      data
    })
  },
}
