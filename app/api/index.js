import axios from 'axios'
// import Cookies from 'js-cookie'
import config from '~/conf'

const api = axios.create({
  baseURL: config.env.runTimeConfig.BASE_API,
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
