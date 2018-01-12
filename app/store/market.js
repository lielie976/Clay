import { getStockIndex } from '~/api/forex'
import { getQuoteChange } from '~/api/wows'
import { extractStocksReal } from '~/utils/helpers'

export const state = () => ({
  indexes: [{
    Name: '上证指数',
    Symbol: '000001.SS'
  }, {
    Name: '深证成指',
    Symbol: '399001.SZ'
  }, {
    Name: '创业板指',
    Symbol: '399006.SZ'
  }],
  quoteChange: {}
})

export const mutations = {
  saveIndexes (state, data) {
    state.indexes = state.indexes.map((index) => {
      return {
        ...index,
        ...data[index.Symbol]
      }
    })
  },
  saveQuoteChange (state, data) {
    state.quoteChange = data
  }
}

export const actions = {
  getIndexes ({ commit }) {
    return new Promise((resolve, reject) => {
      getStockIndex().then((res) => {
        commit('saveIndexes', extractStocksReal(res))
        resolve()
      }).catch(err => reject(err))
    })
  },
  getQuoteChange ({ commit }) {
    return new Promise((resolve, reject) => {
      getQuoteChange().then((res) => {
        commit('saveQuoteChange', res.data)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
