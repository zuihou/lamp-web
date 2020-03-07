import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/msgs/smsSendStatus/page`,
    method: 'POST'
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  }
}
