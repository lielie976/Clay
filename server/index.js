const fs = require('fs')
const path = require('path')
const app = require('express')()
const { Nuxt, Builder } = require('nuxt')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const api = require('./api')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.use(api)

// Import and set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const nuxt = new Nuxt(config)

// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
} else {
  //  production
  const logDirectory = path.join(__dirname, '../logs')
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  })
  app.use(morgan('combined', { stream: accessLogStream, flags: 'a' }))
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Start express server
app.listen(port, host, () => {
  if (!config.dev) {
    console.log(`Server running at port ${port}`)
  }
})
