import { getStocksReal } from '~/api/wows'
import { extractFieldsToObj } from '~/utils/helpers'

export const state = () => ({
  real: {},
  stocks: []
})

export const getters = {}

export const mutations = {
  mergeReal (state, data) {
    state.real = {
      ...state.real,
      ...data
    }
  },
  addStock (state, stocks) {
    const allStocks = state.stocks
    const unexistedStocks = stocks.filter(i => allStocks.indexOf(i) === -1)
    state.stocks = [...allStocks, ...unexistedStocks]
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
  },
  refreshStocks ({ commit, state }) {
    getStocksReal({
      stocks: state.stocks.join(',')
    }).then((res) => {
      commit('mergeReal', extractFieldsToObj(res.data.snapshot))
    }).catch(() => {})
  },
  addStock ({ commit }, stocks) {
    commit('addStock', stocks)
  }
}
