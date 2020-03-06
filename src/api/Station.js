import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/authority/station/page`,
    method: 'POST'
  },
  save: {
    url: `/authority/station`,
    method: 'POST'
  },
  update: {
    url: `/authority/station`,
    method: 'PUT'
  },
  delete: {
    url: `/authority/station`,
    method: 'DELETE'
  },
  preview: {
    method: 'POST',
    url: `/authority/station/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/station/export`
  },
  import: {
    method: 'POST',
    url: `/authority/station/import`
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
