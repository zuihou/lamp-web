import db from '@/utils/localstorage'

export default {
  namespaced: true,
  state: {
    accessToken: db.get('ACCESS_TOKEN'),
    refreshToken: db.get('REFRESH_TOKEN'),
    expireTime: db.get('EXPIRE_TIME', 0),
    user: db.get('USER'),
    permissions: db.get('PERMISSIONS'),
    routes: db.get('USER_ROUTER') || []
  },
  mutations: {
    setAccessToken(state, val) {
      db.save('ACCESS_TOKEN', val)
      state.accessToken = val
    },
    setRefreshToken(state, val) {
      db.save('REFRESH_TOKEN', val)
      state.refreshToken = val
    },
    setExpireTime(state, val) {
      db.save('EXPIRE_TIME', val)
      state.expireTime = val
    },
    setUser(state, val) {
      db.save('USER', val)
      state.user = val
    },
    setPermissions(state, val) {
      db.save('PERMISSIONS', val)
      state.permissions = val
    },
    setRoutes(state, val) {
      db.save('USER_ROUTER', val)
      state.routes = val
    }
  }
}
