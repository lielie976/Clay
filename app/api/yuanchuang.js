import api from './index'

export const getYuanchuangLatest = () => api.get('/api/pc/original/msg/latest')
export const getYuanchuangTop = () => api.get('/api/pc/original/msg/top')
export const getYuanchuangRank = id => api.get(`/api/pc/original/msg/rank/${id}`)
export const getYuanchuangSubj = (id, params) => api.get(`/api/pc/originSubj/${id}`, { params })
