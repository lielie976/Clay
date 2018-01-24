export const state = () => ({
  token: null,
  headers: {}
})

export const mutations = {
  saveToken (state, token) {
    state.token = token
    state.headers['X-Appgo-Token'] = token
  }
}

export const actions = {}
