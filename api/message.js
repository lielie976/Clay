import api from './index'

export const getPcMsgs = params => api.get('/api/pc/msgs', { params })
