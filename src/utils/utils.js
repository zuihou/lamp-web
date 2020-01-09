/**
 * 判断终端以及浏览器
 * userAgent string User-Agent信息
 */
export const readUserAgent = ua => {
  let data = {
    terminal: '',
    browser: '',
    terminalType: {}
  }
  data.terminalType = {
    trident: ua.indexOf('Trident') > -1, // IE内核
    presto: ua.indexOf('Presto') > -1, // opera内核
    webKit: ua.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!ua.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, // android终端
    iPhone: ua.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: ua.indexOf('iPad') > -1, // 是否iPad
    webApp: ua.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
    weixin: ua.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    qq: ua.match(/\sQQ/i) === ' qq' // 是否QQ
  }
  if (
    data.terminalType.ios ||
    data.terminalType.iPhone ||
    data.terminalType.iPad
  ) {
    data.terminal = '苹果'
  } else if (data.terminalType.android) {
    data.terminal = '安卓'
  } else {
    data.terminal = 'PC'
  }
  if (/msie/i.test(ua) && !/opera/.test(ua)) {
    data.browser = 'IE'
  } else if (/firefox/i.test(ua)) {
    data.browser = 'Firefox'
  } else if (/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)) {
    data.browser = 'Chrome'
  } else if (/opera/i.test(ua)) {
    data.browser = 'Opera'
  } else if (/iPad/i.test(ua)) {
    data.browser = 'iPad'
  } else if (
    /webkit/i.test(ua) &&
    !(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua))
  ) {
    data.browser = 'Safari'
  } else {
    data.browser = '未知'
  }
  return data
}

// 格式化文件大小 单位：B、KB、MB、GB
const renderSize = value => {
  if (null == value || value == '') {
    return "0 B"
  }
  var unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  size = size.toFixed(2)
  if (unitArr[index]) {
    return size + unitArr[index]
  }
  return '文件太大'
}

const converEnum = obj => {
  const list = []
  if (obj) {
    for (let key in obj) {
      list.push({
        text: obj[key],
        value: key
      })
    }
  }
  return list
}

export { renderSize, converEnum }
