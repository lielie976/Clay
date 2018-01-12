import { getTrending } from '~/api/settings'
import { getZhutiTopStocks } from '~/api/wows'

export const state = () => ({
  trending: []
})

export const mutations = {
  saveTrending (state, data) {
    state.trending = data
  }
}

export const actions = {
  getTrending ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getTrending().then((res) => {
        let trending = res
        getZhutiTopStocks({ ids: res.map(i => i.BkjId).join(',') }).then((res) => {
          const tops = res.data.items
          trending = trending.map((t) => {
            let longtou = tops[t.BkjId].codes.map(c => {
              const name = tops[t.BkjId].stocks.find(s => s.mdc_code === c).title
              return {
                Name: name,
                Symbol: c
              }
            }).slice(0, 2)
            return Object.assign(t, {
              longtou
            })
          })
          commit('saveTrending', trending)
        })
        resolve()
      }).catch(err => reject(err))
    })
  }
}
