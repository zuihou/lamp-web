import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/msgsCenterInfo/page`,
    method: 'GET'
  },
  mark: {
    url: `/msgs/msgsCenterInfo/mark`,
    method: 'GET'
  },
  save: {
    url: `/msgs/msgsCenterInfo`,
    method: 'POST'
  },
  delete: {
    url: `/msgs/msgsCenterInfo`,
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
  delete (data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  },
  mark (data) {
    return axiosApi({
      ...apiList.mark,
      data
    })
  },
  get (id) {
    return axiosApi({
      url: `/msgs/msgsCenterInfo/${id}`,
      method: 'GET'
    })
  }
}
