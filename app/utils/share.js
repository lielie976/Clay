/* eslint-disable */
import isWeekend from 'date-fns/is_weekend'
export default {
  dataBeautify(data, fieldName, itemName) {
    let bData = null
    if (data && data[fieldName] && data[itemName] && data[itemName].length) {
      bData = data[itemName].map((item, index) => {
        let newItem = {}
        for (let key in item) {
          if (item.hasOwnProperty(key)) {
            newItem[data[fieldName][key]] = item[key]
          }
        }
        return newItem
      })
      return bData
    } else {
      return []
    }
  },
  dataBeautifySpecial(data) {
    if (!data || !data.items) {
      return
    }
    let bData = {}
    for (let key in data.items) {
      //key is symbol
      let newItem = []
      data.items[key].map((item, index) => {
        item.map((it, id) => {
          if (!newItem[index]) {
            newItem[index] = {}
          }
          newItem[index][data.fields[id]] = it
        })
      })
      bData[key] = newItem
    }
    return bData
  },
  stockIndexBeautify(source, symbol) {
    return {
      title: source[0],
      value: source[1],
      change: source[2],
      changeRatio: source[3],
      symbol: symbol
    }
  },
  differenceInDays(date1, date2) {
    return new Date(date1).getDay() != new Date(date2).getDay()
  },
  rendDOM(container, context, template) {
    document.querySelector(container).innerHTML = template(context)
  },
  getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop;
  },
  getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  },
  setLS(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  getLS(key) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key);
  },

  hsCodeToWscn(code) {
    if (!code) return ''
    if (fromHsMap[code]) return fromHsMap[code]
    if (code.substring(0, 3) === '1B0' && code.indexOf('.SS') === code.length - '.SS'.length) {
      return 'SH000' + code.substring(3, code.length - 3)
    }
    var sections = code.split('.')
    if (sections.length !== 2) return ''
    if (sections[1] === 'SS') {
      return 'SH' + sections[0]
    } else if (sections[1] === 'SZ') {
      return 'SZ' + sections[0]
    }

    return ''
  },
  getPageScroll() {
    let xScroll, yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) { // all other Explorers
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;
    }

    return {
      x: xScroll,
      y: yScroll
    }
  },
  inStockTime() {
    var today = new Date();
    var localoffset = -(today.getTimezoneOffset() / 60);
    var destoffset = 8;

    var offset = destoffset - localoffset;
    var time = new Date(new Date().getTime() + offset * 3600 * 1000)
    return (time.getHours() > 9 && time.getHours() < 15 || (time.getHours() == 9 && time.getMinutes() >= 15) || (time.getHours() == 15 && time.getMinutes() <= 10)) && !isWeekend(time)
  }

}
const fromHsMap = {
  "1A0001.SS": "SH000001",
  "1A0002.SS": "SH000002",
  "1A0003.SS": "SH000003",
  "2A01.SZ": "SZ399001",
  "2A02.SZ": "SZ399002",
  "2A03.SZ": "SZ399003",
  "2C01.SZ": "SZ399106",
  "2C02.SZ": "SZ399107",
  "2C03.SZ": "SZ399108",
}
