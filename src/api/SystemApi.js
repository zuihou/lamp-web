import axiosApi from './AxiosApi.js'

const apiList = {
  page: `/authority/systemApi/page`,
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
