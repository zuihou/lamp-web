import axiosApi from './AxiosApi.js'
import db from '@/utils/localstorage'

const apiList = {
  generateId: {
    url: "/authority/common/generateId",
    method: "GET"
  },
  enums: {
    authority: {
      method: 'GET',
      url: `/authority/enums`
    },
    msgs: {
      method: 'GET',
      url: `/msgs/enums`
    },
    file: {
      method: 'GET',
      url: `/file/enums`
    }
  }
}

export default {
  uploadFile: `${process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX}${process.env.VUE_APP_BASE_API}/file/attachment/upload`,
  enums(data, service = 'authority') {
    return axiosApi({
      method: 'GET',
      url: `/${service}/enums`,
      data
    })
  },
  loadImg(data) {
    const token = db.get('TOKEN', '')
    const tenant = db.get('TENANT', '')
    return `${process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX}${process.env.VUE_APP_BASE_API}/file/attachment/download/${data.bizType}/${data.bizId}?token=${token}&tenant=${tenant}`
  },
  // 生成id
  generateId(data) {
    return axiosApi({
      ...apiList.generateId,
      data
    })
  },
  // 查询附件
  getAttachment(data) {
    return axiosApi({
      url: "/file/attachment",
      method: "get",
      data
    })
  },
  // 删除附件
  deleteAttachment(data) {
    return axiosApi({
      url: "/file/attachment",
      method: "delete",
      data
    })
  },
  // 下载附件
  downloadAttachment(data) {
    return axiosApi({
      url: `/file/attachment/download`,
      method: "get",
      responseType: "blob",
      data
    })
  },
  // 根据业务类型/业务id打包下载
  downloadAttachmentBiz(data) {
    return axiosApi({
      url: `/file/attachment/download/biz`,
      method: "get",
      responseType: "blob",
      data
    })
  }
}
