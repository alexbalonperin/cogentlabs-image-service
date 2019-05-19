process.title = 'image-service'

const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const Rabbit = require('./src/rabbit')
const RabbitMQMessage = require('./src/message')

const Redis = require('./src/redis')

const redis = new Redis()

const uploadPath = '/tmp/uploads/'

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath)
}

const rabbit = new Rabbit()
rabbit.start()

const HOST = process.env.SERVICE_HOST || 'localhost'
const PORT = process.env.SERVICE_PORT || 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Image service')
})

app.get('/images/:id/thumbnail', (req, res) => {
  var id = req.params.id
  redis.get('' + id, function (err, json) {
    if (err) throw err
    var data = JSON.parse(json)
    console.log(data)
    if (data.status === 'ready') {
      res.type('png')
      res.sendFile(data.path)
    } else if (data.status === undefined) {
      res.type('html')
      res.send('Id not found')
    } else {
      res.type('html')
      res.send('Image not ready')
    }
  })
})

app.post('/images', (req, res) => {
  var fileExtension = req.header('FILE-EXTENSION')
  var id = process.hrtime.bigint()
  redis.setNew(id)
  var imagePath = uploadPath + 'upload-' + id + fileExtension
  var stream = fs.createWriteStream(imagePath)
  req
    .on('data', chunk => {
      stream.write(chunk)
    })
    .on('end', () => {
      stream.end()
      var msg = new RabbitMQMessage('' + id, imagePath)
      rabbit.publish(msg)
      redis.setPublished(id)
      res.send(JSON.stringify({ id: id.toString() }))
    })
})

console.log(`Image service run on ${HOST}:${PORT}`)

app.listen(PORT, HOST)
