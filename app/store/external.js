import { getBaiduTTSToken } from '~/api/settings'

export const state = () => ({
  baiduTTSToken: {}
})

export const mutations = {
  saveBaiduTTSToken (state, data) {
    state.baiduTTSToken = data
  }
}

export const actions = {
  getBaiduTTSToken ({ commit }) {
    return getBaiduTTSToken().then((res) => {
      commit('saveBaiduTTSToken', res)
    }).catch(err => reject(err))
  }
}
