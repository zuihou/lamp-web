import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/optLog/page`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/optLog`
  },
  clear: {
    method: 'DELETE',
    url: `/authority/optLog/clear`
  },
  preview: {
    method: 'POST',
    url: `/authority/optLog/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/optLog/export`
  },
  import: {
    method: 'POST',
    url: `/authority/optLog/import`
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  delete (data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  },
  clear (data) {
    return axiosApi({
      ...apiList.clear,
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
