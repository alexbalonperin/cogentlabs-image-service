'use strict'

const amqp = require('amqplib')
const avro = require('avsc')

const type = avro.Type.forSchema({
  type: 'record',
  fields: [{ name: 'id', type: 'string' }, { name: 'image_path', type: 'string' }]
})

const HOST = process.env.RABBIT_HOST || 'localhost'
const USER = process.env.RABBIT_USER
const PASSWORD = process.env.RABBIT_PASSWORD
const queue = process.env.RABBIT_QUEUE

class Rabbit {
  constructor () {
    this.connection = null
  }

  async start () {
    console.log('establishing a connection with rabbitmq')
    await amqp.connect(`amqp://${USER}:${PASSWORD}@${HOST}`).then(
      conn => {
        console.log('connection established with rabbitmq')
        this.connection = conn
        process.once('SIGINT', () => {
          if (conn) conn.close()
        })
      },
      error => {
        console.error('[AMQP] connection', error.message)
        setTimeout(() => this.start(), 10000)
      }
    )
  }

  publish (msg) {
    return this.connection.createConfirmChannel().then(ch => {
      var ok = ch.assertQueue(queue, { durable: true })
      return ok.then(() => {
        const buf = type.toBuffer({ id: msg.getId(), image_path: msg.getImagePath() })
        ch.sendToQueue(queue, buf, { deliveryMode: true })
        console.log(" [x] Sent '%s'", msg)
        return ch.close()
      })
    })
  }
}

module.exports = Rabbit
