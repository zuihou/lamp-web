import axiosApi from './AxiosApi.js'

/**
 * 若后端要使用zuul服务，以下接口需要加一个前缀 /gate
 */
const apiList = {
  page: {
    method: 'POST',
    // url: `/gate/gateway/blockList/page`,
    url: `/gateway/blockList/page`,
  },
  query: {
    method: 'POST',
    url: `/gateway/blockList/query`,
  },
  update: {
    method: 'PUT',
    url: `/gateway/blockList`
  },
  save: {
    method: 'POST',
    url: `/gateway/blockList`
  },
  delete: {
    method: 'DELETE',
    url: `/gateway/blockList`
  },
  export: {
    method: 'POST',
    url: `/gateway/blockList/export`
  },
  preview: {
    method: 'POST',
    url: `/gateway/blockList/preview`
  },
  import: {
    method: 'POST',
    url: `/gateway/blockList/import`
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
  }
}
