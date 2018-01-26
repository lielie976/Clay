export const state = () => ({
  isModalOpen: false
})

export const mutations = {
  toggleModal (state) {
    state.isModalOpen = !state.isModalOpen
  }
}

export const actions = {}
