/* eslint-disable camelcase */
import api from './index';
import wows from './wows';
import axios from 'axios'
import baoer from './baoer'

export const fetchThemeMessage = ({ id, limit = 10, Mark = 0 }) => {
  return api({
    method: 'GET',
    url: `/api/pc/bkjMsgs/` + id,
    params: {
      limit,
      TailMark: Mark
    }
  })
}

export const fetchTheme = (id, headers) => {
  return api({
    method: 'GET',
    url: `/api/pc/bankuaiji/` + id,
    headers
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

export const fetchResumption = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/resumption'
  })
}

export const fetchST = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/st'
  })
}

export const fetchsecStock = () => {
  return wows({
    method: 'GET',
    url: '/v2/sheet/sec_stock'
  })
}

export const fetchGaosongzhuanPlan = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/gaosongzhuan/plan'
  })
}

export const fetchGaosongzhuanComplete = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/gaosongzhuan/complete'
  })
}

export const fetchstRevoked = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/st-revoked'
  })
}

export const fetchLowpb = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/lowpb'
  })
}

export const fetchNewstock = () => {
  return wows({
    method: 'GET',
    url: '/v2/sheet/new_stock'
  })
}

export const fetchBoardPre = () => {
  return wows({
    method: 'GET',
    url: '/v3/saga/pool/board-preday'
  })
}

export const fetchThemePcrRank = () => {
  return wows({
    method: 'GET',
    url: '/v3/aioria/plates/pcr/rank'
  })
}

export const fetchThemeInfo = (ids, fields = 'plate_id,plate_name,core_pcp,normal_pcp,stocks') => {
  return wows({
    method: 'GET',
    url: '/v3/aioria/plates/summary/field',
    params: {
      ids,
      fields
    }
  })
}

export const fetchStockTrend = (prod_codes, fields = 'timestamp,last_px') => {
  return wows({
    method: 'GET',
    url: '/v3/aphrodite/trend',
    params: {
      fields,
      prod_codes
    }
  })
}

export const fetchRelatedTheme = (code) => {
  return wows({
    method: 'GET',
    url: '/v3/aioria/stock/relateds',
    params: {
      code
    }
  })
}

export const fetchEvent = ({head, tail, count = 20, types}) => {
  return wows({
    method: 'GET',
    url: '/v3/fit/event/list',
    params: {
      head,
      tail,
      count,
      types
    }
  })
}

export const fetchZhutiTrend = (prodCode) => {
  return wows({
    method: 'GET',
    url: '/v3/aioria/index/trend',
    params: {
      prod_code: prodCode
    }
  })
}

export const fetchZhutiKline = (prodCode) => {
  return wows({
    method: 'GET',
    url: '/v3/aioria/index/kline',
    params: {
      prod_code: prodCode
    }
  })
}

export const fetchGoodBad = ({plateId, from_time, end_time}) => {
  return baoer({
    method: 'GET',
    url: `/api/v2/pc/plates/${plateId}/messages/good-bad-event`,
    params: {
      from_time,
      end_time
    }
  })
}

export const fetchHideEvent = ({plateId, from_time, end_time}) => {
  return baoer({
    method: 'GET',
    url: `/api/v2/pc/plates/${plateId}/messages/future-hide-event`,
    params: {
      from_time,
      end_time
    }
  })
}
