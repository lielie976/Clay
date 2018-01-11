const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const app = require('express')()

// Body parser, to access `req.body`
app.use(bodyParser.json())

app.get('/about', (req, res) => {
  res.set('Content-Type', 'text/json')
  res.send({
    name: 'about me'
  })
})

// We instantiate Nuxt.js with the options
const isProd = process.env.NODE_ENV === 'production'
const nuxt = new Nuxt({ dev: !isProd })
// No build in production
if (!isProd) {
  const builder = new Builder(nuxt)
  builder.build()
}
app.use(nuxt.render)
app.listen(3000)
console.log('Server is listening on http://localhost:3000')