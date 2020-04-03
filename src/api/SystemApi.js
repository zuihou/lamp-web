import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/systemApi/page`,
  },
  update: {
    method: 'PUT',
    url: `/authority/systemApi`
  },
  save: {
    method: 'POST',
    url: `/authority/systemApi`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/systemApi`
  },
  preview: {
    method: 'POST',
    url: `/authority/systemApi/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/systemApi/export`
  },
  import: {
    method: 'POST',
    url: `/authority/systemApi/import`
  }
}

export default {
  page(data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  scan(serviceId) {
    return axiosApi({
      method: 'GET',
      url: `/${serviceId}/systemApiScan`
    })
  },
  save(data) {
    return axiosApi({
      ...apiList.save,
      data
    })
  },
  update(data) {
    return axiosApi({
      ...apiList.update,
      data
    })
  },
  delete(data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  },
  preview(data) {
    return axiosApi({
      ...apiList.preview,
      data
    })
  },
  export(data) {
    return axiosApi({
      ...apiList.export,
      responseType: "blob",
      data
    })
  },
  import(data) {
    return axiosApi({
      ...apiList.import,
      data
    })
  }
}
