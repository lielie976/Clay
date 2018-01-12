export function toFixed (value, digit) {
  return (value && typeof value === 'number') ? value.toFixed(digit) : value
}
