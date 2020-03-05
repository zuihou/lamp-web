import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/application/page`,
  },
  update: {
    method: 'PUT',
    url: `/authority/application`
  },
  save: {
    method: 'POST',
    url: `/authority/application`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/application`
  },
  preview: {
    method: 'POST',
    url: `/authority/application/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/application/export`
  },
  import: {
    method: 'POST',
    url: `/authority/application/import`
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
