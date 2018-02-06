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
      nickname: decodeURIComponent(payload.nickname)
    })
  },
  checkUserState ({state, commit}) {
    if (Cookies.get('token') === '') {
      Cookies.remove('token', {
        domain: '.xuangubao.cn',
        path: '/'
      });
    }
    if (Cookies.get('nickname') === '') {
      Cookies.remove('nickname', {
        domain: '.xuangubao.cn',
        path: '/'
      });
    }
    if (Cookies.get('nickname') === '') {
      Cookies.remove('nickname', {
        domain: '.xuangubao.cn',
        path: '/'
      });
    }
  },
  logOut ({ state, commit }) {
    if (process.env.ENV === 'production') {
      Cookies.remove('token', {
        domain: '.xuangubao.cn',
        path: '/'
      });
      Cookies.remove('nickname', {
        domain: '.xuangubao.cn',
        path: '/'
      });
      Cookies.remove('portrait', {
        domain: '.xuangubao.cn',
        path: '/'
      });
    } else {
      if (Cookies.get('token') === '') {
        Cookies.remove('token', {
          domain: '.xuangubao.cn',
          path: '/'
        });
      }
      if (Cookies.get('nickname') === '') {
        Cookies.remove('nickname', {
          domain: '.xuangubao.cn',
          path: '/'
        });
      }
      if (Cookies.get('nickname') === '') {
        Cookies.remove('nickname', {
          domain: '.xuangubao.cn',
          path: '/'
        });
      }
      Cookies.remove('token', '', {
        path: '/'
      });
      Cookies.remove('nickname', '', {
        path: '/'
      });
      Cookies.remove('portrait', '', {
        path: '/'
      });
    }
    localStorage.removeItem('_xgb_userinfo')
    return commit('saveUserInfo', {
      isLogged: false,
      Token: '',
      nickname: ''
    })
  }
}
