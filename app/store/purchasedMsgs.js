import { getPurchasedMsgs } from '~/api/premium'
import { refineApi } from '~/utils/helpers'

export const state = () => ({
  params: {
    limit: 20,
    page: 1
  },
  msgs: []
})

export const mutations = {
  savePurchasedMsgs (state, data) {
    state.msgs = data.Messages
    state.total = data.Total
  },
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  getPurchasedMsgs ({ commit, rootState, state }) {
    return getPurchasedMsgs(state.params, rootState.auth.headers).then((res) => {
      commit('savePurchasedMsgs', refineApi(res.data))
    })
  }
}
