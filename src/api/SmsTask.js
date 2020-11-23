import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msg/smsTask/page`,
    method: 'POST'
  },
  save: {
    url: `/msg/smsTask`,
    method: 'POST'
  },
  update: {
    url: `/msg/smsTask`,
    method: 'PUT'
  },
  delete: {
    url: `/msg/smsTask`,
    method: 'DELETE'
  },
  preview: {
    method: 'POST',
    url: `/msg/smsTask/preview`
  },
  export: {
    method: 'POST',
    url: `/msg/smsTask/export`
  },
  import: {
    method: 'POST',
    url: `/msg/smsTask/import`
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
      url: `/msg/smsTask/${id}`,
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
