const browserify = require('browserify')
const bankai = require('bankai')
const http = require('http')
const path = require('path')
const st = require('st')

const client = path.join(__dirname, 'dist', 'bundle.js')

const assets = bankai()
const css = assets.css()
const js = assets.js(browserify, client)
const html = assets.html({
  title: 'Choo-Client'
})
const staticMount = st({
  path: path.join(__dirname, 'static'),
  url: '/static',
  passthrough: true
})

http.createServer((req, res) => {
  switch (req.url) {
    case '/': return html(req, res).pipe(res)
    case '/bundle.js': return js(req, res).pipe(res)
    case '/bundle.css': return css(req, res).pipe(res)
    default: staticMount(req, res, err => {
        return res.statusCode = 404 && res.end('404 not found')
      })

  }
}).listen(8001)
