import api from './index'

export const getFastSubjects = () => api.get('/api/pc/fastSubject')

export const getSubject = (id, params) => api.get(`/api/pc/subj/${id}`, { params })
