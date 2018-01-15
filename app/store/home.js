import { getAvailableAd } from '~/api/settings'

export const state = () => ({
  banner: {}
})

export const mutations = {
  saveBanner (state, data) {
    state.banner = data
  }
}

export const actions = {
  getBanner ({ commit }) {
    return new Promise((resolve, reject) => {
      getAvailableAd({ PosIds: 600001 }).then((res) => {
        const data = res.find(i => i.PosId === 600001)
        commit('saveBanner', data)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
