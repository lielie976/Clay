import { getYuanchuangTop, getYuanchuangLatest, getYuanchuangRank, getYuanchuangSubj } from '~/api/yuanchuang'

export const state = () => ({
  top: [],
  latest: [],
  dayRank: [],
  weekRank: [],
  msgs: {}
})

export const getters = {
  firstYuanchuangTop (state) {
    return state.top.length ? state.top[0] : {}
  }
}

export const mutations = {
  saveTop (state, data) {
    state.top = data
  },
  saveLatest (state, data) {
    state.latest = data
  },
  savedayRank (state, data) {
    state.dayRank = data
  },
  saveweekRank (state, data) {
    state.weekRank = data
  },
  saveMsgs (state, data) {
    state.msgs = data.Messages
  },
  mergeMsgs (state, data) {
    state.msgs = [...state.msgs, ...data.Messages]
  }
}

export const actions = {
  getTop ({ commit }, payload) {
    return getYuanchuangTop().then((res) => {
      commit('saveTop', res)
    })
  },
  getLatest ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getYuanchuangLatest().then((res) => {
        commit('saveLatest', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  getdayRank ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getYuanchuangRank(1).then((res) => {
        commit('savedayRank', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  getweekRank ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getYuanchuangRank(2).then((res) => {
        commit('saveweekRank', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  getYuanchuangSubj ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getYuanchuangSubj(payload.id, payload.params).then((res) => {
        commit('saveMsgs', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  loadMoreYuanchuangSubj ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getYuanchuangSubj(payload.id, payload.params).then((res) => {
        commit('mergeMsgs', res)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
