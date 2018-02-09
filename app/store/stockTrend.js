/* eslint-disable no-debugger */
import { fetchStockTrend } from '~/api/theme'
import { getKline } from '~/api/mdc'
// import share from '~/utils/share'

export const state = () => ({
  trend: null,
  stockList: null,
  preValue: null,
  kline: {},
  klineFields: null
})

export const mutations = {
  saveTrend (state, payload) {
    let newTrend = []
    payload.codes.map((c) => {
      if (newTrend.length === 0) {
        newTrend = payload.data[c]
      } else {
        newTrend = newTrend.map((item, index) => {
          if (index < payload.data[c].length) {
            return [...new Set(item.concat(payload.data[c][index]))]
          } else {
            return [...new Set(item.concat(payload.data[c][payload.data[c].length - 1]))]
          }
        })
      }
    })
    state.trend = newTrend
  },
  savePre (state, payload) {
    state.stockList = payload.codes
    let preValue = []
    preValue = payload.codes.map((c) => {
      return {
        code: c,
        type: 'stock',
        pre_close_px: payload.data[c][0]
      }
    })
    state.preValue = preValue
  },
  saveKline (state, payload) {
    state.kline[payload.code] = payload.data
    state.klineFields = payload.fields
  }
}

export const actions = {
  async getTrend ({ state, commit }, code) {
    let res = await fetchStockTrend(code)
    // let trend = share.dataBeautifySpecial(
    //   res.data.trend
    // )
    // commit('saveTrend', trend[code])
    let codeArr = code.split(',')
    commit('saveTrend', {data: res.data.trend.items, codes: codeArr})
    commit('savePre', {data: res.data.real.items, codes: codeArr})
    return {success: 1}
  },
  async getKline ({ state, commit }, code) {
    let promiseAll = []
    code.map(c => {
      promiseAll.push(getKline({prodCode: c}))
    })
    let resArr = await Promise.all(promiseAll)
    resArr.map(res => {
      code.map(c => {
        if (res.data.candle[c]) {
          commit('saveKline', {data: res.data.candle[c], code: c, fields: res.data.candle.fields})
        }
      })
    })
    return {}
  }
}
