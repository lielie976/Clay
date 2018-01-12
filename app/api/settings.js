import api from './index'

export const getAvailableAd = params => api.get('/api/pc/commercialsWithPosId', { params })
