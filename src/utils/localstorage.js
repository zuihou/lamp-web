const db = {
  save (key, value) {
    // if (value) {
    let projectName = process.env.VUE_APP_PROJECT_NAME
    localStorage.setItem(projectName + "_" + key, JSON.stringify(value))
    // } else {
    //   console.log("set 出错： key=" + key + ',value=' + value)
    // }

  },
  get (key, defaultValue = {}) {
    let projectName = process.env.VUE_APP_PROJECT_NAME
    try {
      return JSON.parse(localStorage.getItem(projectName + "_" + key)) || defaultValue
    } catch (err) {
      return defaultValue
    }
  },
  remove (key) {
    let projectName = process.env.VUE_APP_PROJECT_NAME
    localStorage.removeItem(projectName + "_" + key)
  },
  clear () {
    // localStorage.clear()

    // 为了不同路径能在同一个域下 独立使用， 清除缓存时，需要区分来

    let projectName = process.env.VUE_APP_PROJECT_NAME
    for (const key in localStorage) {
      if (key.indexOf(projectName) !== -1) {
        console.log(key)
        localStorage.removeItem(key)
      }
    }
  }
}

export default db
