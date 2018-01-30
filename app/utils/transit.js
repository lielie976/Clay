/* eslint-disable */
export function transit(fn, duration, e) {
  return new Promise(resolve => {
    let start

    function step(now) {
      if (!start) start = now
      if (duration) {
        let t = (now - start) / duration
        if (t > 1) t = 1
        fn(e ? e(t) : t)
        if (t < 1) requestAnimationFrame(step)
        else resolve()
      } else {
        let t = now - start
        fn(t)
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  })
}

// https://gist.github.com/gre/1650294#gistcomment-1806616

export const easeOut = p => t => 1 - Math.abs(Math.pow(t - 1, p))
