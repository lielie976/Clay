import { getUserBalance } from '~/api/premium'
import { getDuration, formatDate } from '~/utils/helpers'

export const state = () => ({
  isModalOpen: false,
  message: null,
  subject: {},
  selectedSubject: {
    index: 0,
    items: []
  },
  selectedType: '',
  payMethod: '',
  payStatus: 0 // 0 - 未支付， 1 - 待支付， 2 - 支付成功， 3 - 支付失败
})

export const getters = {
  selectedSubject (state) {
    if (state.selectedType === 'subject' && state.selectedSubject.items && typeof state.selectedSubject.index !== 'undefined') {
      return state.selectedSubject.items[state.selectedSubject.index]
    } else {
      return {}
    }
  },
  priceNeededToPay (state) {
    if (state.selectedType === 'message') {
      return state.message.Price - state.balance
    } else if (state.selectedType === 'subject' && state.selectedSubject.items.length) {
      return state.selectedSubject.items ? state.selectedSubject.items[state.selectedSubject.index].DiscountPrice - state.balance : null
    } else {
      return null
    }
  },
  subscribeDuration (state) {
    if (state.selectedType === 'message') return
    if (!state.selectedSubject.items.length) return
    const endDay = state.subject.RemainingDays + state.selectedSubject.items[state.selectedSubject.index].Days
    return `${formatDate(new Date(), 'YYYY/MM/DD')}-${formatDate(getDuration(endDay), 'YYYY/MM/DD')}`
  }
}

export const mutations = {
  toggleModal (state) {
    state.isModalOpen = !state.isModalOpen
    state.payMethod = ''
    state.payStatus = 0
  },
  saveMessage (state, data) {
    state.message = data
    state.subject = data.FromSubject
    // 新老接口 SubjSubscribeItems || SubscribeItems 字段名不一样
    state.selectedSubject.items = data.FromSubject.SubjSubscribeItems
    state.selectedType = 'message'
  },
  saveSubject (state, data) {
    state.subject = data
    state.selectedType = 'subject'
    state.selectedSubject = {
      index: data.SubscribeItems && (data.SubscribeItems.length - 1),
      items: data.SubscribeItems
    }
  },
  selectMsg (state) {
    state.selectedType = 'message'
  },
  selectSubject (state, index) {
    state.selectedType = 'subject'
    state.selectedSubject.index = index
  },
  saveBalance (state, balance) {
    state.balance = balance
  },
  changePayStatus (state, data) {
    const { status, method } = data
    state.payStatus = status || state.payStatus
    state.payMethod = method || state.payMethod
  }
}

export const actions = {
  async getBalance ({ rootState, commit }) {
    await getUserBalance(rootState.auth.headers).then((res) => {
      commit('saveBalance', res.data.balance)
    })
  }
}
