import api from './index';
import wows from './wows';
import axios from 'axios'

export const fetchThemeMessage = ({ id, limit = 5, Mark = 0 }) => {
  return api({
    method: 'GET',
    url: `/api/pc/bkjMsgs/` + id,
    params: {
      limit,
      TailMark: Mark
    }
  })
}

export const fetchTheme = (id, token) => {
  return api({
    method: 'GET',
    url: `/api/pc/bankuaiji/` + id,
    headers: {
      'X-Appgo-Token': token
    }
  })
}

export const fetPlateSetInfo = ({ id }) => {
  return wows({
    method: 'GET',
    url: `/v3/aioria/plates/detail`,
    params: {
      id
    }
  })
}

export const fetPlateSetInfos = ({ids}) => {
  return wows({
    method: 'GET',
    url: `/v3/aioria/plates/summary/field`,
    params: {
      ids,
      fields: 'plate_id,plate_name,core_pcp,normal_pcp'
    }
  })
}

export const fetchFlow = ({ codes, days = 5 }) => {
  return wows({
    method: 'GET',
    url: `/v3/gildata/stock/live/fund/flow/days`,
    params: {
      codes,
      day_count: days
    }
  })
}

export const fetchLongtou = (plateIds) => {
  return wows({
    method: 'GET',
    url: `/v3/aioria/core/lead/today`,
    params: {
      'plate_ids': plateIds
    }
  })
}

export const getStockImage = ({ path, pixel }) => {
  return axios({
    method: 'GET',
    url: path + '&cat=' + pixel,
    params: {
    }
  })
}
