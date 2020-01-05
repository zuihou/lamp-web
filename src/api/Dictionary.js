import axiosApi from './AxiosApi.js'

const apiList = {
  page: `/authority/dictionary/page`,
  update: {
    method: 'PUT',
    url: `/authority/dictionary`
  },
  save: {
    method: 'POST',
    url: `/authority/dictionary`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/dictionary`
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
