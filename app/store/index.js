import Cookies from 'cookies'

export const state = () => ({})

export const mutations = {}

export const actions = {
  nuxtServerInit ({ commit }, { req, res }) {
    const cookies = new Cookies(req, res)
    const token = cookies.get('_token')
    // const user = JSON.parse(decodeURIComponent(cookies.get('_user')))
    commit('userrr/saveToken', token)
  }
}
