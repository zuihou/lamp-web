import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'GET',
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
  }
}
