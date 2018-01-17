const webpack = require('webpack')
const texts = require('./app/utils/texts')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: `选股宝 | ${texts.slogan}`,
    meta: [
      { name: 'referrer', content: 'always' },
      { name: 'renderer', content: 'webkit' },
      { name: 'force-rendering', content: 'webkit' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: texts.description },
      { hid: 'keywords', name: 'keywords', content: texts.keywords }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_117096_bnogj2cncxm0lik9.css' },
      { rel: 'stylesheet', type: 'text/css', href: '//cdn.bootcss.com/minireset.css/0.0.2/minireset.min.css' }
    ],
    script: [
      { src: '/js/qrcode.js' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      config.resolve.extensions.push('.ts')

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(
        new webpack.DefinePlugin({
          CONFIG: JSON.stringify(require('./config'))
        })
      )
    },
    vendor: ['axios']
  },
  plugins: [
    '~/plugins/filters',
    '~/plugins/styles',
    { src: '~/plugins/lightgallerty', ssr: false }
  ],
  env: {
    ENV: process.env.ENV
  },
  srcDir: 'app/',
  modules: ['~modules/typescript.js'],
  router: {
    linkActiveClass: 'is-active-route'
  }
}
