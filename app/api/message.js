import api from './index'

export const getPcMsgs = params => api.get('/api/pc/msgs', { params })
export const getMessage = (id, headers) => api.get(`/api/pc/msg/${id}`, { headers })
export const getYuanchuangLatest = () => api.get('/api/pc/original/msg/latest')
export const getYuanchuangTop = () => api.get('/api/pc/original/msg/top')
export const getYuanchuangRank = () => api.get('/api/pc/original/msg/rank')
export const getYuanchuangSubj = () => api.get('/api/pc/originSubj')
export const getHomeMsgs = params => api.get('/api/pc/msgs', { params })
