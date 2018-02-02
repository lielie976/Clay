const { Router } = require('express')
const axios = require('axios')
const URI = require('urijs')

const router = Router()

router.get('/sitemap.xml', (request, response) => {
  axios.get('http://api.xuangubao.cn/sitemap.xml').then(res => {
    const data = res.data.replace(new RegExp('https://api.xuangubao.cn', 'g'), 'http://www.xuangubao.cn')
    response.set('Content-Type', 'text/xml')
    return response.send(data)
  })
})

router.get('/sitemap-subjects-:id.xml', (request, response) => {
  axios.get(`http://api.xuangubao.cn/sitemap-subjects-${request.params.id}.xml`).then(res => {
    const data = res.data.replace(new RegExp('https://api.xuangubao.cn/web/subjects', 'g'), 'http://www.xuangubao.cn/subject')
    response.set('Content-Type', 'text/xml')
    return response.send(data)
  })
})

router.get('/sitemap-articles-:id.xml', (request, response) => {
  axios.get(`http://api.xuangubao.cn/sitemap-articles-${request.params.id}.xml`).then(res => {
    const data = res.data.replace(new RegExp('https://api.xuangubao.cn/web/articles', 'g'), 'http://www.xuangubao.cn/article')
    response.set('Content-Type', 'text/xml')
    return response.send(data)
  })
})

router.get('/auth/redirect', (request, response) => {
  let redirectURI = URI(request.query.redirect).search(data => ({
    ...data,
    code: request.query.code,
    state: request.query.state
  })).readable()
  response.redirect(redirectURI);
})

router.get('/ban-mobile', (request, response) => {
  if(request.headers['x-appgo-app-version']) {
    response.redirect('https://m.xuangubao.cn?iamapp=true')
  } else {
    response.redirect('https://m.xuangubao.cn')
  }
})

router.get('/ban/:id', (request, response) => {
  response.redirect('/dingpan/'+ request.params.id)
})

router.get('/ban', (request, response) => {
  response.redirect('/dingpan/0')
})

module.exports = router