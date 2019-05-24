'use strict'

class RabbitMock {
  constructor () {}

  async start () {}

  publish () {
    return new Promise(resolve => resolve())
  }
}

module.exports = RabbitMock
