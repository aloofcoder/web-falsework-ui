import { getInfo, login, logout } from '@/api/user'
import router, { resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { constantRoutes, otherRoutes } from '@/router/index'
import { getRouterList, getAuthList } from '@/utils/index'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    auth_list: [],
    router_list: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_AUTH_LIST: (state, auths) => {
    state.auth_list = auths
  },
  SET_ROUTER_LIST: (state, routers) => {
    state.router_list = constantRoutes.concat(routers)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data, auths, menus } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        let menuList = getRouterList(menus);
        let authList = getAuthList(auths)
        commit('SET_AUTH_LIST', authList)
        commit('SET_ROUTER_LIST', menuList)
        router.addRoutes(menuList)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

