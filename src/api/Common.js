import axiosApi from './AxiosApi.js'

const apiList = {
  // 获取当前系统的所有枚举
  dictionaryEnums: '/gate/dictionary/enums'
}

export default {
  uploadFile: `${process.env.VUE_APP_PROD_REQUEST_DOMAIN_PREFIX}${process.env.VUE_APP_BASE_API}/file/attachment/upload`,
  findPage (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.findPage,
      formData: true,
      data
    })
  },
  dictionaryEnums () {
    return axiosApi({
      method: 'GET',
      url: apiList.dictionaryEnums
    })
  }
}
