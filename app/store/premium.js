import { getSubjectInfo, getSubjectPremiumMsgs, getSubjectTrialMsgs } from '~/api/premium'

export const state = () => ({
  params: {
    page: 1,
    limit: 10
  },
  msgs: [],
  subjectInfo: {},
  trialMsgs: []
})

export const mutations = {
  saveId (state, id) {
    state.id = id
  },
  saveSubjectDetail (state, data) {
    state.subjectInfo = data
  },
  saveMsgs (state, data) {
    state.msgs = data.messages
  },
  saveTrialMsgs (state, data) {
    state.trialMsgs = data.messages
  },
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  changePage ({ commit, state, dispatch }, page) {
    commit('changePage', page)
    dispatch('getMsgs', state.id)
  },
  async getMsgs ({ commit, state }, id) {
    const res = await getSubjectPremiumMsgs(id, state.params)
    if (res.code === 20000) {
      commit('saveMsgs', res.data)
    }
  },
  async getTrialMsgs ({ commit }, id) {
    const res = await getSubjectTrialMsgs(id)
    if (res.code === 20000) {
      commit('saveTrialMsgs', res.data)
    }
  },
  getInfo ({ commit, state, rootState }, id) {
    return new Promise((resolve, reject) => {
      getSubjectInfo(id, rootState.auth.headers).then((res) => {
        if (res.code === 20000) {
          commit('saveSubjectDetail', res.data.subject_info)
        }
        resolve()
      }).catch(err => reject(err))
    })
  },
  async init ({ commit, dispatch }, id) {
    commit('saveId', id)
    await dispatch('getInfo', id)
    await dispatch('getMsgs', id)
    await dispatch('getTrialMsgs', id)
  }
}
