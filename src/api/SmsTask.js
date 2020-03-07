import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/smsTask/page`,
    method: 'POST'
  },
  save: {
    url: `/msgs/smsTask`,
    method: 'POST'
  },
  update: {
    url: `/msgs/smsTask`,
    method: 'PUT'
  },
  delete: {
    url: `/msgs/smsTask`,
    method: 'DELETE'
  },
  preview: {
    method: 'POST',
    url: `/msgs/smsTask/preview`
  },
  export: {
    method: 'POST',
    url: `/msgs/smsTask/export`
  },
  import: {
    method: 'POST',
    url: `/msgs/smsTask/import`
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
  get (id) {
    return axiosApi({
      url: `/msgs/smsTask/${id}`,
      method: 'GET'
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
