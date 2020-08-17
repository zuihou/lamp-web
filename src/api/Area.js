import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/area/page`,
  },
  update: {
    method: 'PUT',
    url: `/authority/area`
  },
  save: {
    method: 'POST',
    url: `/authority/area`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/area`
  },
  query: {
    method: 'POST',
    url: `/authority/area/query`
  },
  linkage: {
    method: 'GET',
    url: `/authority/area/linkage`
  },
  tree: {
    method: 'GET',
    url: `/authority/area/tree`
  },
}

export default {
  page(data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  tree(data) {
    return axiosApi({
      ...apiList.tree,
      data
    })
  },
  query(data) {
    return axiosApi({
      ...apiList.query,
      data
    })
  },
  linkage(data) {
    return axiosApi({
      ...apiList.linkage,
      data
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
  check(code, id) {
    return axiosApi({
      method: 'GET',
      url: `/authority/area/check/` + code,
      data: {id: id}
    })
  }
}
