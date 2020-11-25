import commonApi from '@/api/Common'
import dictionaryApi from '@/api/Dictionary'

export const loadEnums = (codes, enums = {}) => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    commonApi.enums({codes: codes}).then(response => {
      const res = response.data
      for (const code of codes) {
        enums[code] = res.data[code]
      }
    })
  }
}

/**
 * 初始化权限服务枚举
 * @param codes
 * @param enums
 */
export const initEnums = (codes, enums = {}) => {
  loadEnums(codes, enums)
}
/**
 * 初始化文件服务枚举
 * @param codes
 * @param enums
 */
export const initFileEnums = (codes, enums = {}) => {
  loadEnums(codes, enums)
}
/**
 * 初始化消息服务枚举
 * @param codes
 * @param enums
 */
export const initMsgEnums = (codes, enums = {}) => {
  loadEnums(codes, enums)
}

/**
 * 初始化字典
 * @param codes
 * @param dicts
 */
export const initDicts = (codes, dicts = {}) => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    dictionaryApi.codes({codes: codes}).then(response => {
      const res = response.data
      for (const code of codes) {
        dicts[code] = res.data[code]
      }
    })
  }
}

/**
 * 下载方法
 * @param response
 */
export const downloadFile = (response) => {
  const res = response.data;
  const type = res.type;
  if (type.includes("application/json")) {
    let reader = new FileReader();
    reader.onload = e => {
      if (e.target.readyState === 2) {
        let data = JSON.parse(e.target.result);
        this.$message({
          message: data.msg,
          type: "warning"
        });
      }
    };
    reader.readAsText(res);
  } else {
    let disposition = response.headers["content-disposition"];
    let fileName = "下载文件.zip";
    if (disposition) {
      let respcds = disposition.split(";");
      for (let i = 0; i < respcds.length; i++) {
        let header = respcds[i];
        if (header !== null && header !== "") {
          let headerValue = header.split("=");
          if (headerValue !== null && headerValue.length > 0) {
            if (headerValue[0].trim().toLowerCase() === "filename") {
              fileName = decodeURI(headerValue[1]);
              break;
            }
          }
        }
      }
    }
    //处理引号
    if ((fileName.startsWith("'") || fileName.startsWith('"')) && (fileName.endsWith("'") || fileName.endsWith('"'))) {
      fileName = fileName.substring(1, fileName.length - 1)
    }

    let blob = new Blob([res]);
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

// 初始化查询参数
export const initQueryParams = params => {
  const defParams = {
    size: 10,
    current: 1,
    sort: 'id',
    order: 'descending',
    model: {

    },
    extra: {},
    timeRange: null
  };
  return params ? { ...defParams, ...params } : defParams;
}
