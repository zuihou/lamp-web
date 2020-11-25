import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/tenant/datasourceConfig/page`
  },
  query: {
    method: 'POST',
    url: `/tenant/datasourceConfig/query`
  },
  update: {
    method: 'PUT',
    url: `/tenant/datasourceConfig`
  },
  save: {
    method: 'POST',
    url: `/tenant/datasourceConfig`
  },
  delete: {
    method: 'DELETE',
    url: `/tenant/datasourceConfig`
  },
  export: {
    method: 'POST',
    url: `/tenant/datasourceConfig/export`
  },
  preview: {
    method: 'POST',
    url: `/tenant/datasourceConfig/preview`
  },
  import: {
    method: 'POST',
    url: `/tenant/datasourceConfig/import`
  },
  testConnect: {
    method: 'POST',
    url: `/tenant/datasourceConfig/testConnect`
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
  query (data, custom = {}) {
    return axiosApi({
      ...apiList.query,
      data,
      custom
    })
  },
  save (data, custom = {}) {
    return axiosApi({
      ...apiList.save,
      data,
      custom
    })
  },
  update (data, custom = {}) {
    return axiosApi({
      ...apiList.update,
      data,
      custom
    })
  },
  delete (data, custom = {}) {
    return axiosApi({
      ...apiList.delete,
      data,
      custom
    })
  },
  export (data, custom = {}) {
    return axiosApi({
      ...apiList.export,
      responseType: "blob",
      data,
      custom
    })
  },
  preview (data, custom = {}) {
    return axiosApi({
      ...apiList.preview,
      data,
      custom
    })
  },
  import (data, custom = {}) {
    return axiosApi({
      ...apiList.import,
      data,
      custom
    })
  },
  testConnect (data, custom = {}) {
    return axiosApi({
      ...apiList.testConnect,
      data,
      custom
    })
  }
}
