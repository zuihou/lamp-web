import axiosApi from './AxiosApi.js'

const apiList = {
  findUserPage: {
    method: 'GET',
    url: `/authority/user/page`
  },
  save: {
    method: 'POST',
    url: `/authority/user`
  },
  update: {
    method: 'PUT',
    url: `/authority/user`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/user`
  },
  reset: {
    method: 'GET',
    url: `/authority/user/reset`
  }
}

export default {
  findUserPage (data) {
    return axiosApi({
      ...apiList.findUserPage,
      formData: true,
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
  reset (data) {
    return axiosApi({
      ...apiList.reset,
      data
    })
  }
}
