import axiosApi from './AxiosApi.js'

const apiList = {
  page: `/authority/application/page`,
  update: {
    method: 'PUT',
    url: `/authority/application`
  },
  save: {
    method: 'POST',
    url: `/authority/application`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/application`
  }
}

export default {
  page (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.page,
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
