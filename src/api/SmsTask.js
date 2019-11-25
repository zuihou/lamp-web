import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/smsTask/page`,
    method: 'GET'
  },
  save: {
    url: `/msgs/smsTask`,
    method: 'POST'
  },
  update: {
    url: `/msgs/smsTask`,
    method: 'PUT'
  },
  delete: {
    url: `/msgs/smsTask`,
    method: 'DELETE'
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
  },
  get (id) {
    return axiosApi({
      url: `/msgs/smsTask/${id}`,
      method: 'GET'
    })
  }
}
