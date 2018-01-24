import { getBoughtMsgs } from '~/api/premium'

export const state = () => ({
  params: {
    limit: 20,
    page: 1
  },
  msgs: []
})

export const mutations = {
  saveBoughtMsgs (state, data) {
    state.msgs = data.messages
    state.total = data.Total
  },
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  getBoughtMsgs ({ commit, rootState, state }) {
    console.log(rootState.auth)
    return getBoughtMsgs(state.params, rootState.auth.headers).then((res) => {
      commit('saveBoughtMsgs', res.data)
    })
  }
}
