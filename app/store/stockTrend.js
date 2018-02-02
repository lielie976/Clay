import { fetchStockTrend } from '~/api/theme'
// import share from '~/utils/share'

export const state = () => ({
  trend: null,
  stockList: null,
  preValue: null
})

export const mutations = {
  saveTrend (state, payload) {
    let newTrend = []
    payload.codes.map((c) => {
      if (newTrend.length === 0) {
        newTrend = payload.data[c]
        console.log(newTrend)
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
        symbol: c,
        pre_close_px: payload.data[c][0]
      }
    })
    state.preValue = preValue
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
  }
}
