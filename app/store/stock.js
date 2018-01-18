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
  addStock (state, stockSymbols) {
    const unexistedStocks = stockSymbols.filter(i => state.stocks.indexOf(i) === -1)
    state.stocks = [...state.stocks, ...unexistedStocks]
  }
}

export const actions = {
  getReal ({ commit, dispatch }, payload) {
    dispatch('addStock', payload.symbols)
    return new Promise((resolve, reject) => {
      getStocksReal({
        stocks: payload.symbols.join(','),
        fields: payload.fields
      }).then((res) => {
        commit('mergeReal', extractFieldsToObj(res.data.snapshot))
        resolve(extractFieldsToObj(res.data.snapshot))
      }).catch(err => reject(err))
    })
  },
  refreshStocks ({ commit, state }) {
    if (!state.stocks.length) return
    getStocksReal({
      stocks: state.stocks.join(',')
    }).then((res) => {
      commit('mergeReal', extractFieldsToObj(res.data.snapshot))
    }).catch(() => {})
  },
  addStock ({ commit, dispatch }, stockSymbols) {
    commit('addStock', stockSymbols)
  }
}
