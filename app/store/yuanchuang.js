import { getYuanchuangTop } from '~/api/message'

export const state = () => ({
  top: []
})

export const getters = {
  firstYuanchuangTop (state) {
    return state.top.length ? state.top[0] : {}
  }
}

export const mutations = {
  saveTop (state, data) {
    state.top = data
  }
}

export const actions = {
  getTop ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getYuanchuangTop().then((res) => {
        commit('saveTop', res)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
