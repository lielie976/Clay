import { getUserBalance, buyMsgByBaodi, buySubjectByBaodi, createPayOrder, checkOrderStatus } from '~/api/premium'
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
  payStatus: 0, // 0 - 未支付， 1 - 待支付， 2 - 支付成功， 3 - 支付失败
  order: {}
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
    return `${formatDate(getDuration(state.subject.RemainingDays), 'YYYY/MM/DD')}-${formatDate(getDuration(endDay), 'YYYY/MM/DD')}`
  }
}

export const mutations = {
  toggleModal (state) {
    state.isModalOpen = !state.isModalOpen
    state.payMethod = ''
    state.payStatus = 0
  },
  saveMessage (state, data) {
    if (data && data.IsPremium && data.Price > 0 && !data.IsPaid) {
      state.message = data
      state.selectedType = 'message'
    } else {
      state.selectedType = 'subject'
      state.subject = data.FromSubject
      // 新老接口 SubjSubscribeItems || SubscribeItems 字段名不一样
      state.selectedSubject = {
        items: data.FromSubject.SubjSubscribeItems,
        index: data.FromSubject.SubjSubscribeItems && (data.FromSubject.SubjSubscribeItems.length - 1)
      }
    }
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
    state.payStatus = typeof status === 'undefined' ? state.payStatus : status
    state.payMethod = method || state.payMethod
  },
  saveOrder (state, data) {
    state.order = data
  }
}

export const actions = {
  async checkOrderStatus ({ commit, dispatch, rootState }, id) {
    const res = await checkOrderStatus(id, rootState.auth.headers)
    console.log(res.data.status)
    switch (res.data.status) {
      case 'pending': {
        break
      }
      case 'success': {
        await dispatch('payWithBalance')
        commit('changePayStatus', { status: 2 })
        break
      }
      case 'fail': {
        commit('changePayStatus', { status: 3 })
        break
      }
      default: {
        commit('changePayStatus', { status: 3 })
      }
    }
  },
  async createPayOrder ({ state, rootState, getters, commit }, payload) {
    const data = {
      amount: getters.priceNeededToPay,
      pay_way: payload.type,
      return_url: payload.returnUrl,
      product_type: state.selectedType === 'message' ? 1 : 2,
      product_id: Number(state.selectedType === 'message' ? state.message.Id : getters.selectedSubject.Id)
    }
    await createPayOrder(data, rootState.auth.headers).then((res) => {
      commit('saveOrder', res.data)
    })
  },
  async getBalance ({ rootState, commit }) {
    await getUserBalance(rootState.auth.headers).then((res) => {
      commit('saveBalance', res.data.balance)
    })
  },
  async payWithBalance ({ state, rootState, commit }) {
    if (state.selectedType === 'message') {
      const data = {
        MessageId: state.message.Id,
        SubjectId: state.message.FromSubject.Id,
        PayClientType: 2
      }
      try {
        await buyMsgByBaodi(data, rootState.auth.headers)
        commit('changePayStatus', { status: 2 })
      } catch (err) {
        console.log(err)
        commit('changePayStatus', { status: 3 })
      }
    } else if (state.selectedType === 'subject') {
      const item = state.selectedSubject.items[state.selectedSubject.index]
      const data = {
        ItemId: String(item.Id),
        SubjectId: String(state.subject.Id),
        Days: item.Days,
        Amount: Math.floor(item.DiscountPrice * 100),
        PayClientType: 2
      }
      try {
        await buySubjectByBaodi(data, rootState.auth.headers)
        commit('changePayStatus', { status: 2 })
      } catch (err) {
        console.log(err)
        commit('changePayStatus', { status: 3 })
      }
    }
  }
}
