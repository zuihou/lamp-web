import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/file/file/page`
  },
  upload: {
    method: 'POST',
    url: `/file/file/anyone/upload`
  },
  findUrlById: {
    method: 'POST',
    url: `/file/file/anyone/findUrlById`
  },
  download: {
    method: 'POST',
    url: `/file/file/download`
  },
  delete: {
    method: 'DELETE',
    url: `/file/file`
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  upload (data) {
    return axiosApi({
      ...apiList.upload,
      data
    })
  },
  findUrlById (data) {
    return axiosApi({
      ...apiList.findUrlById,
      data
    })
  },
  download (data) {
    return axiosApi({
      ...apiList.download,
      responseType: "blob",
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
