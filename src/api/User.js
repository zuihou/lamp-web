import axiosApi from './AxiosApi.js'

const apiList = {
  findUserPage: `/authority/user/page`
}

export default {
  findUserPage (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.findUserPage,
      formData: true,
      data
    })
  }
}
