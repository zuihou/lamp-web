import axiosApi from './AxiosApi.js'

const apiList = {
  page: `/authority/station/page`
}

export default {
  page (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.page,
      formData: true,
      data
    })
  }
}
