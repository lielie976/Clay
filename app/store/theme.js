import { fetchTheme, fetchThemeMessage, fetPlateSetInfo, fetchFlow, fetchLongtou } from '~/api/theme'
import { getStocksReal } from '~/api/wows'
import { extractFieldsToObj } from '~/utils/helpers'

export const state = () => ({
  themeInfo: {},
  themeMsg: {},
  plateSetInfo: {},
  excpetionTheme: ['24291465', '24898553', '17864537', '19322062', '17136297', '17290881', '27912881', '27924249'],
  themeStockSymbol: [],
  themeStockList: [],
  themeCount: {
    raise: 0,
    down: 0,
    stable: 0
  },
  stockReal: {},
  themeSets: [],
  accessMode: null,
  stockFlow: null,
  themeJinRiLongTou: null
})

export const getters = {

}

export const mutations = {
  setThemeInfo (state, data) {
    state.themeInfo = {
      ...data
    }
    // console.log(state)
  },
  setThemeMsg (state, data) {
    state.themeMsg = [...data]
  },

  setPlateSetInfo (state, data) {
    state.plateSetInfo = { ...data }
  },

  setThemeStockSymbol (state, data) {
    if (data.AllStocks && data.AllStocks.length) {
      state.themeStockSymbol = data.AllStocks.map(s => s.Symbol)
    }
  },

  setThemeStockList (state, data) {
    if (data.AllStocks && data.AllStocks.length) {
      state.themeStockList = data.AllStocks
    }
  },

  setStockReal (state, data) {
    state.stockReal = data
    let raise = 0;
    let stable = 0;
    let down = 0;
    state.themeStockList.map(item => {
      if (state.stockReal[item.Symbol]) {
        if (state.stockReal[item.Symbol].px_change > 0) raise = raise + 1;
        if (state.stockReal[item.Symbol].px_change === 0) stable = stable + 1;
        if (state.stockReal[item.Symbol].px_change < 0) down = down + 1;
      }
    })
    state.themeCount.raise = raise
    state.themeCount.stable = stable
    state.themeCount.down = down
  },

  setThemeSets (state, data) {
    state.themeSets = []
    console.log(data)
    data.map(i => {
      state.themeSets.push(i)
    })
  },

  setAccessMode (state, data) {
    state.accessMode = data
  },

  setStockFlow (state, data) {
    state.stockFlow = data
  },

  setLongTou (state, data) {
    state.themeJinRiLongTou = data
  }
}

export const actions = {
  getThemeInfo ({ commit, dispatch }, payload) {
    return fetchTheme(payload.id, payload.token).then(res => {
      commit('setThemeInfo', res.Data)
      commit('setThemeStockSymbol', res.Data)
      commit('setThemeStockList', res.Data)
      commit('setAccessMode', res.AccessMode)
      // await dispatch('getThemeStock')
    })
  },

  getThemeMessage ({ commit }, id) {
    return fetchThemeMessage({ id: id }).then(res => {
      commit('setThemeMsg', res.Messages.slice(0, 3))
    })
  },

  getPlateSetInfo ({ commit }, id) {
    return fetPlateSetInfo({ id: id }).then(res => {
      commit('setPlateSetInfo', res.data)
    })
  },

  getThemeStock ({ state, commit }, id) {
    if (state.themeStockSymbol) {
      let fields = 'prod_name,px_change,last_px,px_change_rate,trade_status,circulation_value,pe_rate,market_value,turnover_ratio';
      return getStocksReal({stocks: state.themeStockSymbol.join(','), fields}).then(res => {
        // console.log(res)
        let sr = extractFieldsToObj(res.data.snapshot)
        // console.log(stockReal)
        commit('setStockReal', sr)
      })
    } else {
      return Promise.resolve(0)
    }
  },

  getBkjInfo ({ state, commit }, id) {
    if (state.themeInfo && state.themeInfo.Ssets && state.themeInfo.Ssets.length > 1) {
      // console.log(state.themeInfo.Ssets)
      // fetPlateSetInfos(state.themeInfo.Ssets.map(s => s.SsBkjId).join(',')).then(res => {
      //   console.log(res)
      // })
      let promiseAll = []
      state.themeInfo.Ssets.map(item => {
        promiseAll.push(fetPlateSetInfo({ id: item.SsBkjId }).then(res => {
          return res.data
        }))
      })
      return Promise.all(promiseAll).then(resList => {
        if (resList && resList.length) {
          commit('setThemeSets', resList)
        }
      })
    } else {
      return Promise.resolve(0)
    }
  },

  getStockFlow ({ state, commit }, id) {
    return fetchFlow({ codes: state.themeStockSymbol.join(','), days: 5 }).then(res => {
      commit('setStockFlow', res.data)
    })
  },

  getLongtou ({ state, commit }, id) {
    return fetchLongtou(id).then(res => {
      console.log(res.data.items[id].items)
      commit('setLongTou', res.data.items[id].items)
    })
  }
}
