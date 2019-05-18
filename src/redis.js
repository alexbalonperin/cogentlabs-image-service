'use strict'

const redis = require('redis')

const redisClient = redis.createClient({ host: 'redis' })
redisClient.on('error', function (err) {
  console.log('Error ' + err)
})

class Redis {
  set (key, value) {
    redisClient.set(key, value, redis.print)
  }

  setNew (id) {
    if (this.get(id) !== null) {
      this.set(id, 'new')
    } else {
      throw new Error(`trying to get unknown id ${id} in redis`)
    }
  }

  setPublished (id) {
    if (this.get(id) !== null) {
      this.set(id, 'published')
    } else {
      throw new Error(`trying to get unknown id ${id} in redis`)
    }
  }

  get (id, cb) {
    return redisClient.get(id, cb)
  }
}

module.exports = Redis
