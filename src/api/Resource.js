import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'GET',
    url: `/authority/resource/page`
  },
  save: {
    method: 'POST',
    url: `/authority/resource`
  },
  update: {
    method: 'PUT',
    url: `/authority/resource`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/resource`
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
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
  }
}
