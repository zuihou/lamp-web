const db = {
  save (key, value) {
    let projectName = process.env.VUE_APP_PROJECT_NAME
    localStorage.setItem(projectName + "_" + key, JSON.stringify(value))
  },
  get (key, defaultValue = {}) {
    let projectName = process.env.VUE_APP_PROJECT_NAME
    return JSON.parse(localStorage.getItem(projectName + "_" + key)) || defaultValue
  },
  remove (key) {
    let projectName = process.env.VUE_APP_PROJECT_NAME
    localStorage.removeItem(projectName + "_" + key)
  },
  clear () {
    // localStorage.clear()

    // 为了使 zuihou-admin-ui 和 zuihou-ui 能在同一个域下 独立使用， 清除缓存时，需要区分来

    let projectName = process.env.VUE_APP_PROJECT_NAME
    for (const key in localStorage) {
      console.log(key)
      if (key.indexOf(projectName) !== -1) {
        localStorage.removeItem(key)
      }
    }
  }
}

export default db
