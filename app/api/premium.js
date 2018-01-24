import api from './baoer'

export const getBoughtMsgs = (params, headers) => api.get('/api/pc/messages/paidList', { params, headers })

export const getSubjectPremiumMsgs = (id, params, headers) => api.get(`/api/pc/subjects/${id}/messages/paidList`, { params, headers })

export const getSubjectHotMsgs = (id, params, headers) => api.get(`/api/pc/subjects/${id}/messages/hot`, { params, headers })

export const getSubjectDetail = (id, params, headers) => api.get(`/api/pc/subjects/${id}/detail`, { params, headers })
