import commonApi from '@/api/Common'
import dictionaryItemApi from '@/api/DictionaryItem'

export const loadEnums = (codes, enums = {}, service = 'authority') => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    commonApi.enums({codes: codes}, service).then(response => {
      const res = response.data
      for (const code of codes) {
        enums[code] = res.data[code]
      }
    })
  }
}

export const initEnums = (codes, enums = {}) => {
  loadEnums(codes, enums, 'authority')
}

export const initFileEnums = (codes, enums = {}) => {
  loadEnums(codes, enums, 'file')
}
export const initMsgsEnums = (codes, enums = {}) => {
  loadEnums(codes, enums, 'msgs')
}

export const initDicts = (codes, dicts = {}) => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    dictionaryItemApi.list({codes: codes}).then(response => {
      const res = response.data
      for (const code of codes) {
        dicts[code] = res.data[code]
      }
    })
  }
}

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
