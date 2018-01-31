import { fetchStockTrend } from '~/api/theme'
// import share from '~/utils/share'

export const state = () => ({
  trend: null
})

export const mutations = {
  saveTrend (state, data) {
    state.trend = data
  }
}

export const actions = {
  async getTrend ({ state, commit }, code) {
    let res = await fetchStockTrend(code)
    console.log(res)
    // let trend = share.dataBeautifySpecial(
    //   res.data.trend
    // )
    // commit('saveTrend', trend[code])
    commit('saveTrend', res.data.trend.items[code])
  }
}
