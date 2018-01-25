import api from './baoer'

export const getBoughtMsgs = (params, headers) => api.get('/api/pc/messages/paidList', { params, headers })

export const getSubjectPremiumMsgs = (id, params) => api.get(`/api/pc/subjects/${id}/messages`, { params })

export const getSubjectHotMsgs = (id, params, headers) => api.get(`/api/pc/subjects/${id}/messages/hot`, { params, headers })

export const getSubjectInfo = (id, headers) => api.get(`/api/pc/subjects/${id}/info`, { headers })

export const getSubjectTrialMsgs = (id) => api.get(`/api/pc/subjects/${id}/messages/trail`)
