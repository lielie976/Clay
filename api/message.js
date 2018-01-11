import api from './index'

export const getPcMsgs = params => api.get('/api/pc/msgs', { params })
export const getMessage = id => api.get(`/api/pc/msg/${id}`)
