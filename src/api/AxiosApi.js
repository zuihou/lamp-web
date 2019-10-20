import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import db from '@/utils/localstorage'

// 请求添加条件，如token
axios.interceptors.request.use(
  config => {
    config.headers.token = db.get('TOKEN') || ''
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 接口返回处理
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

function handleError (error, reject) {
  if (error.code === 'ECONNABORTED') {
    Message({
      message: '请求超时'
    })
  } else if (error.response && error.response.data) {
    Message({
      message: error.response.data
    })
  } else if (error.message) {
    Message({
      message: error.message
    })
  }
  reject(error)
}

function handleSuccess (res, resolve) {
  if (!res.data.isSuccess && res.data.msg) {
    // 未登录
    if (res.data.code === 40001) {
      MessageBox.alert(res.data.msg, '提醒', {
        confirmButtonText: '确定',
        callback: () => {
          window.location.hash = '/'
        }
      })
    } else {
      Message.error(res.data.msg)
    }
  }
  resolve(res.data)
}

// http请求
const httpServer = (opts) => {
  // 公共参数
  const publicParams = {
    ts: Date.now()
  }

  // http默认配置
  const method = opts.method.toUpperCase()
  const httpDefaultOpts = {
    method,
    baseURL: process.env.VUE_APP_BASE_API,
    url: opts.url,
    responseType: opts.responseType || '',
    timeout: 20000
  }
  const dataRequest = ['PUT', 'POST', 'PATCH']
  if (dataRequest.includes(method)) {
    httpDefaultOpts.data = opts.data || {}
  } else {
    httpDefaultOpts.params = {
      ...publicParams,
      ...(opts.data || {})
    }
  }

  // formData转换
  if (opts.formData) {
    httpDefaultOpts.transformRequest = [data => {
      const formData = new FormData()
      if (data) {
        Object.entries(data).forEach(item => {
          formData.append(item[0], item[1])
        })
      }
      return formData
    }]
  }

  const promise = new Promise((resolve, reject) => {
    axios(httpDefaultOpts).then(response => {
      handleSuccess(response, resolve)
    }).catch(error => {
      handleError(error, reject)
    })
  })
  return promise
}

export default httpServer
