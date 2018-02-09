import axios from 'axios'
// import Cookies from 'js-cookie'
import config from '~/conf'

const api = axios.create({
  baseURL: config.WOWS_BAOER_API,
  timeout: 15 * 1000
})

api.interceptors.request.use((config) => {
  return config
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
