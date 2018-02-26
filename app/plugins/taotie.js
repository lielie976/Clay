import Taotie from 'wscn-taotie'
import config from '~/conf'

export default function ({ app }) {
  app.router.afterEach(() => {
    if (process.server) return
    const taotie = window.taotie = new Taotie({
      url: 'https://dashuju.wallstreetcn.com',
      appId: 'com.xuangubao.web',
      environment: config.TAOTIE_ENV,
      appVersion: '1.0.0'
    })
    const userInfo = JSON.parse(localStorage.getItem('_xgb_userinfo') || '{}')
    if (userInfo.Id) taotie.uid = Number(userInfo.Id) || 0
    taotie.send('PageViewEvent')
  })
}
