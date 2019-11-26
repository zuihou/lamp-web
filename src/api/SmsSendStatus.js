import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/smsSendStatus/page`,
    method: 'GET'
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      formData: true,
      data
    })
  }
}
