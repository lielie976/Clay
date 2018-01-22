import { format } from 'date-fns'
import Timeago from 'timeago.js'

export function toFixed (value, digit) {
  return (value && typeof value === 'number') || value === 0 ? value.toFixed(digit) : value
}

export function numToRate (value, noPositive, noPercentage) {
  if ((value && typeof value === 'number') || value === 0) {
    const num = toFixed(value, 2)
    const percentage = noPercentage ? '' : '%'
    return num >= 0 ? `${noPositive ? '' : '+'}${num}${percentage}` : `${num}${percentage}`
  }
}

export function truncate (str, digit, suffix) {
  let newSuffix = typeof suffix === 'string' && str.length > digit ? suffix : ''
  return str.trim().substring(0, digit) + newSuffix
}

export function extractFieldsToObj (data) {
  const real = {}
  for (var i in data) {
    if (i !== 'fields') {
      real[i] = {}
      data.fields.forEach((field, idx) => {
        real[i][field] = data[i][idx]
      })
    }
  }
  return real
}

export function extractFieldsToArray (data) {
  return data.items.map((item) => {
    const tmp = {}
    data.fields.forEach((field, index) => {
      tmp[field] = item[index]
    })
    return tmp
  })
}

export function extractWowsApiTypeThree (data) {
  const real = {}
  for (var i in data.items) {
    if (i !== 'fields') {
      real[i] = {}
      data.fields.forEach((field, idx) => {
        real[i][field] = data.items[i][idx]
      })
    }
  }
  return real
}

export function renderMarketColor (val) {
  if (!val) return '-market-color--balance'
  if (val >= 0) {
    return '-market-color--rise'
  } else {
    return '-market-color--decline'
  }
}

export function formatDate (date, formats) {
  return format(date, formats)
}

export function reachWindowBottom () {
  return (window.innerHeight + window.scrollY) + 500 >= document.body.offsetHeight
}

export function timeago (time) {
  return Timeago().format(time, 'zh_CN')
}

export function getCNPriceNum (num) {
  if (!num || typeof num !== 'number') return
  if (num > 1e8) {
    return (num / 1e8).toFixed(1) + '亿'
  } else if (num > 1e4) {
    return (num / 1e4).toFixed(2) + '万'
  } else {
    return num.toFixed(2)
  }
}

export function getStockTradeStatus (status) {
  const tradeStatus = {
    OCALL: '集合竞价',
    TRADE: '交易中',
    HALT: '停牌',
    BREAK: '休市',
    INDEX: '指数'
  }
  return tradeStatus[status]
}

export function getMarketTextColor (rate) {
  if (!rate) return '-market-color--balance'
  return rate >= 0 ? '-market-color--rise' : '-market-color--decline'
}

export function getDateDay (time, useToday) {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const day = new Date(time).getDay()
  const today = new Date().getDay()
  if (useToday) {
    return day === today ? '今天' : days[day]
  } else {
    return days[day]
  }
}
