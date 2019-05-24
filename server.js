process.title = 'image-service'

const redisLib = require('redis')
const rabbitClient = require('amqplib')
const Redis = require('./src/redis')
const Rabbit = require('./src/rabbit')
const Endpoints = require('./src/endpoints')
const Api = require('./src/api')

const redisClient = redisLib.createClient({ host: 'redis' })

const HOST = process.env.SERVICE_HOST || 'localhost'
const PORT = process.env.SERVICE_PORT || 8000

const rabbit = new Rabbit(rabbitClient)
rabbit.start()
const redis = new Redis(redisClient)
const endpoints = new Endpoints(redis, rabbit)

new Api(endpoints).start(HOST, PORT)
