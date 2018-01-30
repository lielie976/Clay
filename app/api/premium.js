import api from './index'
import baoerApi from './baoer'

export const getBoughtMsgs = (params, headers) => baoerApi.get('/api/v2/pc/messages/paidList', { params, headers })

export const getSubjectPremiumMsgs = (id, params) => baoerApi.get(`/api/v2/pc/subjects/${id}/messages`, { params })

export const getSubjectHotMsgs = (id, params, headers) => baoerApi.get(`/api/v2/pc/subjects/${id}/messages/hot`, { params, headers })

export const getSubjectInfo = (id, headers) => baoerApi.get(`/api/v2/pc/subjects/${id}/info`, { headers })

export const getSubjectTrialMsgs = (id) => baoerApi.get(`/api/v2/pc/subjects/${id}/messages/trail`)

export const getUserBalance = headers => baoerApi.get('/api/v2/user/balance', { headers })

export const buyMsgByBaodi = (data, headers) => api({
  method: 'post',
  url: '/api/premium/purchaseMessage',
  data,
  headers
})
