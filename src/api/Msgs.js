import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/msgsCenterInfo/page`,
    method: 'POST'
  },
  mark: {
    url: `/msgs/msgsCenterInfo/mark`,
    method: 'GET'
  },
  save: {
    url: `/msgs/msgsCenterInfo`,
    method: 'POST'
  },
  delete: {
    url: `/msgs/msgsCenterInfo`,
    method: 'DELETE'
  },
  preview: {
    method: 'POST',
    url: `/msgs/msgsCenterInfo/preview`
  },
  export: {
    method: 'POST',
    url: `/msgs/msgsCenterInfo/export`
  },
  import: {
    method: 'POST',
    url: `/msgs/msgsCenterInfo/import`
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
      url: `/msgs/msgsCenterInfo/${id}`,
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
