import axiosApi from './AxiosApi.js'

const apiList = {
  captcha: `/oauth/anno/captcha`,
  login: `/oauth/noToken/login`,
  logout: `/oauth/noToken/logout`,
  router: `/oauth/menu/router`,
  resource: `/oauth/resource/visible`,
}

export default {
  getCaptcha (randomId) {
    return axiosApi({
      method: 'GET',
      url: apiList.captcha + `?key=${randomId}`,
      responseType: 'arraybuffer',
      meta: {
        "X-isToken": false
      }
    })
  },
  login (data, meta) {
    return axiosApi({
      method: 'POST',
      url: apiList.login,
      data,
      meta
    })
  },
  logout (data, meta) {
    return axiosApi({
      method: 'POST',
      formData: true,
      url: apiList.logout,
      data,
      meta
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
