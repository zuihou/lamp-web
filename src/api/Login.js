import axiosApi from './AxiosApi.js'

const apiList = {
  getCaptcha: `/oauth/anno/captcha`,
  login: `/oauth/anno/token`,
  router: `/oauth/menu/router`,
  resource: `/oauth/resource/visible`,
}

export default {
  getCaptcha (randomId) {
    return axiosApi({
      method: 'GET',
      url: apiList.getCaptcha + `?key=${randomId}`,
      responseType: 'arraybuffer',
      meta: {
        "X-isToken": false
      }
    })
  },
  login (data) {
    return axiosApi({
      method: 'POST',
      url: apiList.login,
      data
    })
  },
  getRouter (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.router,
      data: data || {}
    })
  },
  getResource (data) {
    return axiosApi({
      method: 'GET',
      url: apiList.resource,
      data: data || {}
    })
  }
}
