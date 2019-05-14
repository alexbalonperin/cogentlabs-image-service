'use strict'

class RabbitMQMessage {
  constructor (id, imagePath) {
    this.id = id
    this.imagePath = imagePath
  }

  getId () {
    return this.id
  }

  getImagePath () {
    return this.imagePath
  }

  toString () {
    return JSON.stringify({ id: this.id, image_path: this.imagePath })
  }
}

module.exports = RabbitMQMessage
