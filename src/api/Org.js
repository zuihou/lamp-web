import axiosApi from './AxiosApi.js'

const apiList = {
  allTree: {
    method: 'GET',
    url: `/authority/org/tree`
  },
  save: {
    method: 'POST',
    url: `/authority/org`
  },
  update: {
    method: 'PUT',
    url: `/authority/org`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/org`
  },
  preview: {
    method: 'POST',
    url: `/authority/org/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/org/export`
  },
  import: {
    method: 'POST',
    url: `/authority/org/import`
  }
}

export default {
  allTree (data) {
    return axiosApi({
      ...apiList.allTree,
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
