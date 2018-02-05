import { redirectPremiumSubject } from '~/utils/constants'
import api from './index'
import baoerApi from './baoer'

export const getPurchasedMsgs = (params, headers) => baoerApi.get('/api/v2/pc/subjects/messages/paidList', {
  params: {
    sub_ids: Object.keys(redirectPremiumSubject).join(','),
    ...params
  },
  headers
})

export const getSubjectPremiumMsgs = (id, params) => baoerApi.get(`/api/v2/pc/subjects/${id}/messages`, { params })

export const getSubjectHotMsgs = ids => {
  return baoerApi.get(`/api/v2/pc/subjects/messages/hot`, {
    params: {
      sub_ids: ids || Object.keys(redirectPremiumSubject).join(','),
      page: 1,
      limit: 10,
      days: 30
    }
  })
}

export const getSubjectInfo = (id, headers) => baoerApi.get(`/api/v2/pc/subjects/${id}/info`, { headers })

export const getSubjectTrialMsgs = (id) => baoerApi.get(`/api/v2/pc/subjects/${id}/messages/trail`)

export const getUserBalance = headers => baoerApi.get('/api/v2/user/balance', { headers })

export const buyMsgByBaodi = (data, headers) => api({
  method: 'post',
  url: '/api/premium/purchaseMessage',
  data,
  headers
})

export const buySubjectByBaodi = (data, headers) => api({
  method: 'post',
  url: '/api/premium/subscribeSubject',
  data,
  headers
})

//  amount, pay_way, platform, product_type, product_id, return_url
export const createPayOrder = (data, headers) => baoerApi({
  method: 'post',
  url: '/api/v2/xgbpay/pay',
  headers,
  data
})

//  order_no
export const checkOrderStatus = (params, headers) => baoerApi({
  method: 'get',
  url: '/api/v2/xgbpay/query/result',
  headers,
  params
})
