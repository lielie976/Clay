import { getSubjectHotMsgs } from '~/api/premium'
import { refineApi } from '~/utils/helpers'

export const state = () => ({})

export const mutations = {
  saveHotMsgs (state, data) {
    state[data.Id] = data.Msgs
  }
}

export const actions = {
  async getHotMsgs ({ commit }, id) {
    const res = await getSubjectHotMsgs(id)
    if (res.code === 20000) {
      commit('saveHotMsgs', refineApi({
        id,
        msgs: res.data.messages
      }))
    }
  }
}
