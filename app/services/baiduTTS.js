export default function readFromBaidu (text, token) {
  const t = document.createElement('audio')
  const oldNode = document.querySelector('.bdAudio')
  if (oldNode) {
    oldNode.parentNode.removeChild(oldNode)
  }
  t.setAttribute('class', 'bdAudio')
  t.src = `http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=${token}&tex=${text}&vol=9&per=0&spd=5&pit=5`
  t.addEventListener('ended', function () {
    document.body.removeChild(t)
  })
  document.body.appendChild(t)
  t.play()
}
