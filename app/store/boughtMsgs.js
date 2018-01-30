import { getBoughtMsgs } from '~/api/premium'
import { refineApi } from '~/utils/helpers'

export const state = () => ({
  params: {
    limit: 20,
    page: 1
  },
  msgs: []
})

export const mutations = {
  saveBoughtMsgs (state, data) {
    state.msgs = data.Messages
    state.total = data.Total
  },
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  getBoughtMsgs ({ commit, rootState, state }) {
    return getBoughtMsgs(state.params, rootState.auth.headers).then((res) => {
      commit('saveBoughtMsgs', refineApi(res.data))
    })
  }
}
