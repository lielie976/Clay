import axios from 'axios'
// import Cookies from 'js-cookie'
import config from '~/conf'

const api = axios.create({
  baseURL: config.WOWS_API,
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
  if (response.data.code !== 200) {
    return Promise.reject(response)
  }
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export default api

export const getStocksReal = ({
  fields = 'prod_name,px_change,last_px,px_change_rate,trade_status,circulation_value,pe_rate,market_value,turnover_ratio',
  stocks
}) => api.get('real', {
  params: {
    fields,
    en_prod_code: stocks
  }
})

export const getQuoteChange = () => api.get('statis_data/quote_change')

export const getThermometer = () => api.get('/v2/sheet/market_temperature')

export const getZhutiTopStocks = params => api.get('/v3/aioria/plates/stocks/top', { params })

export const getPlateInfos = params => api.get('/v3/aioria/plates/summary/field', { params })

export const searchBkjByName = params => api.get('/v3/search/plates', { params })

export const getPlateDetail = params => api.get('/v3/aioria/plates/detail', { params })
export const getChart = () => api.get(`/v3/pandora/snapshot/pcr`)
