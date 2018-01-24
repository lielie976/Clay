import { getSubject } from '~/api/subject'

export const state = () => ({
  params: {
    page: 1,
    limit: 10
  },
  Messages: {},
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
  changePage (state, page) {
    state.params.page = page
  }
}

export const actions = {
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getSubject(581, state.params).then((res) => {
        commit('saveInfo', res)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
