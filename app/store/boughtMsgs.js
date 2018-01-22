// import { getBoughtMsgs } from '~/api/settings'

export const state = () => ({
  params: {
    limit: 20,
    page: 1
  },
  msgs: []
})

export const mutations = {
  // saveBoughtMsgs (state, data) {
  //   state.msgs = data
  // },
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  // getBoughtMsgs ({ commit }) {
  //   return getBoughtMsgs().then((res) => {
  //     commit('saveBoughtMsgs', res)
  //   })
  // }
}
