import { getSubject } from '~/api/subject'
import { getSubjectDetail } from '~/api/premium'

export const state = () => ({
  params: {
    page: 1,
    limit: 10
  },
  Messages: [],
  Subject: {},
  NextMark: null,
  hotMsgs: [],
  trialMsgs: []
})

export const mutations = {
  saveInfo (state, data) {
    state.Subject = data.Subject
    state.Messages = data.Messages
    state.NextMark = data.NextMark
    state.trialMsgs = data.Messages.slice(0, 3)
  },
  saveSubjectDetail (state, data) {
    state.subjectDetail = data
  },
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  getInfo ({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      getSubject(id, state.params).then((res) => {
        commit('saveInfo', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  getSubjectDetail ({ commit, state, rootState }, id) {
    return new Promise((resolve, reject) => {
      getSubjectDetail(id, state.params, rootState.auth.headers).then((res) => {
        commit('saveSubjectDetail', res)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
