'use strict'

class Redis {
  constructor (redisClient) {
    redisClient.on('error', function (err) {
      console.log('Error ' + err)
    })

    this.redisClient = redisClient
  }
  set (key, value) {
    this.redisClient.set(key, value)
  }

  setNew (id) {
    if (this.get(id) !== null) {
      this.set(id, JSON.stringify({ status: 'new' }))
    } else {
      throw new Error(`trying to get unknown id ${id} in redis`)
    }
  }

  setPublished (id) {
    if (this.get(id) !== null) {
      this.set(id, JSON.stringify({ status: 'published' }))
    } else {
      throw new Error(`trying to get unknown id ${id} in redis`)
    }
  }

  get (id, cb) {
    return this.redisClient.get(id, cb)
  }
}

module.exports = Redis
