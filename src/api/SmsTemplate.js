import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/smsTemplate/page`,
    method: 'POST'
  },
  save: {
    url: `/msgs/smsTemplate`,
    method: 'POST'
  },
  update: {
    url: `/msgs/smsTemplate`,
    method: 'PUT'
  },
  delete: {
    url: `/msgs/smsTemplate`,
    method: 'DELETE'
  },
  check: {
    url: `/msgs/smsTemplate/check`,
    method: 'GET'
  },
  preview: {
    method: 'POST',
    url: `/msgs/smsTemplate/preview`
  },
  export: {
    method: 'POST',
    url: `/msgs/smsTemplate/export`
  },
  import: {
    method: 'POST',
    url: `/msgs/smsTemplate/import`
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  save (data) {
    return axiosApi({
      ...apiList.save,
      data
    })
  },
  update (data) {
    return axiosApi({
      ...apiList.update,
      data
    })
  },
  delete (data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  },
  check (customCode) {
    const data = { customCode: customCode }
    return axiosApi({
      ...apiList.check,
      data
    })
  },
  preview (data) {
    return axiosApi({
      ...apiList.preview,
      data
    })
  },
  export (data) {
    return axiosApi({
      ...apiList.export,
      responseType: "blob",
      data
    })
  },
  import (data) {
    return axiosApi({
      ...apiList.import,
      data
    })
  }
}
