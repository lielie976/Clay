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

export function renderMarketColor (val) {
  console.log(val)
  if (val >= 0) {
    return '-market-color--rise'
  } else {
    return '-market-color--descline'
  }
}
