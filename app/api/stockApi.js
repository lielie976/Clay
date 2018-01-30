/* eslint-disable */
import wows from './wows';
export const stockApi = {
  boardstock(sortType,date,filter) {
    return wows.get('v2/sheet/board_stock?filter=' +filter, {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  },
  boomstock(sortType,date) {
    return wows.get('v2/sheet/boom_stock', {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  },
  newstock(sortType,date) {
    return wows.get('v2/sheet/new_stock', {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  },
  secstock(sortType,date) {
    return wows.get('v2/sheet/sec_stock', {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  },
  multistock(sortType,date) {
    return wows.get('v2/sheet/multi_stock', {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  },
  downstock(sortType,date){
    return wows.get('v3/saga/pool/board-down', {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  },
  boardpreday (sortType,date) {
    return wows.get('v3/saga/pool/board-preday', {
      params: {
        'sort': sortType,
        'date':date
      }
    })
  }
}
