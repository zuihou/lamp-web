import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/dictionaryItem/page`
  },
  update: {
    method: 'PUT',
    url: `/authority/dictionaryItem`
  },
  save: {
    method: 'POST',
    url: `/authority/dictionaryItem`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/dictionaryItem`
  },
  list: {
    method: 'GET',
    url: `/oauth/dictionaryItem/codes`
  },
  preview: {
    method: 'POST',
    url: `/authority/dictionaryItem/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/dictionaryItem/export`
  },
  import: {
    method: 'POST',
    url: `/authority/dictionaryItem/import`
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
  list (data) {
    return axiosApi({
      ...apiList.list,
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
