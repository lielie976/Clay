import { getThermometer, fluctuationContrast, limitContrast, behaviorKline, raiseIncompletedKline, fluctuationDistribution } from '~/api/stockSummary'
import share from '~/utils/share'

export const state = () => ({
  fluctuationContrastData: null,
  behaviorKlineData: null,
  limitContrastData: null,
  raiseIncompletedKlineData: null,
  temperatureVal: null,
  fluctuationDistributionData: null
})

export const getters = {
}

export const mutations = {
  setFc (state, data) {
    state.fluctuationContrastData = share.dataBeautify(
      data,
      'field',
      'value'
    )
  },
  setBK (state, data) {
    state.behaviorKlineData = data
  },
  setLimit (state, data) {
    state.limitContrastData = share.dataBeautify(
      data,
      'field',
      'value'
    )
  },
  setRI (state, data) {
    state.raiseIncompletedKlineData = data
  },
  setTemperature (state, data) {
    state.temperatureVal = data
  },
  setFd (state, data) {
    state.fluctuationDistributionData = data
  }
}

export const actions = {
  async initSummary ({ state, commit, dispatch }, payload) {
    let initData = await Promise.all([
      fluctuationContrast(null),
      behaviorKline(payload),
      limitContrast(payload),
      raiseIncompletedKline(payload),
      getThermometer(payload),
      fluctuationDistribution()
    ])
    console.log(initData)
    let [fc, behavior, limit, riseic, temperature, fd] = initData
    commit('setFc', fc.data)
    commit('setBK', behavior.data.datas)
    commit('setLimit', limit.data)
    commit('setRI', riseic.data.datas)
    commit('setTemperature', Math.ceil(temperature.data.temperature))
    commit('setFd', fd.data)
    return initData
  }
}
