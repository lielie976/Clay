import { getStockIndex } from '~/api/forex'
import { getQuoteChange, getThermometer } from '~/api/wows'
import { extractFieldsToObj } from '~/utils/helpers'

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
  quoteChange: {},
  thermometer: {}
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
  },
  saveThermometer (state, data) {
    state.thermometer = data
  }
}

export const actions = {
  getIndexes ({ commit }) {
    return new Promise((resolve, reject) => {
      getStockIndex().then((res) => {
        commit('saveIndexes', extractFieldsToObj(res.data.snapshot))
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
  },
  getThermometer ({ commit }) {
    return new Promise((resolve, reject) => {
      getThermometer().then((res) => {
        const data = {
          ...res.data,
          temperatureCeil: Math.ceil(res.data.temperature),
          boardStockCount: res.data.up_limited_count - res.data.new_limited_count,
          boomStockCount: res.data.up_limited_open_count,
          boomRatio:
            res.data.up_limited_open_count /
            (res.data.up_limited_count +
              res.data.up_limited_open_count -
              res.data.new_limited_count)
        }
        commit('saveThermometer', data)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
