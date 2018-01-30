/* eslint-disable no-debugger */
import * as Cookies from 'js-cookie'
export const state = () => ({
  userInfo: {
    isLogged: false,
    Token: '',
    nickname: ''
  }
})

export const mutations = {
  saveUserInfo (state, data) {
    state.userInfo = data
  }
}

export const actions = {
  saveAuth ({ state, commit }, payload) {
    return commit('saveUserInfo', {
      isLogged: true,
      Token: payload.Token,
      nickname: payload.nickname
    })
  },
  logOut ({ state, commit }) {
    if (process.env.ENV === 'production') {
      Cookies.set('token', '', {
        domain: '.xuangubao.cn',
        path: '/',
        expires: 365
      });
      Cookies.set('nickname', '', {
        domain: '.xuangubao.cn',
        path: '/',
        expires: 365
      });
      Cookies.set('portrait', '', {
        domain: '.xuangubao.cn',
        path: '/',
        expires: 365
      });
    } else {
      Cookies.set('token', '', {
        path: '/',
        expires: 365
      });
      Cookies.set('nickname', '', {
        path: '/',
        expires: 365
      });
      Cookies.set('portrait', '', {
        path: '/',
        expires: 365
      });
    }
    return commit('saveUserInfo', {
      isLogged: false,
      Token: '',
      nickname: ''
    })
  }
}
