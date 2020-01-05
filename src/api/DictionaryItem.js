import axiosApi from './AxiosApi.js'

const apiList = {
  page: `/authority/dictionaryItem/page`,
  update: {
    method: 'PUT',
    url: `/authority/dictionaryItem`
  },
  save: {
    method: 'POST',
    url: `/authority/dictionaryItem`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/dictionaryItem`
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
