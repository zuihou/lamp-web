import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msg/msg/page`,
    method: 'POST'
  },
  mark: {
    url: `/msg/msg/mark`,
    method: 'GET'
  },
  save: {
    url: `/msg/msg`,
    method: 'POST'
  },
  delete: {
    url: `/msg/msg`,
    method: 'DELETE'
  },
  preview: {
    method: 'POST',
    url: `/msg/msg/preview`
  },
  export: {
    method: 'POST',
    url: `/msg/msg/export`
  },
  import: {
    method: 'POST',
    url: `/msg/msg/import`
  }
}

export default {
  page (data, custom = {}) {
    return axiosApi({
      ...apiList.page,
      data,
      custom
    })
  },
  save (data) {
    return axiosApi({
      ...apiList.save,
      data
    })
  },
  delete (data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  },
  mark (data) {
    return axiosApi({
      ...apiList.mark,
      data
    })
  },
  get (id) {
    return axiosApi({
      url: `/msg/msg/${id}`,
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
