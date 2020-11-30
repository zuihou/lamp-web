import axiosApi from './AxiosApi.js'

const apiList = {
  list: {
    method: 'POST',
    url: `/authority/online/list`
  },
  t: {
    method: 'POST',
    url: `/authority/online/t`
  }
}

export default {
  list(data) {
    return axiosApi({
      ...apiList.list,
      data
    })
  },
  t(data) {
    return axiosApi({
      ...apiList.t,
      formData: true,
      data
    })
  }
}
