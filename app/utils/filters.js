export function toFixed (value, digit) {
  return (value && typeof value === 'number') ? value.toFixed(digit) : value
}

export function numToRate (value) {
  if (value && typeof value === 'number') {
    const num = toFixed(value, 2)
    return num >= 0 ? `+${num}%` : `${num}%`
  }
}

export function truncate (str, digit, suffix) {
  let newSuffix = typeof suffix === 'string' && str.length > digit ? suffix : ''
  return str.trim().substring(0, digit) + newSuffix
}
