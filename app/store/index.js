import Cookies from 'cookies'

export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, res }) {
    const cookies = new Cookies(req, res)
    const token = cookies.get('token')
    // const user = JSON.parse(decodeURIComponent(cookies.get('_user')))
    commit('auth/saveToken', token)
    await dispatch('subscribe/getBalance')
  }
}
