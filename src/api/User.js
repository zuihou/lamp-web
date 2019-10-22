import axiosApi from './AxiosApi.js'

const apiList = {
  findUserPage: `/authority/dashboard/visit`
}

export default {
  findUserPage (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.getVisitList,
      formData: true,
      data
    })
  }
}
