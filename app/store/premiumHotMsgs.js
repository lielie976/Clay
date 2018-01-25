import { getSubjectHotMsgs } from '~/api/premium'

export const state = () => ({})

export const mutations = {
  saveHotMsgs (state, data) {
    state[data.id] = data.msgs
  }
}

export const actions = {
  async getHotMsgs ({ commit }, id) {
    const res = await getSubjectHotMsgs(id)
    if (res.code === 20000) {
      commit('saveHotMsgs', {
        id,
        msgs: res.data.messages
      })
    }
  }
}
