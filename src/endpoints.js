'use strict'

const fs = require('fs')
const RabbitMQMessage = require('./message')

const uploadPath = '/tmp/uploads/'

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath)
}

class Endpoints {
  constructor (redis, rabbit) {
    this.rabbit = rabbit
    this.redis = redis
    this.thumbnail = this.thumbnail.bind(this)
    this.upload = this.upload.bind(this)
  }

  healthz (req, res) {
    res.send('OK')
  }

  thumbnail (req, res) {
    var id = req.params.id
    this.redis.get('' + id, (err, json) => {
      if (err) throw err
      var data = JSON.parse(json)
      if (data && data.status === 'ready') {
        res.type('png')
        console.log('Getting file at path: ' + data.path)
        res.sendFile(data.path)
      } else if (data && data.status === undefined) {
        res.type('html')
        res.send('Id not found')
      } else {
        res.type('html')
        res.send('Image not ready')
      }
    })
  }

  upload (req, res) {
    var fileExtension = req.header('FILE-EXTENSION')
    var id = process.hrtime.bigint()
    this.redis.setNew(id)
    var imagePath = uploadPath + 'upload-' + id + fileExtension
    var stream = fs.createWriteStream(imagePath)
    req
      .on('data', chunk => {
        stream.write(chunk)
      })
      .on('end', () => {
        stream.end()
        var msg = new RabbitMQMessage('' + id, imagePath)
        this.rabbit.publish(msg).then(() => {
          this.redis.setPublished(id)
          res.send(JSON.stringify({ id: id.toString() }))
        })
      })
  }
}

module.exports = Endpoints
