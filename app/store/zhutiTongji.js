import { fetchTongji } from '~/api/theme'
import share from '~/utils/share'

export const state = () => ({
  tongji: null
})

export const mutations = {
  saveTongji (state, payload) {
    state.tongji = payload.data
  }
}

export const actions = {
  async getTongji ({ state, commit }, payload) {
    let res = await fetchTongji(payload)
    console.log(res)
    commit('saveTongji', {data: share.dataBeautify(res.data, 'fields', 'items')})
  }
}
