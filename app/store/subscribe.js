import { getUserBalance, buyMsgByBaodi, buySubjectByBaodi, createPayOrder, checkOrderStatus } from '~/api/premium'
import { getDuration, formatDate } from '~/utils/helpers'
import { getPath } from 'underscore-contrib'

export const state = () => ({
  isModalOpen: false,
  message: null,
  subject: {},
  subjectItems: {
    index: 0,
    items: []
  },
  selectedType: '',
  payMethod: '',
  payStatus: 0, // 0 - 未支付， 1 - 待支付， 2 - 支付成功， 3 - 支付失败
  order: {},
  errmsg: ''
})

export const getters = {
  selectedSubjectItem (state) {
    const items = getPath(state, 'subjectItems.items')
    const index = getPath(state, 'subjectItems.index')
    if (state.selectedType !== 'subject') return {}
    if (!items.length) return {}
    return items[index] || {}
  },
  priceNeededToPay (state) {
    const items = getPath(state, 'subjectItems.items')
    const index = getPath(state, 'subjectItems.index')
    if (state.selectedType === 'message') {
      return state.message.Price - state.balance
    } else if (state.selectedType === 'subject' && items.length) {
      if (items) {
        const price = items[index].DiscountPrice - state.balance
        return parseFloat((price).toFixed(2))
      } else {
        return null
      }
    } else {
      return null
    }
  },
  subscribeDuration (state) {
    const items = getPath(state, 'subjectItems.items')
    const index = getPath(state, 'subjectItems.index')
    const remainingDays = getPath(state, 'subject.RemainingDays')
    if (state.selectedType === 'message') return
    if (!items.length) return
    const endDay = remainingDays + items[index].Days
    //  当前订阅结束时间 - 选择的订阅项目到期时间
    return `${formatDate(getDuration(remainingDays), 'YYYY/MM/DD')}-${formatDate(getDuration(endDay), 'YYYY/MM/DD')}`
  }
}

export const mutations = {
  toggleModal (state) {
    state.isModalOpen = !state.isModalOpen
    state.payMethod = ''
    state.payStatus = 0
  },
  saveMessage (state, data) {
    const isSubscribable = getPath(data, 'FromSubject.IsSubscribable')
    const items = getPath(data, 'FromSubject.SubjSubscribeItems')
    const remainingDays = getPath(data, 'FromSubject.RemainingDays')
    state.subjectItems.items = items || []
    if (isSubscribable && items && items.length) {
      if (data.IsPremium && !data.IsPaid && remainingDays === 0) {
        state.message = data
        state.selectedType = 'message'
      } else {
        state.selectedType = 'subject'
      }
      state.subject = data.FromSubject
      state.subjectItems.index = items && (items.length - 1)
    } else if (data.IsPremium && !data.IsPaid) {
      state.message = data
      state.selectedType = 'message'
    }
  },
  saveSubject (state, data) {
    const items = getPath(data, 'SubscribeItems')
    if (!items || !items.length) return
    state.subject = data
    state.selectedType = 'subject'
    state.subjectItems = {
      index: items && (items.length - 1),
      items: items
    }
  },
  selectMsg (state) {
    state.selectedType = 'message'
  },
  selectSubject (state, index) {
    state.selectedType = 'subject'
    state.subjectItems.index = index
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
  },
  outputErr (state, msg) {
    state.errmsg = msg
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
      product_id: Number(state.selectedType === 'message' ? state.message.Id : getters.subject.Id),
      subject_item_id: Number(getters.selectedSubjectItem.Id)
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
  async payWithBalance ({ state, rootState, commit, getters }) {
    // if (state.balance < getters.priceNeededToPay) {
    //   commit('outputErr', '余额不足！')
    //   commit('changePayStatus', { status: 3 })
    //   return
    // }
    if (state.selectedType === 'message') {
      const data = {
        MessageId: state.message.Id,
        SubjectId: state.message.FromSubject.Id,
        PayClientType: 2
      }
      try {
        const res = await buyMsgByBaodi(data, rootState.auth.headers)
        commit('saveBalance', res.result.Balance)
        commit('changePayStatus', { status: 2 })
      } catch (err) {
        if (err.data.errcode === 40001) {
          commit('outputErr', '余额不足！')
        }
        commit('changePayStatus', { status: 3 })
      }
    } else if (state.selectedType === 'subject') {
      const item = state.subjectItems.items[state.subjectItems.index]
      const data = {
        ItemId: String(item.Id),
        SubjectId: String(state.subject.Id),
        Days: item.Days,
        Amount: Math.floor(item.DiscountPrice * 100),
        PayClientType: 2
      }
      try {
        const res = await buySubjectByBaodi(data, rootState.auth.headers)
        commit('saveBalance', res.Balance)
        commit('changePayStatus', { status: 2 })
      } catch (err) {
        if (err.data.errcode === 40001) {
          commit('outputErr', '余额不足！')
        }
        commit('changePayStatus', { status: 3 })
      }
    }
  },
  toggleModal ({ commit, dispatch, rootState }) {
    if (rootState.user.userInfo.isLogged) {
      commit('toggleModal')
    } else {
      dispatch('login/showLogin', null, { root: true })
    }
  }
}
