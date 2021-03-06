import api from './index'

export const getAvailableAd = params => api.get('/api/pc/commercialsWithPosId', { params })

export const getTrending = () => api.get('/api/pc/panzhongfengkou')

export const getSettings = () => api.get('/api/pc/settings')

export const getmidLongTermStocks = () => api.get('/api/stocks/prices/midLongTerm')

export const getBaiduTTSToken = () => api.get('/api/pc/baiduToken')
