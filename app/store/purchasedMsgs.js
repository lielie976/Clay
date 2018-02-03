import { getPurchasedMsgs } from '~/api/premium'
import { refineApi } from '~/utils/helpers'

export const state = () => ({
  params: {
    limit: 10,
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
  async getPurchasedMsgs ({ commit, rootState, state }) {
    const res = await getPurchasedMsgs(state.params, rootState.auth.headers)
    commit('savePurchasedMsgs', refineApi(res.data))
  },
  async changePage ({ commit, dispatch }, page) {
    commit('changePage', page)
    await dispatch('getPurchasedMsgs')
  }
}
