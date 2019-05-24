'use strict'

const express = require('express')

class Api {
  constructor (endpoints) {
    this.endpoints = endpoints
  }

  start (host, port) {
    const app = express()
    const bodyParser = require('body-parser')

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/healthz', this.endpoints.healthz)
    app.get('/images/:id/thumbnail', this.endpoints.thumbnail)
    app.post('/images', this.endpoints.upload)

    console.log(`Image service run on ${host}:${port}`)

    app.listen(port, host)
    return app
  }
}

module.exports = Api
