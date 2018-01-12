import { getStocksReal } from '~/api/wows'
import { extractFieldsToObj } from '~/utils/helpers'

export const state = () => ({
  real: {}
})

export const getters = {
  // firstYuanchuangTop (state) {
  //   return state.top.length ? state.top[0] : {}
  // }
}

export const mutations = {
  mergeReal (state, data) {
    state.real = {
      ...state.real,
      ...data
    }
  }
}

export const actions = {
  getReal ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getStocksReal({
        stocks: payload.stocks
      }).then((res) => {
        commit('mergeReal', extractFieldsToObj(res.data.snapshot))
        resolve()
      }).catch(err => reject(err))
    })
  }
}
