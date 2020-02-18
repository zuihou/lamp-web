import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    method: 'POST',
    url: `/authority/user/page`
  },
  save: {
    method: 'POST',
    url: `/authority/user`
  },
  update: {
    method: 'PUT',
    url: `/authority/user`
  },
  avatar: {
    method: 'PUT',
    url: `/authority/user/avatar`
  },
  delete: {
    method: 'DELETE',
    url: `/authority/user`
  },
  reset: {
    method: 'GET',
    url: `/authority/user/reset`
  },
  updatePassword: {
    method: 'PUT',
    url: `/authority/user/password`
  },
  reload: {
    method: 'POST',
    url: `/authority/user/reload`
  },
  preview: {
    method: 'POST',
    url: `/authority/user/preview`
  },
  export: {
    method: 'POST',
    url: `/authority/user/export`
  },
  import: {
    method: 'POST',
    url: `/authority/user/import`
  }
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  save (data) {
    return axiosApi({
      ...apiList.save,
      data
    })
  },
  update (data) {
    return axiosApi({
      ...apiList.update,
      data
    })
  },
  updatePassword (data) {
    return axiosApi({
      ...apiList.updatePassword,
      data
    })
  },
  delete (data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  },
  reset (data) {
    return axiosApi({
      ...apiList.reset,
      data
    })
  },
  avatar (data) {
    return axiosApi({
      ...apiList.avatar,
      data
    })
  },
  reload (userId) {
    return axiosApi({
      ...apiList.reload,
      formData: true,
      data: { userId: userId }
    })
  },
  preview (data) {
    return axiosApi({
      ...apiList.preview,
      data
    })
  },
  export (data) {
    return axiosApi({
      ...apiList.export,
      responseType: "blob",
      data
    })
  },
  import (data) {
    return axiosApi({
      ...apiList.import,
      data
    })
  }
}
