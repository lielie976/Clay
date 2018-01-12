import { getZhutikuRank } from '~/api/zhutiku'
import { extractFieldsToArray } from '~/utils/helpers'

export const state = () => ({
  zhutikuAsc: [],
  zhutikuDesc: []
})

export const getters = {
  homeZhutiku: (state, getters) => [...state.zhutikuDesc.slice(0, 5), ...state.zhutikuAsc.slice(0, 3)]
}

export const mutations = {
  saveZhutikuAsc (state, data) {
    state.zhutikuAsc = data
  },
  saveZhutikuDesc (state, data) {
    state.zhutikuDesc = data
  }
}

export const actions = {
  getZhutikuRankAsc ({ commit }) {
    return new Promise((resolve, reject) => {
      getZhutikuRank({ count: 9, is_asc: true, rank_type: 'core_pcp_rank' }).then((res) => {
        commit('saveZhutikuAsc', extractFieldsToArray(res.data))
        resolve()
      }).catch(err => reject(err))
    })
  },
  getZhutikuRankDesc ({ commit }) {
    return new Promise((resolve, reject) => {
      getZhutikuRank({ count: 9, is_asc: false, rank_type: 'core_pcp_rank' }).then((res) => {
        commit('saveZhutikuDesc', extractFieldsToArray(res.data))
        resolve()
      }).catch(err => reject(err))
    })
  }
}
