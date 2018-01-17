// import wows from './wows'
import api from './index'

export const getBkjLinkedSubject = (id, params) => api.get(`/api/pc/bkjMsgs/${id}`, { params })
