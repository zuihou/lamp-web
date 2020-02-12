import axiosApi from './AxiosApi.js'

const apiList = {
  page: `/authority/area/page`,
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
  find: {
    method: 'GET',
    url: `/authority/area`
  },
  tree: {
    method: 'GET',
    url: `/authority/area/tree`
  },
}

export default {
  page(data) {
    return axiosApi({
      method: 'GET',
      url: apiList.page,
      formData: true,
      data
    })
  },
  tree(data) {
    return axiosApi({
      ...apiList.tree,
      formData: true,
      data
    })
  },
  find(data) {
    return axiosApi({
      ...apiList.find,
      formData: true,
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
