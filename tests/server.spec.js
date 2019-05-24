const request = require('supertest')
const fs = require('fs')

const Endpoints = require('../src/endpoints')
const Api = require('../src/api')

const RedisMock = require('./mocks/redis')
const RabbitMock = require('./mocks/rabbit')

const rabbitMock = new RabbitMock()
const redisMock = new RedisMock()

const endpoints = new Endpoints(redisMock, rabbitMock)

const HOST = 'localhost'
const PORT = 8000
// const BASE_URL = `http://${HOST}:${PORT}`

const app = new Api(endpoints).start(HOST, PORT)

describe('GET /healthz', () => {
  it('should return 200', () => {
    request(app)
      .get('/healthz')
      .expect(200)
      .end(function (err) {
        if (err) throw err
      })
  })
})

describe('POST /images', () => {
  it('Accept small uploaded images', () => {
    const req = request(app)
      .post('/images')
      .set('content-type', 'application/octet-stream')
      .set('FILE-EXTENSION', '.jpg')
      .expect(200)
      .end(function (err) {
        if (err) throw err
      })
    const testImage = 'tests/fixtures/niijima.jpg'
    const imgStream = fs.createReadStream(testImage)
    imgStream.pipe(req)
    imgStream.on('error', err => console.log(err))
    imgStream.pipe(
      req,
      { end: false }
    )
  })
})
