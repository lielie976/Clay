/* eslint-disable */
import format from 'date-fns/format'

const stockState = {
  colorUp: 'rise',
  colorDown: 'down'
}

const tradeState={
  'OCALL':'集合竞价',
  'TRADE':'交易中',
  'HALT':'停牌',
  'BREAK':'休市',
  'INDEX':'指数',
}


export default {
  toString: o => JSON.stringify(o),
  color: n => '-market-color--' + (n === 0 ? 'gray' : n > 0 ? stockState.colorUp : stockState.colorDown),
  bgcolor: n => '-market-bg--' + (n === 0 ? 'balance' : n > 0 ? 'rise' : 'decline'),
  colorFlag: n => '-market-color-flag--' + (n === 0 ? 'gray' : n > 0 ? stockState.colorUp : stockState.colorDown),
  colorStr: n => (n === 0 ? '#919599' : n > 0 ? '#F3564D' : '#1CBF7B'),
  temperatureColor:n=>'-market-color--' + (n === 50 ? 'gray' : n > 50 ? stockState.colorUp : stockState.colorDown),
  arrow: n => n === 0 ? '' : n > 0 ? '▲' : '▼',
  price: (n, precision) => n.toFixed((precision === 0 ||(precision && typeof(precision) == 'number'))?precision:2),
  change: (n, precision) => (n > 0 ? '+' : '') + n.toFixed(precision && typeof(precision) ==='number'? precision: 2),
  changePositive: (n, precision) => (n > 0 ?  n.toFixed(precision && typeof(precision) ==='number'? precision: 2): '--') ,
  changeNegative: (n, precision) =>  n.toFixed(precision && typeof(precision) ==='number'? precision: 2)+'%',
  changeRate: n => (n > 0 ? '+' : '') + n.toFixed(2) + '%',
  rate: (n, precision) => (n*100).toFixed(precision && typeof(precision) ==='number'? precision: 0) + '%',
  percentage: n => n.toFixed(2) + '%',
  status: s => status[s],
  approxNumber: n => n>0?n > 1e8 ? (n / 1e8).toFixed(1) + '亿' : n > 10000 ? (n / 10000).toFixed(2) + '万' : n:n < -1e8 ? (n / 1e8).toFixed(1) + '亿' : n < -10000 ? (n / 10000).toFixed(2) + '万':n,
  inSortRule:(prop,sortRule)=>(sortRule.mode!='default' && prop ==sortRule.targetProp)?true:false,
  timeFormatter:(date,rule)=>format(new Date(date*1000), (rule && typeof(rule)==='string'?rule:'HH:mm:ss')),
  timeFormatterOpenBoard:(date,rule)=>{
    let time =format(new Date(date*1000), (rule && typeof(rule)==='string'?rule:'HH:mm:ss'))
    return time=='08:00:00'?'--:--:--':time
  },
  boolFilter:(bool)=>bool?'是':'否',
  inSubject:(subjectList,target)=>subjectList.indexOf(target)!=-1,
  bigNewsClass:(subjectList)=>subjectList && subjectList.indexOf('10')!=-1?'big-news':'',
  tradeStatus:(status)=>tradeState[String(status).toUpperCase()],
  priceChangeStatusColor:(later,before)=>'-market-color--' + (later === before ? 'gray' : later > before ? stockState.colorUp : stockState.colorDown),
  symbolFilter:(symbol)=>symbol.split('.')[0],
  newStockClass:(item)=>{
    let __turnover= Number(item.turnover_ratio)>2?'turnover ':' '
    let __open = item.bool_open_board?'open ':' '
    return __turnover + __open
  },
}
