import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'GET',
    url: `/file/attachment/page`
  },
  upload: {
    method: 'POST',
    url: `/file/attachment/upload`
  },
  download: {
    method: 'GET',
    url: `/file/attachment/download`
  },
  downloadBiz: {
    method: 'GET',
    url: `/file/attachment/download/biz`
  },
  downloadUrl: {
    method: 'GET',
    url: `/file/attachment/download/url`
  },
  delete: {
    method: 'DELETE',
    url: `/file/attachment`
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      formData: true,
      data
    })
  },
  upload (data) {
    return axiosApi({
      ...apiList.upload,
      data
    })
  },
  download (data) {
    return axiosApi({
      ...apiList.download,
      responseType: "blob",
      // responseType: "arraybuffer",
      data
    })
  },
  downloadBiz (data) {
    return axiosApi({
      ...apiList.downloadBiz,
      data
    })
  },
  downloadUrl (data) {
    return axiosApi({
      ...apiList.downloadUrl,
      data
    })
  },
  delete (data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  }
}
