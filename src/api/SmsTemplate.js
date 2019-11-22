import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/smsTemplate/page`,
    method: 'GET'
  },
  save: {
    url: `/msgs/smsTemplate`,
    method: 'POST'
  },
  update: {
    url: `/msgs/smsTemplate`,
    method: 'PUT'
  },
  delete: {
    url: `/msgs/smsTemplate`,
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
  }
}
