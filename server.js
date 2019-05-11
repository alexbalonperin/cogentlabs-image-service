process.title = 'image-service'

var express = require('express')
var fileUpload = require('express-fileupload')
var app = express()
var bodyParser = require('body-parser')

const HOST = 'localhost'
const PORT = 8000

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Image service')
})

app.get('/images/:id', (req, res) => {
  res.send('Image not ready')
})

app.post('/images', (req, res) => {
  console.log(req.files)
  res.send('OK')
})

console.log(`Image service run on ${HOST}:${PORT}`)

app.listen(PORT, HOST)
