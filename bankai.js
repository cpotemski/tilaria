const browserify = require('browserify')
const bankai = require('bankai')
const http = require('http')
const path = require('path')
const st = require('st')

const client = path.join(__dirname, 'dist', 'bundle.js')
const assets = bankai(client)

const staticMount = st({
  path: path.join(__dirname, 'static'),
  url: '/static',
  passthrough: true
})

http.createServer((req, res) => {
  switch (req.url) {
    case '/': return assets.html(req, res).pipe(res)
    case '/bundle.js': return assets.js(req, res).pipe(res)
    case '/bundle.css': return assets.css(req, res).pipe(res)
    default: staticMount(req, res, err => {
        return res.statusCode = 404 && res.end('404 not found')
      })

  }
}).listen(8001, () => {
  console.log('Server running on http://localhost:8001')
})
