export const state = () => ({
  login: {
    show: false,
    // 0->登陆 1->注册 2->找回
    mode: 0
  }
})

export const mutations = {
  saveLoginState (state, data) {
    state.login = data
  }
}

export const actions = {
  showLogin ({ state, commit }) {
    if (!state.login.show || state.login.mode !== 0) {
      commit('saveLoginState', {
        show: true,
        mode: 0
      })
    }
  },
  showReg ({ state, commit }) {
    if (!state.login.show || state.login.mode !== 1) {
      commit('saveLoginState', {
        show: true,
        mode: 1
      })
    }
  },
  showForget ({ state, commit }) {
    if (!state.login.show || state.login.mode !== 2) {
      commit('saveLoginState', {
        show: true,
        mode: 2
      })
    }
  },
  close ({ state, commit }) {
    commit('saveLoginState', {
      show: false,
      mode: 0
    })
  }
}
