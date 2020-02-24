import axiosApi from './AxiosApi.js'

const apiList = {
  getVisitList: `/authority/dashboard/visit`
}

export default {
  getVisitList (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.getVisitList,
      data
    })
  }
}
