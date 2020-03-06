import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/parameter/page`,
  },
  update: {
    method: 'PUT',
    url: `/authority/parameter`
  },
  save: {
    method: 'POST',
    url: `/authority/parameter`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/parameter`
  },
  preview: {
    method: 'POST',
    url: `/authority/parameter/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/parameter/export`
  },
  import: {
    method: 'POST',
    url: `/authority/parameter/import`
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
