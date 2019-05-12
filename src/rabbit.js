'use strict'

const amqp = require('amqplib')

const HOST = process.env.RABBIT_HOST || 'localhost'
const USER = process.env.RABBIT_USER
const PASSWORD = process.env.RABBIT_PASSWORD
const queue = process.env.RABBIT_QUEUE

class Rabbit {
  constructor () {
    this.connection = null
  }

  start () {
    console.log('establishing a connection with rabbitmq')
    this.connection = amqp.connect(`amqp://${USER}:${PASSWORD}@${HOST}`).catch(function (error) {
      console.error('[AMQP] connection', error.message)
      setTimeout(this.start(), 10000)
    })
  }

  publish (msg) {
    this.connection.then(conn => {
      console.log('[AMQP] connection ready')
      return conn.createConfirmChannel().then(ch => {
        var ok = ch.assertQueue(queue, { durable: true })
        return ok.then(() => {
          ch.sendToQueue(queue, Buffer.from(msg), { deliveryMode: true })
          console.log(" [x] Sent '%s'", msg)
          return ch.close()
        })
      })
    })
  }
}

module.exports = Rabbit
