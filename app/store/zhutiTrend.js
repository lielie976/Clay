import { fetchZhutiTrend, fetchZhutiKline } from '~/api/theme'
// import share from '~/utils/share'

export const state = () => ({
  trend: null,
  zhutiId: null,
  preValue: null,
  kline: null
})

export const mutations = {
  saveTrend (state, payload) {
    state.trend = payload.data[payload.code]
  },
  saveId (state, id) {
    state.zhutiId = id
  },
  savePre (state, payload) {
    state.preValue = {
      code: payload.code,
      type: 'zhuti',
      pre_close_px: payload.data
    }
  },
  saveKline (state, payload) {
    state.kline = payload.data[payload.code]
  }
}

export const actions = {
  async getTrend ({ state, commit }, code) {
    let res = await fetchZhutiTrend(code)
    commit('saveId', code)
    commit('saveTrend', {data: res.data.trend, code: code})
    commit('savePre', {data: res.data.real.pre_close_px, code: code})
    return {success: 1}
  },
  async getKline ({ state, commit }, code) {
    let res = await fetchZhutiKline(code)
    console.log(res)
    commit('saveKline', {data: res.data.candle, code: code})
  }
}
