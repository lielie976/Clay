import api from './wows'

export const getZhutikuRank = params => api.get('/v3/aioria/plates/rank', { params })
