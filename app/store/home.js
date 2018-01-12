import { getPcMsgs } from '~/api/message'
import { getAvailableAd } from '~/api/settings'

export const state = () => ({
  msgs: [],
  banner: {}
})

export const mutations = {
  saveMsgs (state, data) {
    state.msgs = data.NewMsgs
  },
  saveBanner (state, data) {
    state.banner = data
  }
}

export const actions = {
  getMsgs ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getPcMsgs({ ...payload }).then((res) => {
        commit('saveMsgs', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  getBanner ({ commit }) {
    return new Promise((resolve, reject) => {
      getAvailableAd({ PosIds: 600001 }).then((res) => {
        const data = res.find(i => i.PosId === 600001)
        commit('saveBanner', data)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
