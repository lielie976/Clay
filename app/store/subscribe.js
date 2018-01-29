export const state = () => ({
  isModalOpen: false
})

export const mutations = {
  toggleModal (state) {
    state.isModalOpen = !state.isModalOpen
  }
}

export const actions = {
  toggleModal (ctx) {
    const { rootState, commit, dispatch } = ctx
    const { isLogged } = rootState.user
    console.log(ctx)
    if (isLogged) {
      commit('toggleModal')
    } else {
      dispatch('login/showLogin')
    }
  }
}
