import Cookies from 'cookies'

export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, res }) {
    const cookies = new Cookies(req, res)
    const token = cookies.get('token')
    if (token) {
      dispatch('user/saveAuth', {
        Token: cookies.get('token'),
        nickname: cookies.get('nickname')
      })
      commit('auth/saveToken', token)
    }
    await dispatch('subscribe/getBalance')
  }
}
