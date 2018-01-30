import wows from './wows';

export const getThermometer = (date) => {
  return wows.get('/v2/sheet/market_temperature', {
    params: {
      'date': date
    }
  })
}

export const fluctuationDistribution = () => {
  return wows.get('statis_data/quote_change')
}

export const fluctuationContrast = (date) => {
  return wows.get('statis_data/min_quote_change/normal', {
    params: {
      'date': date
    }
  })
}

export const limitContrast = (date) => {
  return wows.get('statis_data/min_quote_change/limit', {
    params: {
      'date': date
    }
  })
}

export const behaviorKline = (date) => {
  return wows.get('sheet/min_kline', {
    params: {
      'kline_type': 'a-stock-behavior-kline',
      'date': date
    }
  })
}

export const raiseIncompletedKline = (date) => {
  return wows.get('/sheet/min_kline', {
    params: {
      'kline_type': 'a-stock-raise-incompleted-kline',
      'date': date
    }
  })
}

export const getChart = () => {
  return wows.get(`/v3/pandora/snapshot/pcr`)
}
