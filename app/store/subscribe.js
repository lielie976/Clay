import { getUserBalance } from '~/api/premium'
import { getDuration, formatDate } from '~/utils/helpers'

export const state = () => ({
  isModalOpen: false,
  message: null,
  subject: {},
  selectedItem: {
    type: null,
    info: {}
  }
})

export const getters = {
  selectedSubject (state) {
    if (state.selectedItem.type === 'subject' && state.subject.SubjSubscribeItems && typeof state.selectedItem.index !== 'undefined') {
      return state.subject.SubjSubscribeItems[state.selectedItem.index]
    } else {
      return {}
    }
  },
  priceNeededToPay (state) {
    if (state.selectedItem.type === 'message') {
      return state.message.Price - state.balance
    } else if (state.selectedItem.type === 'subject') {
      return state.subject.SubjSubscribeItems ? state.subject.SubjSubscribeItems[state.selectedItem.index].DiscountPrice - state.balance : null
    } else {
      return null
    }
  },
  subscribeDuration (state) {
    if (state.selectedItem.type === 'message') return
    if (!state.subject.SubjSubscribeItems) return
    const endDay = state.subject.RemainingDays + state.subject.SubjSubscribeItems[state.selectedItem.index].Days
    return `${formatDate(new Date(), 'YYYY/MM/DD')}-${formatDate(getDuration(endDay), 'YYYY/MM/DD')}`
  }
}

export const mutations = {
  toggleModal (state) {
    state.isModalOpen = !state.isModalOpen
  },
  saveMessage (state, data) {
    state.message = data
    state.subject = data.FromSubject
    state.selectedItem.type = 'message'
  },
  saveSubject (state, data) {
    state.subject = data
    state.selectedItem.type = 'subject'
    state.selectedItem.index = data.SubjSubscribeItems && (data.SubjSubscribeItems.length - 1)
  },
  selectMsg (state) {
    state.selectedItem.type = 'message'
  },
  selectSubject (state, index) {
    state.selectedItem = {
      type: 'subject',
      index
    }
  },
  saveBalance (state, balance) {
    state.balance = balance
  }
}

export const actions = {
  async getBalance ({ rootState, commit }) {
    await getUserBalance(rootState.auth.headers).then((res) => {
      commit('saveBalance', res.data.balance)
    })
  }
}
