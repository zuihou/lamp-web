import axiosApi from './AxiosApi.js'

const apiList = {
  allTree: `/authority/org/tree`
}

export default {
  allTree (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.allTree,
      formData: true,
      data
    })
  }
}
