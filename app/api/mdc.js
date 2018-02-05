import axios from 'axios'
// import Cookies from 'js-cookie'
import config from '~/conf'

const api = axios.create({
  baseURL: config.MDC_API,
  timeout: 60 * 1000
})

api.interceptors.request.use((config) => {
  const conf = {
    ...config,
    headers: {
      ...config.headers
      // 'X-Ivanka-Token': Cookies.get('_token')
    }
  }
  return conf
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use((response) => {
  if (response.data.errcode) {
    return Promise.reject(response)
  }
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export default api

export const getStockTrend = ({
  prodCode,
  fields = 'min_time,last_px,avg_px,business_amount,business_balance'
}) => api.get('trend', {
  params: {
    fields,
    prod_code: prodCode
  }
})

export const getKline = ({
  prodCode,
  candlePeriod = '6',
  adjustPriceType = 'forward',
  fields = 'low_px,macd',
  dataCount = 200
}) => {
  return api.get('kline', {
    params: {
      fields,
      prod_code: prodCode,
      candle_period: candlePeriod,
      data_count: dataCount,
      adjust_price_type: adjustPriceType
    }
  })
}
