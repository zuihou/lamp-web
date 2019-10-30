import axiosApi from './AxiosApi.js'

const apiList = {
  getCaptcha: `/authority/anno/captcha`,
  login: `/authority/anno/login`,
  getRouter: `/authority/menu/router`,
  loginLog: function (account) {
    return `/authority/loginLog/success/${account}`
  }
}

export default {
  getCaptcha (randomId) {
    return axiosApi({
      method: 'GET',
      url: apiList.getCaptcha + `?key=${randomId}`,
      responseType: 'arraybuffer'
    })
  },
  login (data) {
    return axiosApi({
      method: 'POST',
      url: apiList.login,
      formData: true,
      data
    })
  },
  getRouter (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.getRouter,
      formData: true,
      data: data || {}
    })
  },
  loginLog (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.loginLog(data),
      data: data || {}
    })
  }
}
