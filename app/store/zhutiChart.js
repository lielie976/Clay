/* eslint-disable no-debugger */

export const state = () => ({
  mode: 'fenshi',
  diejia: {
    fenshi: [],
    lishi: [],
    fenxi: [],
    timeRange: []
  }
})

export const mutations = {
  setData (state, data) {
    console.log('start')
    state.diejia.fenshi = data
    state.diejia.lishi = data
    state.diejia.fenxi = data
  },
  changeStock (state, data) {
    let arr = state.diejia[state.mode]
    state.diejia[state.mode] = arr.map(i => {
      if (i.Symbol === data.Symbol) {
        i.checked = !i.checked
        i._index = new Date().getTime()
      }
      return i
    })
  },
  changeMode (state, mode) {
    state.mode = mode
  },
  setTimeRange (state, data) {
    state.timeRange = data
  }
}

export const getters = {
  getData (state) {
    return {
      fenshi: state.diejia.fenshi.filter(i => i.checked),
      lishi: state.diejia.lishi.filter(i => i.checked),
      fenxi: state.diejia.fenxi.filter(i => i.checked)
    }
  },
  fff (state) {
    return state.diejia.lishi.filter(i => i.checked)
  }
}
export const actions = {
  initData ({ state, commit }, data) {
    commit('setData', data)
  }
}
